import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useMe } from 'components/Auth/withAuth';
import useStoredConnector from './useStoredConnector';
import connectors from '../connectors';

/**
 * Hook that tries to connect to an already authorized Web3 provider.
 * Only mount once, preferably in the Wallet component of the app.
 */
export default function useEagerConnect() {
  const user = useMe();
  const { activate } = useWeb3React();
  const { storedConnector } = useStoredConnector();
  console.log('useEagerConnect', storedConnector)
  useEffect(() => {
    // if (storedConnector) { //  === 'injected' FIXME this is hacky, not sure how to resolve
    //   activate(connectors[storedConnector], undefined, true).catch((err) => {
    //     console.log('Error while activating stored connector', err);
    //   });
    // }
  }, [user?.activeEthAddress, storedConnector, activate]);
}
