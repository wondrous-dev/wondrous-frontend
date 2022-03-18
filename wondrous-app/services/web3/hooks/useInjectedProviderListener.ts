import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';

/**
 * Hook to listen for events (e.g. chain changes, account changes) in the Web3 provider.
 */
export default function useInjectedProviderListener({
  suppress = false,
  connector,
}: {
  suppress?: boolean;
  connector: AbstractConnector;
}) {
  const { error, activate, active } = useWeb3React();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(connector);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(connector);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(connector);
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(connector);
      };

      ethereum.addListener('connect', handleConnect);
      ethereum.addListener('chainChanged', handleChainChanged);
      ethereum.addListener('accountsChanged', handleAccountsChanged);
      ethereum.addListener('networkChanged', handleNetworkChanged);
      setIsSubscribed(true);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
        setIsSubscribed(false);
      };
    }
  }, [error, suppress, activate, connector, active]);

  return isSubscribed;
}
