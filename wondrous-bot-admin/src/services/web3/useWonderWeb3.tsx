import { BigNumber, ethers } from 'ethers';

import { useContext, useEffect, useMemo, useState } from 'react';

import { SUPPORTED_CHAINS } from 'utils/web3Constants';

import { ERC20abi } from 'services/contracts/erc20.abi';
import { formatEther } from 'ethers/lib/utils';
import { WonderWeb3, WonderWeb3AssetMap, TransactionData } from 'services/web3/types';
// import connectors, { ConnectorName } from './connectors';
import useStoredConnector from './useStoredConnector';
import useWeb3 from './useWeb3';
import { WonderWeb3Context } from 'utils/context/WonderWeb3Context';
import { useDisconnect, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';

/**
 * High level hook for Web3. Uses our react-web3 hook wrapper and adds some additional business functionality.
 */


export default function useWonderWeb3(): WonderWeb3 {
  const {
    connector,
    library,
    // chainId,
    account,
    activate,
    deactivate,
    active,
    error,
    provider,
    isActivating,
    isSubscribed,
  } = useWeb3();

  const { chainId, isConnected, ...rest } = useWeb3ModalAccount()

  const {walletProvider} = useWeb3ModalProvider();

  const {disconnect} = useDisconnect()
  const [assets, setAssets] = useState<WonderWeb3AssetMap>(null);
  const [ensName, setENSName] = useState(null);
  const [fetching, setFetching] = useState(false);
  const { connecting, setConnecting } = useContext(WonderWeb3Context);
  const [lastChainId, setLastChainId] = useState(chainId);


  const chainName = useMemo(() => SUPPORTED_CHAINS[chainId] || 'none', [chainId]); // i have no idea why this needs to be 'none' but it somehow doesnt work if it's null

  const address = useMemo(() => account, [account]);

  const addressTag = useMemo(() => {
    if (!address) {
      return '';
    }
    if (ensName) {
      return ensName;
    }
    return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
  }, [address, ensName]);

  const toChecksumAddress = (address: string) => ethers.utils.getAddress(address);

  const isValidAddress = (address: string) => ethers.utils.isAddress(address);

  const wallet = useMemo(
    () => ({
      account,
      address,
      chain: chainId,
      addressTag,
      assets,
    }),
    [account, address, addressTag, assets, chainId]
  );


  const onConnect = () => {
    
    if (!connector) return;
    try {
      activate(connector);
      // Gate Keeper for Usupported chains
      if (!SUPPORTED_CHAINS[chainId]) {
        disconnectWallet();
        return false;
      }
    } catch (e) {
      console.log('Error', e);
    }
    setConnecting(false);
  };

  const signMessage = async (message: string) => {
    if (!walletProvider || !isConnected) return;
    if (connecting) {
      setConnecting(false);
      return;
    }

    setConnecting(true);
    try {
      const prov = new ethers.providers.Web3Provider(walletProvider);
      if (!SUPPORTED_CHAINS[chainId]) {
        disconnectWallet();
        return false;
      }
      const signer = await prov.getSigner();

      // Now sign message
      const signedMessage = await signer.signMessage(message);
      setConnecting(false);
      return signedMessage;
    } catch (error) {
      
      console.log('Error signing message ', error);
      // Error Signed message
      setConnecting(false);
      if (error.code && error.code == 4001) {
        return false;
      }
    }
    return null;
  };



  // If the wallet has an ENS Name, represent it
  // instead of the address.
  const getENSName = async () => {
    // If chain supports ENS...
    try {
      const prov = new ethers.providers.Web3Provider(provider);
      const name = await prov.lookupAddress(address);
      setENSName(name);
    } catch (err) {
      // Chain not supported. No problem
      setENSName(null);
    }

    return true;
  };

  const getENSNameFromEthAddress = async (address: string) => {
    try {
      if (!provider) {
        console.warn('No provider found');
        return;
      }
      const prov = new ethers.providers.Web3Provider(provider);
      const name = await prov.lookupAddress(address);
      return name;
    } catch (err) {
      console.log('Error getting ENS name', err);
      return null;
    }
  };

  const getAddressFromENS = async (ens: string) => {
    try {
      const prov = new ethers.providers.Web3Provider(provider);
      const address = await prov.resolveName(ens);
      return address;
    } catch (err) {
      return null;
    }
  };

  const getGasPrice = async () => {
    try {
      const prov = new ethers.providers.Web3Provider(provider);
      return await prov.getGasPrice();
    } catch (err) {
      return null;
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setConnecting(false);
    return true;
  };

  useEffect(() => {
    if (chainId && account && provider) {
      getENSName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, provider]);

  // useEffect(() => {
  //   if (chainId) {
  //     setLastChainId(chainId);
  //   }
  // }, [chainId]);

  const chain = chainId || lastChainId;

  // const { setStoredConnector } = useStoredConnector();

  const activateAndStore = () => {
    // const conn = connectors[connectorName];
    // activate(conn, () => {
    //   setStoredConnector(connectorName);
    // });
  };

  const sendTransaction = async (txData: TransactionData) => {
    const prov = new ethers.providers.Web3Provider(provider);
    const signer = prov.getSigner();
    const transactionObj = await signer.sendTransaction(txData);
    return transactionObj;
  };

  return {
    connecting,
    wallet,
    address,
    assets,
    ensName,
    chain,
    chainName,
    subscribed: isSubscribed,
    notSupportedChain: chain ? !SUPPORTED_CHAINS[chain] : false,
    onConnect,
    disconnect: disconnectWallet,
    signMessage,
    web3Provider: provider,
    toChecksumAddress,
    isValidAddress,
    connector,
    error,
    isActivating,
    active,
    library,
    activate,
    activateAndStore,
    getENSNameFromEthAddress,
    getAddressFromENS,
    getGasPrice,
    sendTransaction,
  };
}
