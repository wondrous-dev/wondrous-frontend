import { BigNumber, ethers } from 'ethers';

import { useContext, useEffect, useMemo, useState } from 'react';

import { NATIVE_TOKEN_SYMBOL, SUPPORTED_CURRENCIES, SUPPORTED_CHAINS } from 'utils/web3Constants';

import { ERC20abi } from 'services/contracts/erc20.abi';
import { formatEther } from 'ethers/lib/utils';
import { WonderWeb3, WonderWeb3AssetMap, TransactionData } from 'services/web3/hooks/types';
import connectors, { ConnectorName } from '../connectors';
import useStoredConnector from './useStoredConnector';
import useWeb3 from './useWeb3';
import { WonderWeb3Context } from '../context/WonderWeb3Context';

/**
 * High level hook for Web3. Uses our react-web3 hook wrapper and adds some additional business functionality.
 */
export default function useWonderWeb3(): WonderWeb3 {
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
    provider,
    isActivating,
    isSubscribed,
  } = useWeb3();

  const [assets, setAssets] = useState<WonderWeb3AssetMap>(null);
  const [ensName, setENSName] = useState(null);
  const [fetching, setFetching] = useState(false);
  const { connecting, setConnecting } = useContext(WonderWeb3Context);
  const [lastChainId, setLastChainId] = useState(chainId);

  const isInProduction = process.env.NEXT_PUBLIC_PRODUCTION;

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

  const nativeTokenSymbol = useMemo(() => NATIVE_TOKEN_SYMBOL[chainId], [chainId]);

  const onConnect = () => {
    console.log('onConnect' , connector);
    if (!connector) return;
    try {
      activate(connector);
      // Gate Keeper for Usupported chains
      if (!SUPPORTED_CHAINS[chainId]) {
        disconnect();
        return false;
      }
    } catch (e) {
      console.log('Error', e);
    }
    setConnecting(false);
  };

  const signMessage = async (message: string) => {
    if (!provider || !active) return;
    if (connecting) {
      setConnecting(false);
      return;
    }

    setConnecting(true);
    try {
      const prov = new ethers.providers.Web3Provider(provider);
      const { chainId } = await prov.getNetwork();
      if (!SUPPORTED_CHAINS[chainId]) {
        disconnect();
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

  const getChainCurrencies = () => (chainId ? SUPPORTED_CURRENCIES.filter((c) => c.chains.includes(chainId)) : []);

  const getNativeChainBalance = async () => {
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const balance = await ethersProvider.getBalance(address);
    const balanceFormatted = `${parseFloat(formatEther(balance)).toPrecision(4)} `;
    return balanceFormatted;
  };

  const getTokenBalance = async (token) => {
    if (!fetching && address && chainId && token.contracts[chainId] !== '') {
      setFetching(true);
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const usdcContract = new ethers.Contract(token.contracts[chainId], ERC20abi, ethersProvider);
      const balanceRaw = await usdcContract.balanceOf(address);
      const decimals = await usdcContract.decimals();
      const bnBalance = await BigNumber.from(balanceRaw);
      const balance = bnBalance.div((10 ** decimals).toString());
      setFetching(false);
      return parseFloat(balance.toString()).toPrecision(4);
    }
    // If not enough information to retrieve, return
    // empty balance.
    return '0.000';
  };

  const getAccountAssets = async () => {
    if (!fetching && address && chainId) {
      setFetching(true);

      // Get supported currencies for this chain
      const currencies = await getChainCurrencies();

      const chainAssets = await currencies.reduce(async (acc, currency) => {
        const { contracts, symbol } = currency;
        const balance = contracts ? await getTokenBalance(currency) : await getNativeChainBalance();

        // Promise
        const previous = await acc;

        return {
          ...previous,
          [symbol]: {
            balance,
            symbol,
          },
        };
      }, {});

      // Reset Assets based on Chain
      setAssets(chainAssets);
      setFetching(false);
    }
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

  const disconnect = () => {
    deactivate();
    setConnecting(false);
    return true;
  };

  useEffect(() => {
    if (chainId && account && provider) {
      getENSName();
      getAccountAssets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, provider]);

  useEffect(() => {
    if (chainId) {
      setLastChainId(chainId);
    }
  }, [chainId]);

  const chain = chainId || lastChainId;

  const { setStoredConnector } = useStoredConnector();

  const activateAndStore = (connectorName: ConnectorName) => {
    console.log('activateAndStore', connectorName);
    const conn = connectors[connectorName];
    activate(conn, () => {
      setStoredConnector(connectorName);
    });
  };

  const sendTransaction = async (txData: TransactionData) => {
    const prov = new ethers.providers.Web3Provider(provider);
    const { chainId } = await prov.getNetwork(); // TODO add validation here that chainId equals current chain id
    const signer = await prov.getSigner();
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
    nativeTokenSymbol,
    notSupportedChain: chain ? !SUPPORTED_CHAINS[chain] : false,
    onConnect,
    disconnect,
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
