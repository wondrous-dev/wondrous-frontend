import { useEffect, useState } from 'react';
import axios from 'axios'
import { useLazyQuery, useMutation, gql, ApolloClient, InMemoryCache } from '@apollo/client';
import {
  Categories,
  Filters,
  Onboarding,
  ProposalType,
  Proposal,
  Space,
  Strategy,
  Validation,
  Vote
} from './types';
import {
  GET_SPACE,
  GET_SNAPSHOT,
  SET_SPACE,
  SET_SNAPSHOT_PROPOSAL
} from './gql';
import { isValidSpace } from './helpers';
import Snapshot from '@snapshot-labs/snapshot.js';
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import styled from 'styled-components'

import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useWonderWeb3 } from '../web3';

import { SupportedChainType } from '../../utils/web3Constants';
import { getUserSigningMessage } from '../../components/Auth/withAuth';
import signedMessageIsString from '@services/web3/utils/signedMessageIsString';

const SNAPSHOT_DOCS = "https://docs.snapshot.org/spaces/create";

// set to configure which snapshot API to use
// true = testnet
// false = hub
const isTestSnapshot = true;

const hub = isTestSnapshot
  ? 'https://testnet.snapshot.org'
  : 'https://hub.snapshot.org'
const snapshotClient = new Snapshot.Client712(hub);

// snapshot graphql API
const snapshotAPI = `${hub}/graphql`

const cache = new InMemoryCache();
const snapshotClientGQL = new ApolloClient({
  cache: cache,
  uri: snapshotAPI
});

export const getSnapshotUrl = (name: string): string => (
  `https://${isTestSnapshot ? `testnet` : `hub`}.snapshot.org/api/spaces/${name}/`
);

/**
 * useSnapshot -- state hooks to interact with Snapshot & Wonder's snapshot-related APIs
 */

export const useSnapshot = () => {
  const EMPTY_SPACE = {
    id: '',
    name: '',
    network: '',
    symbol: '',
    strategies: [],
  }

  const isTest = isTestSnapshot;
  // an object representing the 'integrations' field of Wonder 'Org'
  const [snapshot, setSnapshot] = useState(null);
  // a boolean value representing whether snapshot is valid, to be used in validation
  const [snapshotValid, setSnapshotValid] = useState(false);
  // a boolean value representing whether the snapshot space has been connected to Wonder Org in db
  const [snapshotConnected, setSnapshotConnected] = useState(false);
  // cached snapshot name, can be used in input field to store value to query
  const [snapshotName, setSnapshotName] = useState(''); // used to cache names
  // an object representing a Snapshot 'Space', as returned by Snapshot's API
  const [snapshotSpace, setSnapshotSpace] = useState(EMPTY_SPACE);
  // loading state for all Snapshot & Wonder API queries
  const [snapshotLoading, setSnapshotLoading] = useState(false)
  // a JSX element presenting an error message extrapolated from an enum object
  const [snapshotErrorElement, setSnapshotErrorElement] = useState(null);
  // loading state for proposal submission
  const [submittingProposal, setSubmittingProposal] = useState(false);
  // wonder's web3 hook
  const wonderWeb3 = useWonderWeb3();

  // gets Snapshot 'Space' via Snapshot API, doesn't udpate local state
  const [getSnapshotSpace, { loading: getSnapshotSpaceLoading }] = useLazyQuery(GET_SPACE, {
    client: snapshotClientGQL,
    onError: error => {
      console.error(`Error getSnapshotSpace(): ${error}`);
    },
    fetchPolicy: 'cache-and-network'
  });

  // checks snapshot space via Snapshot API & updates state to reflect db
  const [validateSnapshotSpace, { loading: validateSnapshotSpaceLoading }] = useLazyQuery(GET_SPACE, {
    client: snapshotClientGQL,
    onCompleted: (data) => {
      if (data.space !== null) {
        // check if queried space includes User's address
        if (data.space.admins.includes(wonderWeb3.address)) {
          // if included, update state & clear for connection
          setSnapshotSpace(data.space);
          setSnapshotValid(true);
          handleOnboardingError(data.space.id, Onboarding.Ready);
        } else {
          setSnapshotValid(false);
          handleOnboardingError(data.space.id, Onboarding.NotOwner);
        }
      } else {
        setSnapshotValid(false);
        handleOnboardingError(snapshotName, Onboarding.NotFound);
      }
    },
    onError: error => {
      console.error(`Error validateSnapshotSpace(): ${error}`);
    },
    fetchPolicy: 'cache-and-network'
  });

  // gets Snapshot via Wonder API, doesn't update local state
  const [getSnapshot, { loading: getSnapshotLoading }] = useLazyQuery(GET_SNAPSHOT, {
    onError: error => {
      console.error(`Error getSnapshot(): ${error}`);
    },
    fetchPolicy: 'network-only'
  });

  // checks for Snapshot stored in Wonder Org via Wonder API & updates state to reflect db
  const [validateSnapshot, { loading: validateSnapshotLoading }] = useLazyQuery(GET_SNAPSHOT, {
    onCompleted: data => {
      // returns 'null' if there no data is in the integrations column of 'org' table
      const snapshot = data.getOrgById.integrations
        ? data.getOrgById.integrations[0]
        : null;
      // sets local state of integrations field from 'org' table, or null if nonexistent
      setSnapshot(snapshot);
      // sets cached name, to ensure persistence
      setSnapshotName(snapshot.key);
      // updates snapshot connection state
      setSnapshotConnected(snapshot.key ? true : false);
    },
    onError: error => {
      console.error(`Error validateSnapshot(): ${error}`);
    },
    fetchPolicy: 'network-only'
  });

  // updates Wonder db & local state w/ snapshot integrations data
  const [connectSnapshotSpace, { loading: connectSnapshotSpaceLoading }] = useMutation(SET_SPACE, {
    onCompleted: data => {
      const [integrations] = data.updateOrg.integrations
      setSnapshot(integrations)
      setSnapshotConnected(true);
    },
    onError: error => {
      console.error(`Error connectSnapshot(): ${error}`);
    },
  });

  // disconnects snapshot space in Wonder db & local state
  // (same as connectSnapshotSpace, except updates snapshotConnection to false)
  const [disconnectSnapshotSpace, { loading: disconnectSnapshotSpaceLoading }] = useMutation(SET_SPACE, {
    onCompleted: data => {
      const [integrations] = data.updateOrg.integrations
      setSnapshot(integrations)
      setSnapshotConnected(false);
    },
    onError: error => {
      console.error(`Error disconnectSnapshot(): ${error}`);
    },
  });

  // update Task Proposal's snapshot_proposal field
  const [updateSnapshotProposal, { loading: updateSnapshotProposalLoading }] = useMutation(SET_SNAPSHOT_PROPOSAL, {
    onError: error => {
      console.error(`error updateSnapshotProposal(): ${error}`);
    }
  });

  // creates transaction to export proposal to snapshot, throws error if exporter doesn't have credentials or invalid proposal
  // HAVING ISSUES, trying to solve w/ Snapshot team
  const exportTaskProposal = async (proposal: any): Promise<object | void> => {
    setSubmittingProposal(true)
    //const web3 = wonderWeb3.web3Provider;
    const provider = new ethers.providers.Web3Provider(wonderWeb3.web3Provider);
    const account = ethers.utils.getAddress(wonderWeb3.address);
    const { data } = await getSnapshotSpace({ variables: { id: snapshot.key } });

    // deconstruct strategies if typed
    const strategies = data.space.strategies.map(strat => ({
      name: strat.name,
      network: strat.network,
      params: strat.params
    }))

    const proposalToValidate = {
      name: proposal.title,
      body: proposal.description,
      choices: ['For', 'Against', 'Abstain'],
      start: Math.floor(Date.now() / 1000),
      end: Math.floor(Date.parse(proposal.dueDate) / 1000),
      snapshot: await provider.getBlockNumber(),
      type: 'single-choice',
      discussion: '',
      metadata: {
        strategies: JSON.stringify(strategies),
        plugins: data.space.plugins
          ? typeof data.space.plugins === 'string'
              ? data.space.plugins
              : JSON.stringify(data.space.plugins)
          : '{}',
      }
    }

    const proposalToSubmit = {
      space: snapshot.key,
      title: proposal.title,
      body: proposal.description,
      choices: ['For', 'Against', 'Abstain'],
      //timestamp: Math.floor(Date.now() / 1000),
      start: Math.floor(Date.now() / 1000),
      end: Math.floor(Date.parse(proposal.dueDate) / 1000),
      snapshot: await provider.getBlockNumber(),
      type: 'single-choice',
      network: data.space.network,
      discussion: '',
      //from: account,
      strategies: JSON.stringify(strategies),
      plugins: data.space.plugins
        ? typeof data.space.plugins === 'string'
            ? data.space.plugins
            : JSON.stringify(data.space.plugins)
        : '{}',
      metadata: data.space.metadata
        ? typeof data.space.metadata === 'string'
            ? data.space.metadata
            : JSON.stringify(data.space.metadata)
        : '{}'
    }

    const valid = validateProposal(proposalToValidate)
    //console.log(Snapshot.utils.validateSchema(Snapshot.schemas.proposal, formattedProposal))

    if (valid) {
      const receipt: any = await snapshotClient.proposal(provider, account, proposalToSubmit).catch(err => console.error(err));
      console.log(receipt);
      setSubmittingProposal(false);
      return receipt;
    }
    setSubmittingProposal(false);
  }

  const cancelProposal = async (proposalId: string) => {
    const provider = new ethers.providers.Web3Provider(wonderWeb3.web3Provider);
    const account = ethers.utils.getAddress(wonderWeb3.address);

    return await snapshotClient.cancelProposal(provider, account, {
      space: snapshot.key,
      proposal: proposalId
    });
  }

  const validateProposal = (proposal: any): boolean => {
    const valid = Snapshot.utils.validateSchema(Snapshot.schemas.proposal, proposal)
    if (typeof valid !== 'boolean' && valid !== true) {
      const errors = []
      valid.forEach(err => {
        const field = err.instancePath.slice(1)
        const message = err.message
        errors.push(`${field}: ${message}`)
      })
      console.log(errors)
      handleProposalError(errors)
      return false
    } else {
      setSnapshotErrorElement(null)
      return true
    }
  }

  // error switching function
  // takes in Enum, returns JSX element w/ corresponding Error text
  const handleOnboardingError = (id: string, onboarding: Onboarding): void => {
    if (onboarding !== Onboarding.Ready) {
      if (onboarding === Onboarding.NotFound) {
        setSnapshotErrorElement(
          <span>
            Snapshot '{id}' not found. Please enter a valid Snapshot Space ENS or follow <Link href={SNAPSHOT_DOCS} target="blank">Snapshot's guide on how to create one</Link>
          </span>
        )
      } else if (onboarding === Onboarding.NotOwner) {
        setSnapshotErrorElement(
          <span>
            User is not an admin of Snapshot '{id}'. Please update ENS text record or enter administered Snapshot.
            <Link href={SNAPSHOT_DOCS} target="blank"> Snapshot's documentation.</Link>
          </span>
        )
      }
    } else {
      setSnapshotErrorElement(null)
    }
  }

  const handleProposalError = (errors: string[]) => {
    const elements = [<span>Proposal invalid.</span>]
    // more in-depth error logging for proposal validation: CSS issues prevent proper formatting.
    elements.push(
      <Link href={SNAPSHOT_DOCS}>See Snapshot proposal guidelines.</Link>
    )
    setSnapshotErrorElement(elements)
  }

  const loading = getSnapshotSpaceLoading ||
    validateSnapshotLoading || getSnapshotLoading ||
    validateSnapshotLoading || connectSnapshotSpaceLoading ||
    disconnectSnapshotSpaceLoading || updateSnapshotProposalLoading ||
    submittingProposal

  useEffect(() => {
    setSnapshotLoading(loading)
    return () => void setSnapshotLoading(false)
  }, [loading])

  return {
    EMPTY_SPACE,
    snapshotClient,
    snapshotName,
    setSnapshotName,
    snapshotValid,
    setSnapshotValid,
    snapshotConnected,
    setSnapshotConnected,
    snapshotSpace,
    setSnapshotSpace,
    snapshotErrorElement,
    setSnapshotErrorElement,
    getSnapshotSpace,
    getSnapshot,
    validateSnapshotSpace,
    snapshot,
    setSnapshot,
    validateSnapshot,
    connectSnapshotSpace,
    disconnectSnapshotSpace,
    updateSnapshotProposal,
    exportTaskProposal,
    cancelProposal,
    snapshotLoading,
    isTest // for testing purposes
  }
}

const Link = styled.a`
  color: cyan;
`
