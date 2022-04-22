import { BigNumber, ethers } from 'ethers';
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import useStoredConnector from './useStoredConnector';
import connectors, { ConnectorName } from '../connectors';

import { useContext, useEffect, useMemo, useState } from 'react';

import { CHAIN_IDS, SUPPORTED_CHAINS, SUPPORTED_CURRENCIES } from 'utils/constants';

import { ERC20abi } from 'services/contracts/erc20.abi';
import { formatEther } from 'ethers/lib/utils';
import useWeb3 from '../hooks/useWeb3';
import { WonderWeb3, WonderWeb3AssetMap } from './types';
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

  const chainName = useMemo(() => {
    return SUPPORTED_CHAINS[chainId] || 'none';
  }, [chainId]);

  const address = useMemo(() => {
    return account;
  }, [account]);

  const addressTag = useMemo(() => {
    if (!address) {
      return '';
    }
    if (ensName) {
      return ensName;
    } else {
      return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
    }
  }, [address, ensName]);

  const toChecksumAddress = (address: string) => {
    return ethers.utils.getAddress(address);
  };

  const wallet = useMemo(() => {
    return {
      account,
      address,
      chain: chainId,
      addressTag,
      assets,
    };
  }, [account, address, addressTag, assets, chainId]);

  const nativeTokenSymbol = useMemo(() => {
    return SUPPORTED_CHAINS[chainId];
  }, [chainId]);

  const onConnect = () => {
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

  const getChainCurrencies = () => {
    return chainId ? SUPPORTED_CURRENCIES.filter((c) => c.chains.includes(chainId)) : [];
  };

  const getNativeChainBalance = async () => {
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const balance = await ethersProvider.getBalance(address);
    const balanceFormatted = parseFloat(formatEther(balance)).toPrecision(4) + ' ';
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
      const balance = bnBalance.div(10 ** decimals);
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
    const ens = new ENS({
      provider,
      ensAddress: getEnsAddress(CHAIN_IDS.ETH),
    });
    // If chain supports ENS...
    try {
      let name = await ens.getName(address);
      setENSName(name.name);
    } catch (err) {
      // Chain not supported. No problem
      setENSName(null);
    }

    return true;
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

  const chain = chainId ? chainId : lastChainId;

  const { setStoredConnector } = useStoredConnector();

  const activateAndStore = (connectorName: ConnectorName) => {
    const conn = connectors[connectorName];
    activate(conn, () => {
      setStoredConnector(connectorName);
    });
  };

  return {
    connecting,
    wallet,
    address,
    assets,
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
    connector,
    error,
    isActivating,
    active,
    library,
    activate,
    activateAndStore,
  };
}
