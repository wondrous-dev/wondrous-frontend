import React, { useCallback, useEffect, useState } from 'react';
import { ethers, utils } from 'ethers';
import DropdownSelect from '../DropdownSelect/dropdownSelect';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from '../../../graphql/queries/wallet';
import { PROPOSE_GNOSIS_TX_FOR_SUBMISSION } from '../../../graphql/mutations/payment';
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


export const SingleWalletPayment = (props) => {
  const { open, handleClose, setShowPaymentModal, approvedSubmission, wallets, submissionPaymentInfo } = props;
  const [currentChainId, setCurrentChainId] = useState(null) // chain id current user is on
  const [walletOptions, setWalletOptions] = useState([]) // chain associated with submission
  const [onRightChain, setOnRighChain] = useState(true)
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [wrongChainError, setWrongChainError] = useState(null);
  const [notOwnerError, setNotOwnerError] = useState(null);
  const [signingError, setSigningError] = useState(null);
  const [incompatibleWalletError, setIncompatibleWalletError] = useState(null);
  const wonderWeb3 = useWonderWeb3();
  const connectWeb3 = async () => {
    await wonderWeb3.onConnect()
  }
  useEffect(() => {
    connectWeb3()
  }, []);

  useEffect(() => {
    setNotOwnerError(null)
    setCurrentChainId(wonderWeb3.chain)
  }, [wonderWeb3.chain, wonderWeb3.address]);

  const wonderGnosis = useGnosisSdk();
  const connectSafeSdk = async (chain, safeAddress) => {
    await wonderGnosis.connectSafeSdk({ chain, safeAddress });
  };

  const [proposeGnosisTxForSubmission] = useMutation(PROPOSE_GNOSIS_TX_FOR_SUBMISSION, {
    onCompleted: (data) => {
      console.log('completed', data)
    },
    onError: (e) => {
      console.error(e);
    },
  });

  useEffect(()=> {
    setWrongChainError(null)
    const chain = submissionPaymentInfo?.paymentData[0].chain
    if (chain && currentChainId) {
      if (chain !==CHAIN_ID_TO_CHAIN_NAME[currentChainId]) {
        setWrongChainError(`on the wrong chain should be on ${chain}`)
      }
    }
  }, [currentChainId, submissionPaymentInfo])

  useEffect(()=> {
    setIncompatibleWalletError(null)
    const corrctChainWallets = [];
    wallets.map((wallet) => {
      const chain = submissionPaymentInfo?.paymentData[0].chain
      if (wallet.chain === chain) {
        const address = generateReadablePreviewForAddress(wallet.address);
        const label = `${wallet.name}:  ${address}`;
        corrctChainWallets.push({ value: wallet.id, label });
      }
      if (corrctChainWallets.length === 0 && wallets.length > 0) {
        setIncompatibleWalletError( `Existing wallets are not on ${chain}`)
      }
    });
    setWalletOptions(corrctChainWallets)
  }, [submissionPaymentInfo, wallets])

  useEffect(() => {
    setNotOwnerError(null)
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
    try {
      await gnosisSdk.signTransaction(safeTransaction);
    } catch (e) {
      if (e.message === 'Transactions can only be signed by Safe owners') {
        setNotOwnerError(`Not a owner of multisig`)
      } else {
        setSigningError(`Error signing transaction`)
      }
      return
    }
    let sender; // parse out sender from signature, should be checksum addr. although backend can probably just convert
    let signature; // parse out signature
    safeTransaction.signatures.forEach((value, key) => {
      sender = value.signer;
      signature = value.data;
    });

    const txData = {
      ...safeTransaction.data,
      contractTransactionHash: safeTxHash,
      sender,
      signature,
    };
    proposeGnosisTxForSubmission({
      variables: {
        input: {
          submissionId: approvedSubmission.id,
          walletId: selectedWalletId, 
          chain: submissionPaymentInfo?.paymentData[0].chain,
          transactionData: txData,
        },
      },
    });

  };

  const handlePaymentClick = () => {
    if (!selectedWallet) {
      console.log('wallet not yet selected');
    }
    if (!wonderGnosis.isConnected()) {
      console.log('gnosis wallet not yet connected');
    }
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
        {wrongChainError && <>{wrongChainError}</>}
        {signingError && <>{signingError}</>}
        {notOwnerError && <>{notOwnerError}</>}
        {selectedWallet && <button onClick={handlePaymentClick}>pay</button>}
      </>
    );
  } else {
    return (
      <>
        <>No wallet found</>
        {incompatibleWalletError && <>{incompatibleWalletError}</>}
        <button>create new wallets</button>
      </>
    );
  }
};
