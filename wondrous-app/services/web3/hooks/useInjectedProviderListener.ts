import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { ethers, utils } from 'ethers';

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
      const provider = new ethers.providers.Web3Provider(ethereum);

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

      provider.addListener('connect', handleConnect);
      provider.addListener('chainChanged', handleChainChanged);
      provider.addListener('accountsChanged', handleAccountsChanged);
      provider.addListener('chainChanged', handleNetworkChanged);
      setIsSubscribed(true);

      return () => {
        if (ethereum.removeListener) {
          provider.removeListener('connect', handleConnect);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleNetworkChanged);
        }
        setIsSubscribed(false);
      };
    }
  }, [error, suppress, activate, connector, active]);

  return isSubscribed;
}
