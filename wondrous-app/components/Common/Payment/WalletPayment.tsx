import React, { useCallback, useEffect, useState } from 'react';
import { ethers, utils } from 'ethers';
import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from '../../../graphql/queries/wallet';
import { useGnosisSdk } from '../../../services/payment';
import { ERC20abi } from '../../../services/contracts/erc20.abi';
import { SafeTransactionDataPartial, SafeTransactionData } from '@gnosis.pm/safe-core-sdk-types';
import { useWonderWeb3 } from '../../../services/web3';

const generateReadablePreviewForAddress = (address: String) => {
  if (address && address.length > 10) {
    return address.substring(0, 4) + '...' + address.substring(address.length - 3);
  }
};

const CHAIN_ID_TO_CHAIN_NAME = {
  1: 'eth_mainnet',
  4: 'rinkeby',
  137: 'polygon_mainnet'
}

interface SubmissionPaymentInfo {
  submissionId: string;
  paymentData: PaymentData[];
}

interface PaymentData {
  tokenAddress: string;
  isEthTransfer: Boolean;
  amount: string;
  recepientAddress: string;
  chain: string
}

export const WalletPayment = (props) => {
  const { open, handleClose, setShowPaymentModal, approvedSubmission, wallets, submissionPaymentInfo } = props;
  const [currentChainId, setCurrentChainId] = useState(null)
  const [onRightChain, setOnRighChain] = useState(true)
  const wonderWeb3 = useWonderWeb3();
  const connectWeb3 = async () => {
    await wonderWeb3.onConnect()
  }

  useEffect(() => {
    connectWeb3()
  }, []);

  useEffect(() => {
    setCurrentChainId(wonderWeb3.chain)
  }, [wonderWeb3.chain]);

  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const wonderGnosis = useGnosisSdk();
  const connectSafeSdk = async (chain, safeAddress) => {
    await wonderGnosis.connectSafeSdk({ chain, safeAddress });
  };
  useEffect(()=> {
    const chain = submissionPaymentInfo?.paymentData[0].chain
    if (chain && currentChainId) {
      setOnRighChain(chain ===CHAIN_ID_TO_CHAIN_NAME[currentChainId])
    }
  }, [currentChainId, submissionPaymentInfo])

  useEffect(() => {
    const wallet = wallets.filter((wallet) => wallet.id === selectedWalletId)[0];
    setSelectedWallet(wallet);
    if (selectedWallet && selectedWallet.chain) {
      connectSafeSdk(selectedWallet.chain, selectedWallet.address);
    }
  }, [selectedWalletId, selectedWallet?.chain, selectedWallet?.address]);

  const constructAndSignTransactoinData = async () => {
    let iface = new ethers.utils.Interface(ERC20abi);
    const paymentData = submissionPaymentInfo?.paymentData[0];
    let transactionData;
    if (paymentData?.isEthTransfer) {
      transactionData = {
        to: paymentData.recepientAddress,
        data: '0x00',
        value: paymentData.amount,
      };
    } else {
      const callData = iface.encodeFunctionData('transfer', [paymentData.recepientAddress, paymentData.amount]);
      transactionData = {
        to: paymentData.tokenAddress,
        data: callData,
        value: '0',
      };
    }
    const gnosisClient = wonderGnosis?.safeServiceClient;
    const gnosisSdk = wonderGnosis?.safeSdk;
    const nextNonce = await gnosisClient?.getNextNonce(selectedWallet?.address);
    const transaction: SafeTransactionDataPartial = {
      to: wonderWeb3.toChecksumAddress(transactionData.to),
      data: transactionData.data,
      value: transactionData.value,
      nonce: nextNonce,
    };
    const safeTransaction = await gnosisSdk.createTransaction(transaction);
    const safeTxHash = await gnosisSdk.getTransactionHash(safeTransaction);
    const owner1Signature = await gnosisSdk.signTransaction(safeTransaction);
  };
  const walletOptions = [];
  wallets.map((wallet) => {
    if (wallet.chain === submissionPaymentInfo.paymentData[0].chain) {
      const address = generateReadablePreviewForAddress(wallet.address);
      const label = `${wallet.name}:  ${address}`;
      walletOptions.push({ value: wallet.id, label });
    }
  });

  const handlePaymentClick = () => {
    if (!selectedWallet) {
      console.log('wallet not yet selected');
    }
    if (!wonderGnosis.isConnected()) {
      console.log('gnosis wallet not yet connected');
    }
    console.log('payy');
    constructAndSignTransactoinData()
  };
  if (walletOptions && walletOptions.length > 0) {
    return (
      <>
        <DropdownSelect
          title="Wallet"
          value={selectedWalletId}
          setValue={setSelectedWalletId}
          labelText="Choose wallet"
          options={walletOptions}
          onChange={(e) => {}}
        />
        {!onRightChain && <>on the wrong chain should be on {selectedWallet?.chain}</>}
        <button onClick={handlePaymentClick}>pay</button>
      </>
    );
  } else {
    return (
      <>
        <>No wallet found</>
        <button>create new wallets</button>
      </>
    );
  }
};
