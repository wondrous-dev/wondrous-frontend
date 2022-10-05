import { BigNumber, ethers } from 'ethers';
import { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import Safe, { EthersAdapter, SafeTransactionOptionalProps } from '@gnosis.pm/safe-core-sdk';

import SafeServiceClient from '@gnosis.pm/safe-service-client';
import {
  CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL,
  HARMONY_MULTI_SEND_ADDR,
  HARMONY_PROXY_FACTORY,
  HARMONY_SAFE_MASTER_COPY,
  HARMONY_SAFE_MASTER_COPY2,
} from 'utils/constants';
import { useWonderWeb3 } from './web3';

const CHAIN_NAME_TO_DB_CHAIN_NAME = {
  // todo refactor this to have one consistent naming probably
  ETH: 'ethereum',
  MATIC: 'polygon',
  RINKEBY: 'rinkeby',
  ARBITRUM: 'arbitrum',
  BOBA: 'boba',
};

const useGnosisSdk = () => {
  const wonderWeb3 = useWonderWeb3();
  const [connected, setConnected] = useState(false);
  const [safeSdk, setSafeSdk] = useState<Safe>(null);
  const [safeServiceClient, setSafeServiceClient] = useState<SafeServiceClient>(null);

  const connectSafeSdk = async ({ safeAddress, chain }) => {
    setConnected(false);
    await wonderWeb3.onConnect();
    const currentChain = CHAIN_NAME_TO_DB_CHAIN_NAME[wonderWeb3.chainName];
    if (currentChain && currentChain !== chain) {
      throw new Error('Not on the right chain');
    }
    const ethProvider = new ethers.providers.Web3Provider(wonderWeb3.web3Provider);
    const safeOwner = ethProvider.getSigner(0);
    const ethAdapterOwner1 = new EthersAdapter({
      ethers,
      signer: safeOwner,
    });

    const contractNetworks = {
      1666600000: {
        multiSendAddress: HARMONY_MULTI_SEND_ADDR,
        safeMasterCopyAddress: HARMONY_SAFE_MASTER_COPY,
        safeProxyFactoryAddress: HARMONY_PROXY_FACTORY,
      },
    };

    const safe: Safe = await Safe.create({ ethAdapter: ethAdapterOwner1, safeAddress, contractNetworks });
    setSafeSdk(safe);
    if (!(chain in CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL)) {
      throw new Error('Invalid chain value');
    }
    try {
      const safeServiceUrl = CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL[chain];
      const client = new SafeServiceClient(safeServiceUrl);
      setSafeServiceClient(client);
    } catch (e) {
      console.log(e);
    }
    setConnected(true);
  };

  const isConnected = () => connected;

  return {
    connectSafeSdk,
    safeServiceClient,
    safeSdk,
    isConnected,
  };
};

export default useGnosisSdk;
