import { useState } from 'react';
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
  SET_SPACE
} from './gql';
import { isValidSpace } from './helpers';
import snapshot from '@snapshot-labs/snapshot.js';
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import styled from 'styled-components'

import { useWonderWeb3 } from '../web3'

const SNAPSHOT_DOCS = "https://docs.snapshot.org/spaces/create"

// set to configure which snapshot API to use
// true = testnet
// false = hub
const isTestSnapshot = true;

const hub = isTestSnapshot
  ? 'https://testnet.snapshot.org'
  : 'https://hub.snapshot.org'
const client = new snapshot.Client712(hub);

// snapshot graphql API
const snapshotAPI = isTestSnapshot
  ? 'https://testnet.snapshot.org/graphql'
  : 'https://hub.snapshot.org/graphql'

const cache = new InMemoryCache();
const snapshotClient = new ApolloClient({
  cache: cache,
  uri: snapshotAPI
});


export const getSnapshotUrl = (name: string): string => (
  `https://${isTestSnapshot ? `testnet` : `hub`}.snapshot.org/api/spaces/${name}/`
)

export const useSnapshot = () => {
  const EMPTY_SPACE = {
      id: '',
      name: '',
      network: '',
      symbol: '',
      strategies: [],
  }

  const [snapshotValid, setSnapshotValid] = useState(false);
  const [snapshotConnected, setSnapshotConnected] = useState(false);
  const [snapshotName, setSnapshotName] = useState('') // used to cache names
  const [snapshotSpace, setSnapshotSpace] = useState(EMPTY_SPACE)
  const [snapshotError, setSnapshotError] = useState(null)
  const wonderWeb3 = useWonderWeb3();

  // snapshot api to retrieve space data
  const [getSpace] = useLazyQuery(GET_SPACE, {
    client: snapshotClient,
    onCompleted: data => {
      // check to see if data is returned from query
      if (data.space) {
        console.log(data.space)
        // check if queried space includes User's address
        console.log(data.space.admins)
        if (data.space.admins.includes(wonderWeb3.address)) {
          setSnapshotSpace(data.space)
          setSnapshotValid(true)
          setSnapshotError('')
        } else {
          setSnapshotValid(false)
          setSnapshotError(`User is not an admin of '${data.space.id}'`)
        }
      } else {
        setSnapshotValid(false)
        setSnapshotError(`'${snapshotSpace.id}' not found. Please enter a valid Snapshot Space ENS.`)
      }
    },
    onError: error => {
      console.error(error)
    },
    fetchPolicy: 'cache-and-network'
  });

  const [checkSnapshot] = useLazyQuery(GET_SPACE, {
    client: snapshotClient,
    onCompleted: async (data) => {
      if (data.space !== null) {
        // check if queried space includes User's address
        if (data.space.admins.includes(wonderWeb3.address)) {
          setSnapshotSpace(data.space);
          setSnapshotValid(true);
          handleOnboardingError(data.space.id, Onboarding.Ready);
        } else {
          setSnapshotValid(false)
          handleOnboardingError(data.space.id, Onboarding.NotOwner);
        }
      } else {
        setSnapshotValid(false)
        handleOnboardingError(snapshotName, Onboarding.NotFound);
      }
    },
    onError: error => {
      console.error(error)
    },
    fetchPolicy: 'cache-and-network'
  });

  const [connectSnapshot] = useMutation(SET_SPACE, {
    onCompleted: data => {
      //console.log(data)
      setSnapshotConnected(true)
    },
    onError: error => {
      console.error(error)
    },
  })

  const handleOnboardingError = (id: string, onboarding: Onboarding): void => {
    if (onboarding !== Onboarding.Ready) {
      if (onboarding === Onboarding.NotFound) {
        setSnapshotError(
          <span>
            Snapshot '{id}' not found. Please enter a valid Snapshot Space ENS or follow <Link href={SNAPSHOT_DOCS} target="blank">Snapshot's guide on how to create one</Link>
          </span>
        )
      } else if (onboarding === Onboarding.NotOwner) {
        setSnapshotError(
          <span>
            User is not an admin of Snapshot '{id}'. Please update ENS text record or enter administered Snapshot.
            <Link href={SNAPSHOT_DOCS} target="blank"> Snapshot's documentation.</Link>
          </span>
        )
      }
    } else {
      setSnapshotError(null)
    }
  }


  return {
    EMPTY_SPACE,
    snapshotName,
    setSnapshotName,
    snapshotValid,
    setSnapshotValid,
    snapshotConnected,
    setSnapshotConnected,
    snapshotSpace,
    setSnapshotSpace,
    snapshotError,
    setSnapshotError,
    getSpace,
    checkSnapshot,
    connectSnapshot
  }
}

const Link = styled.a`
  color: cyan;
`
