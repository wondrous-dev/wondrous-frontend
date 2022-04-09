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
import snapshot from '@snapshot-labs/snapshot.js';
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import styled from 'styled-components'

import { ethers } from 'ethers'
import { useWonderWeb3 } from '../web3'

const SNAPSHOT_DOCS = "https://docs.snapshot.org/spaces/create"

// set to configure which snapshot API to use
// true = testnet
// false = hub
const isTestSnapshot = true;

const hub = isTestSnapshot
  ? 'https://testnet.snapshot.org'
  : 'https://hub.snapshot.org'
const snapshotClient = new snapshot.Client712(hub);

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

  // an object representing the 'integrations' field of Wonder 'Org'
  const [snapshot, setSnapshot] = useState(null)
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
  const [updateTaskProposal, { loading: updateTaskProposalLoading }] = useMutation(SET_SNAPSHOT_PROPOSAL, {
    onError: error => {
      console.error(`error updateTaskProposal(): ${error}`);
    }
  });

  // creates transaction to export proposal to snapshot, throws error if exporter doesn't have credentials or invalid proposal
  const exportTaskProposal = async (proposalId: string, title: string, body: string): Promise<void> => {
    //const provider = new ethers.providers.Web3Provider(wonderWeb3.web3Provider);
    const provider = wonderWeb3.web3Provider
    const account = wonderWeb3.address
    console.log(provider)
    console.log(account)
    const receipt = await snapshotClient.proposal(provider, account, {

    })
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

  const loading = getSnapshotSpaceLoading ||
    validateSnapshotLoading || getSnapshotLoading ||
    validateSnapshotLoading || connectSnapshotSpaceLoading ||
    disconnectSnapshotSpaceLoading || updateTaskProposalLoading

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
    exportTaskProposal,
    snapshotLoading
  }
}

const Link = styled.a`
  color: cyan;
`
