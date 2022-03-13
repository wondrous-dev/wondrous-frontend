import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import connectorsWithAuth from '../connectors/authMethodsMap';
import { useMe } from '@components/Auth/withAuth';
import useWonderWeb3 from './useWonderWeb3';

/**
 * Hook that tries to connect to an already authorized Web3 provider.
 * Only mount once, preferably in the Wallet component of the app.
 */
export default function useEagerConnect() {
  const user = useMe();
  const { activate, active } = useWeb3React();
  const { toChecksumAddress } = useWonderWeb3();

  const [tried, setTried] = useState(false);

  const activateAuthorizedConnector = (
    connector: AbstractConnector,
    account: string | undefined,
    isAuthorized: boolean
  ) => {
    if (!account) {
      return false;
    }

    if (toChecksumAddress(account) !== toChecksumAddress(user.activeEthAddress)) return false;
    if (isAuthorized) {
      activate(connector, undefined, true).catch(() => {
        setTried(true);
      });
    } else {
      setTried(true);
    }
    return true;
  };

  useEffect(() => {
    const connectToAuthorizedConnector = async () => {
      for (const key of Object.keys(connectorsWithAuth)) {
        const { connector, authorizationMethods } = connectorsWithAuth[key];
        const [isAuthorized, account] = await Promise.all([
          authorizationMethods.isAuthorized(),
          authorizationMethods.getAuthorizedAccount(),
        ]);

        activateAuthorizedConnector(connector, account, isAuthorized);
      }
    };

    if (user) {
      connectToAuthorizedConnector();
    }
  }, [user?.activeEthAddress]); // intentionally only running on mount or user address change

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
