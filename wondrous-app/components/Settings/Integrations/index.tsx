import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery, gql, ApolloClient, InMemoryCache } from '@apollo/client';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';

import { useRouter } from 'next/router';
import { IntegrationsContainer } from './styles';

import { ethers } from 'ethers';
import snapshot from '@snapshot-labs/snapshot.js';
import SnapshotConfigSection from 'components/Settings/Integrations/SnapshotConfig';

// config to use proper snapshot hub address
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


const useSnapshot = () => {
  const [snapshotChecked, setSnapshotChecked] = useState(false)
  const [snapshotConnected, setSnapshotConnected] = useState(false)
  const [snapshotSpace, setSnapshotSpace] = useState({ name: '' })

  return {
    snapshotChecked,
    setSnapshotChecked,
    snapshotConnected,
    setSnapshotConnected,
    snapshotSpace,
    setSnapshotSpace
  }
}


const Integrations = (props) => {
  const router = useRouter();
  const { orgId, podId } = router.query;

  return (
    <SettingsWrapper>
      <IntegrationsContainer>
        <HeaderBlock
          // icon={<WrenchIcon circle />}
          title="Integrations Settings"
          description="Set up Wonder integrations with external applications"
        />
        <SnapshotConfigSection orgId={orgId} podId={podId}/>
      </IntegrationsContainer>
    </SettingsWrapper>
  );
};

export default Integrations;
