import { BigNumber, ethers } from 'ethers';
import { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useWonderWeb3 } from './web3';
import { EthersAdapter, SafeTransactionOptionalProps } from '@gnosis.pm/safe-core-sdk';
import Safe from '@gnosis.pm/safe-core-sdk';

import SafeServiceClient from '@gnosis.pm/safe-service-client';

const CHAIN_VALUE_TO_GNOSIS_CHAIN_VALUE  = {
    eth_mainnet: 'mainnet',
    polygon_mainnet: 'polygon',
    rinkeby: 'rinkeby',
  };


  const CHAIN_NAME_TO_DB_CHAIN_NAME = { // todo refactor this to have one consistent naming probably
    ETH: 'eth_mainnet',
    MATIC: 'polygon_mainnet',
    RINKEBY: 'rinkeby',
  };
  
export const useGnosisSdk = () => {
  const wonderWeb3 = useWonderWeb3();
  const [connected, setConnected] = useState(false);
  const [safeSdk, setSafeSdk] = useState<Safe>(null);
  const [safeServiceClient, setSafeServiceClient] = useState<SafeServiceClient>(null);

  const connectSafeSdk = async ({safeAddress, chain}) => {
    setConnected(false)
    await wonderWeb3.onConnect();
    const currentChain = CHAIN_NAME_TO_DB_CHAIN_NAME[wonderWeb3.chainName];
    if (currentChain && currentChain !== chain) {
        throw new Error('Not on the right chain');
    }
    const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
    const safeOwner = ethProvider.getSigner(0);
    const ethAdapterOwner1 = new EthersAdapter({
      ethers,
      signer: safeOwner,
    });
    const safe: Safe = await Safe.create({ ethAdapter: ethAdapterOwner1, safeAddress: safeAddress });
    setSafeSdk(safe);
    if (!(chain in CHAIN_VALUE_TO_GNOSIS_CHAIN_VALUE)) {
      throw new Error('Invalid chain value');
    }
    const gnosisChainName = CHAIN_VALUE_TO_GNOSIS_CHAIN_VALUE[chain];
    try {
      const client = new SafeServiceClient(`https://safe-transaction.${gnosisChainName}.gnosis.io`);
      setSafeServiceClient(client);
    } catch (e) {
      console.log(e);
    }
    setConnected(true)
  };



  const isConnected = () => {
    return connected;
  };

  return {
    connectSafeSdk,
    safeServiceClient,
    safeSdk,
    isConnected
  };
};
