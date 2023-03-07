import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { CONNECT_SNAPSHOT_TO_ORG, DISCONNECT_SNAPSHOT_TO_ORG } from 'graphql/mutations';
import { GET_ORG_SNAPSHOT_INFO, RENDER_RICH_TEXT } from 'graphql/queries';
import Snapshot from '@snapshot-labs/snapshot.js';

// import specific Web3Provider snapshot is using
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import apollo from 'services/apollo';
import { useWonderWeb3 } from '../web3';
import { GET_SPACE } from './gql';

const SNAPSHOT_DOCS = 'https://docs.snapshot.org/spaces/create';

// set to configure which snapshot API to use
// true = testnet
// false = hub
const isTestSnapshot = !process.env.NEXT_PUBLIC_PRODUCTION;

const hub = 'https://hub.snapshot.org';
const snapshotClient = new Snapshot.Client712(hub);

// snapshot graphql API
const snapshotAPI = `${hub}/graphql`;

const cache = new InMemoryCache();
const snapshotClientGQL = new ApolloClient({
  cache,
  uri: snapshotAPI,
});

// TODO: CHANGE ME - Adrian
export const getSnapshotUrl = (id: string): string => `hub.snapshot.org/api/spaces/${id}/`;

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
    admins: [],
  };

  const isTest = isTestSnapshot;
  // an object representing the org snapshot from db
  const [orgSnapshot, setOrgSnapshot] = useState(null);
  // a boolean value representing whether snapshot is valid, to be used in validation
  const [isSnapshotAdmin, setIsSnapshotAdmin] = useState(false);
  // a boolean value representing whether the snapshot space has been connected to Wonder Org in db
  const [snapshotConnected, setSnapshotConnected] = useState(false);
  // an object representing a Snapshot 'Space', as returned by Snapshot's API
  const [snapshotSpace, setSnapshotSpace] = useState(EMPTY_SPACE);
  // loading state for all Snapshot & Wonder API queries
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  // a JSX element presenting an error message extrapolated from an enum object
  const [snapshotErrorElement, setSnapshotErrorElement] = useState(null);
  // loading state for proposal submission
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [getSnapshotSpaceError, setGetSnapshotSpaceError] = useState(null);
  // wonder's web3 hook
  const wonderWeb3 = useWonderWeb3();

  // gets Snapshot 'Space' via Snapshot API, doesn't udpate local state
  const [getSnapshotSpace, { loading: getSnapshotSpaceLoading }] = useLazyQuery(GET_SPACE, {
    client: snapshotClientGQL,
    onError: (error) => {
      console.error(`Error getSnapshotSpace(): ${error}`);
    },
    onCompleted: (data) => {
      if (data.space) {
        setSnapshotSpace(data.space);
      } else {
        setGetSnapshotSpaceError(`'${snapshotSpace.name}' not found. Please enter a valid Snapshot Space ENS.`);
      }
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getSnapshotSpaceAndValidateAdmin] = useLazyQuery(GET_SPACE, {
    client: snapshotClientGQL,
    onCompleted: (data) => {
      if (data.space !== null) {
        // check if queried space includes User's address
        if (data.space.admins.includes(wonderWeb3.address)) {
          // if included, update state & clear for connection
          setSnapshotSpace(data.space);
          setIsSnapshotAdmin(true);
        } else {
          setIsSnapshotAdmin(false);
          setGetSnapshotSpaceError(
            `User is not an admin of '${data.space.id}' Please update ENS text record or enter administered Snapshot`
          );
        }
      } else {
        setIsSnapshotAdmin(false);
        setGetSnapshotSpaceError(`Snapshot Space not found. Please enter a valid Snapshot Space ENS.`);
      }
    },
    onError: (error) => {
      console.error(`Error validateSnapshotSpace(): ${error}`);
    },
    fetchPolicy: 'cache-and-network',
  });

  // checks for Snapshot stored in Wonder Org via Wonder API & updates state to reflect db
  const [getOrgSnapshotInfo, { loading: getOrgSnapshotInfoLoading }] = useLazyQuery(GET_ORG_SNAPSHOT_INFO, {
    onCompleted: (data) => {
      if (data?.getOrgSnapshotInfo) {
        const { snapshotEns, name, symbol, network, url } = data?.getOrgSnapshotInfo;
        // sets local state of integrations field from 'org' table, or null if nonexistent
        setOrgSnapshot({ snapshotEns, name, symbol, network, url });
        // updates snapshot connection state
        setSnapshotConnected(!!snapshotEns);
      }
    },
    onError: (error) => {
      console.error(`No snapshot currently connected to org: ${error}`);
    },
    fetchPolicy: 'network-only',
  });

  // updates Wonder db & local state w/ snapshot integrations data
  const [connectSnapshotToOrg, { loading: connectSnapshotSpaceLoading }] = useMutation(CONNECT_SNAPSHOT_TO_ORG, {
    onCompleted: (data) => {
      const { snapshotEns, name, symbol, url, network } = data.connectSnapshotToOrg;
      console.log('imheree??');
      setOrgSnapshot({ snapshotEns, name, symbol, url, network });
      setSnapshotConnected(true);
    },
    onError: (error) => {
      console.error(`Error connectSnapshot(): ${error}`);
    },
  });

  const [disconnectSnapshotToOrg] = useMutation(DISCONNECT_SNAPSHOT_TO_ORG, {
    onCompleted: (data) => {
      if (data?.disconnectSnapshotToOrg?.success) {
        setOrgSnapshot(null);
        setSnapshotConnected(false);
        setIsSnapshotAdmin(null);
      }
    },
    onError: (error) => {
      console.error(`Error connectSnapshot(): ${error}`);
    },
  });

  // update Task Proposal's snapshot_proposal field
  // const [updateSnapshotProposal, { loading: updateSnapshotProposalLoading }] = useMutation(SET_SNAPSHOT_PROPOSAL, {
  //   onError: (error) => {
  //     console.error(`error updateSnapshotProposal(): ${error}`);
  //   },
  // });

  // creates transaction to export proposal to snapshot, throws error if exporter doesn't have credentials or invalid proposal
  const exportTaskProposal = async (proposal: any): Promise<any> => {
    setSubmittingProposal(true);
    // const web3 = wonderWeb3.web3Provider;
    const provider = new Web3Provider(wonderWeb3.web3Provider);
    const account = ethers.utils.getAddress(wonderWeb3.address);
    const { data } = await getSnapshotSpace({ variables: { id: orgSnapshot.snapshotEns } });
    // deconstruct strategies if typed
    const strategies = data.space.strategies.map((strat) => ({
      name: strat.name,
      network: strat.network,
      params: strat.params,
    }));

    const numWeeks = 1;
    const weekLater = new Date();
    RENDER_RICH_TEXT;
    console.log(typeof proposal.description);
    const { data: renderRichTextData } = await apollo.query({
      query: RENDER_RICH_TEXT,
      variables: {
        jsonText: proposal.description,
      },
    });
    console.log(renderRichTextData);
    weekLater.setDate(weekLater.getDate() + numWeeks * 7);
    const proposalToValidate = {
      name: proposal.title,
      body: renderRichTextData?.renderRichText,
      choices: ['For', 'Against', 'Abstain'],
      start: Math.floor(Date.now() / 1000),
      end: proposal.dueDate
        ? Math.floor(Date.parse(proposal.dueDate) / 1000)
        : Math.floor(Date.parse(weekLater.toDateString()) / 1000),
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
      },
    };
    const proposalToSubmit = {
      space: orgSnapshot.snapshotEns,
      title: proposal.title,
      body: renderRichTextData?.renderRichText,
      choices: ['For', 'Against', 'Abstain'],
      // timestamp: Math.floor(Date.now() / 1000),
      start: Math.floor(Date.now() / 1000),
      end: proposal.dueDate
        ? Math.floor(Date.parse(proposal.dueDate) / 1000)
        : Math.floor(Date.parse(weekLater.toDateString()) / 1000),
      snapshot: await provider.getBlockNumber(),
      type: 'single-choice',
      network: data.space.network,
      discussion: '',
      // from: account,
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
        : '{}',
    };
    console.log('proposalToSubmit', proposalToSubmit);

    const valid = validateProposal(proposalToValidate);
    if (valid) {
      let receipt: any;
      try {
        receipt = await snapshotClient.proposal(provider, account, proposalToSubmit);
      } catch (err) {
        console.error('error proposing snapshot', err);
        setSubmittingProposal(false);
      }
      console.log('proposal:', receipt);
      setSubmittingProposal(false);
      return receipt;
    }
    setSubmittingProposal(false);
  };

  const cancelProposal = async (proposalId: string) => {
    const provider = new Web3Provider(wonderWeb3.web3Provider);
    const account = ethers.utils.getAddress(wonderWeb3.address);

    return await snapshotClient.cancelProposal(provider, account, {
      space: orgSnapshot.snapshotEns,
      proposal: proposalId,
    });
  };

  const validateProposal = (proposal: any): boolean => {
    const valid = Snapshot.utils.validateSchema(Snapshot.schemas.proposal, proposal);
    if (typeof valid !== 'boolean' && !valid) {
      const errors = [];
      valid.forEach((err) => {
        const field = err.instancePath.slice(1);
        const { message } = err;
        errors.push(`${field}: ${message}`);
      });
      console.log(errors);
      return false;
    }
    setSnapshotErrorElement(null);
    return true;
  };

  const loading =
    getSnapshotSpaceLoading ||
    getOrgSnapshotInfoLoading ||
    connectSnapshotSpaceLoading ||
    // updateSnapshotProposalLoading ||
    submittingProposal;

  useEffect(() => {
    setSnapshotLoading(loading);
    return () => void setSnapshotLoading(false);
  }, [loading]);

  return {
    EMPTY_SPACE,
    snapshotClient,
    isSnapshotAdmin,
    snapshotConnected,
    snapshotSpace,
    snapshotErrorElement,
    getSnapshotSpace,
    getSnapshotSpaceError,
    getSnapshotSpaceAndValidateAdmin,
    orgSnapshot,
    getOrgSnapshotInfo,
    connectSnapshotToOrg,
    disconnectSnapshotToOrg,
    // updateSnapshotProposal,
    exportTaskProposal,
    cancelProposal,
    snapshotLoading,
    isTest, // for testing purposes
  };
};
