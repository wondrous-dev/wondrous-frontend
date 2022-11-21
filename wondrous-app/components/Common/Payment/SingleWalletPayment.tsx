import { useMutation } from '@apollo/client';
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import {
  LINK_METAMASK_PAYMENT,
  LINK_METAMASK_PAYMENT_FOR_APPLICATION,
  PROPOSE_GNOSIS_TX_FOR_APPLICATION,
  PROPOSE_GNOSIS_TX_FOR_SUBMISSION,
} from 'graphql/mutations/payment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { TransactionData } from 'services/web3/hooks/types';

import { CircularProgress } from '@mui/material';

import {
  GET_PAYMENTS_FOR_ORG,
  GET_PAYMENTS_FOR_POD,
  GET_UNPAID_SUBMISSIONS_FOR_ORG,
  GET_UNPAID_SUBMISSIONS_FOR_POD,
} from 'graphql/queries/payment';
import { ERC20abi } from 'services/contracts/erc20.abi';
import useGnosisSdk from 'services/payment';
import { useWonderWeb3 } from 'services/web3';
import { usePaymentModal } from 'utils/hooks';
import {
  CHAIN_TO_EXPLORER_URL,
  CHAIN_TO_GNOSIS_URL_ABBR,
  DEFAULT_ERC20_GAS_LIMIT,
  SUPPORTED_CHAINS,
} from 'utils/web3Constants';

import DropdownSelect from 'components/Common/DropdownSelect';
import { WALLET_TYPE } from 'components/Settings/WalletSetup/WalletSetupModal/constants';
import { GET_GRANT_APPLICATION_BY_ID } from 'graphql/queries';
import { ENTITIES_TYPES } from 'utils/constants';
import { ErrorText } from 'components/Common';
import { CreateFormPreviewButton } from '../../CreateEntity/styles';
import { PaymentPendingTypography } from './styles';

const generateReadablePreviewForAddress = (address: String) => {
  if (address && address.length > 10) {
    return `${address.substring(0, 4)}...${address.substring(address.length - 3)}`;
  }
};

export const constructGnosisRedirectUrl = (chain, safeAddress, safeTxHash) => {
  if (chain === 'harmony') {
    return `https://multisig.harmony.one/#/safes/${safeAddress}/transactions/`;
  }
  if (chain === 'boba') {
    return `https://multisig.boba.network/boba:${safeAddress}/transactions/${safeTxHash}`;
  }
  return `https://gnosis-safe.io/app/${CHAIN_TO_GNOSIS_URL_ABBR[chain]}:${safeAddress}/transactions/${safeTxHash}`;
};

export const constructExplorerRedirectUrl = (chain, txHash) => `${CHAIN_TO_EXPLORER_URL[chain]}/tx/${txHash}`;

interface SubmissionPaymentInfo {
  submissionId: string;
  paymentData: PaymentData[];
}

interface PaymentData {
  tokenAddress: string;
  isEthTransfer: Boolean;
  amount: string;
  recepientAddress: string;
  chain: string;
  decimal: number;
}

export function SingleWalletPayment(props) {
  const {
    open,
    handleClose,
    orgId,
    podId,
    approvedSubmission,
    wallets,
    submissionPaymentInfo,
    changedRewardAmount,
    parentError,
    entityType = null,
  } = props;

  const [currentChainId, setCurrentChainId] = useState(null); // chain id current user is on
  const [walletOptions, setWalletOptions] = useState([]); // chain associated with submission
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [wrongChainError, setWrongChainError] = useState(null);
  const [notOwnerError, setNotOwnerError] = useState(null);
  const [signingError, setSigningError] = useState(null);
  const [safeConnectionError, setSafeConnectionError] = useState(null);
  const [gnosisTransactionLoading, setGnosisTransactionLoading] = useState(false);
  const [incompatibleWalletError, setIncompatibleWalletError] = useState(null);
  const [paymentPending, setPaymentPending] = useState(null);
  const [gnosisSafeTxRedirectLink, setGnosisSafeTxRedirectLink] = useState(null);
  const [exploreRedirectUrl, setExploreRedirectUrl] = useState(null);
  const [safeTxHash, setSafeTxHash] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const router = useRouter();
  const wonderWeb3 = useWonderWeb3();
  const paymentModal = usePaymentModal();
  const connectWeb3 = async () => {
    await wonderWeb3.onConnect();
  };
  useEffect(() => {
    connectWeb3();
  }, []);

  const wonderGnosis = useGnosisSdk();
  const connectSafeSdk = async (chain, safeAddress) => {
    try {
      await wonderGnosis.connectSafeSdk({ chain, safeAddress });
    } catch (e) {
      console.log('error connecting to gnosis safe', selectedWallet.chain, e);
      setSafeConnectionError(`Cannot connect to safe, check if connected to  ${selectedWallet.chain}`);
    }
  };

  useEffect(() => {
    setNotOwnerError(null);
    setSafeConnectionError(null);
    setCurrentChainId(wonderWeb3.chain);
  }, [wonderWeb3.chain, wonderWeb3.address]);

  useEffect(() => {
    setWrongChainError(null);
    const chain = submissionPaymentInfo?.paymentData[0].chain;
    if (chain && currentChainId) {
      if (chain !== SUPPORTED_CHAINS[currentChainId]) {
        setWrongChainError(`currently connected to the wrong network should be on ${chain}`);
      }
    }
  }, [currentChainId, submissionPaymentInfo]);

  useEffect(() => {
    setIncompatibleWalletError(null);
    const corrctChainWallets = [];
    const chain = submissionPaymentInfo?.paymentData[0].chain;
    wallets.map((wallet) => {
      if (wallet.chain === chain || wallet.type === WALLET_TYPE.METAMASK) {
        const address = generateReadablePreviewForAddress(wallet.address);
        const label = `${wallet.name}:  ${address}`;
        corrctChainWallets.push({ value: wallet.id, label });
      }
    });
    if (corrctChainWallets.length === 0 && wallets.length > 0) {
      setIncompatibleWalletError(`Existing wallets are not on ${chain}`);
    }

    setWalletOptions(corrctChainWallets);
  }, [submissionPaymentInfo, wallets]);

  useEffect(() => {
    setNotOwnerError(null);
    const wallet = wallets.filter((wallet) => wallet.id === selectedWalletId)[0];
    setSelectedWallet(wallet);
    if (selectedWallet && selectedWallet.chain) {
      connectSafeSdk(selectedWallet.chain, selectedWallet.address);
    }
  }, [selectedWalletId, selectedWallet?.chain, selectedWallet?.address, currentChainId]);

  const [proposeGnosisTxForSubmission] = useMutation(PROPOSE_GNOSIS_TX_FOR_SUBMISSION, {
    onCompleted: (data) => {
      setPaymentPending(true);
      if (paymentModal?.onPaymentComplete) {
        paymentModal?.onPaymentComplete();
      }
    },
    onError: (e) => {
      console.error(e);
    },
    refetchQueries: [
      GET_UNPAID_SUBMISSIONS_FOR_POD,
      GET_UNPAID_SUBMISSIONS_FOR_ORG,
      GET_PAYMENTS_FOR_POD,
      GET_PAYMENTS_FOR_ORG,
    ],
  });

  const [proposeGnosisTxForGrantApplication] = useMutation(PROPOSE_GNOSIS_TX_FOR_APPLICATION, {
    onCompleted: (data) => {
      setPaymentPending(true);
      if (paymentModal?.onPaymentComplete) {
        paymentModal?.onPaymentComplete();
      }
    },
    onError: (e) => {
      console.error(e);
    },
    refetchQueries: [GET_GRANT_APPLICATION_BY_ID],
  });

  const [linkMetamaskPaymentForGrantApplication] = useMutation(LINK_METAMASK_PAYMENT_FOR_APPLICATION, {
    onCompleted: (data) => {
      setPaymentPending(true);
      if (paymentModal?.onPaymentComplete) {
        paymentModal?.onPaymentComplete();
      }
    },
    onError: (e) => {
      console.error(e);
    },
    refetchQueries: [GET_GRANT_APPLICATION_BY_ID],
  });

  const [linkMetamaskPayment] = useMutation(LINK_METAMASK_PAYMENT, {
    onCompleted: (data) => {
      if (paymentModal?.onPaymentComplete) {
        paymentModal?.onPaymentComplete();
      }
    },
    onError: (e) => {
      console.error(e);
    },
    refetchQueries: [
      GET_UNPAID_SUBMISSIONS_FOR_POD,
      GET_UNPAID_SUBMISSIONS_FOR_ORG,
      GET_PAYMENTS_FOR_POD,
      GET_PAYMENTS_FOR_ORG,
    ],
  });

  useEffect(() => {
    const url = constructGnosisRedirectUrl(selectedWallet?.chain, selectedWallet?.address, safeTxHash);
    setGnosisSafeTxRedirectLink(url);
  }, [safeTxHash, selectedWallet]);

  useEffect(() => {
    if (transactionHash) {
      const url = constructExplorerRedirectUrl(SUPPORTED_CHAINS[currentChainId], transactionHash);
      console.log(url);
      setExploreRedirectUrl(url);
    }
  }, [transactionHash, currentChainId]);

  const reward = props?.fetchedTask?.rewards && props?.fetchedTask?.rewards[0];

  const constructAndSignTransactionData = async () => {
    setSigningError(null);
    setGnosisTransactionLoading(true);
    let t1 = performance.now();
    const iface = new ethers.utils.Interface(ERC20abi);
    const paymentData = submissionPaymentInfo?.paymentData[0];
    let transactionData;
    let finalAmount = paymentData.amount;
    if (changedRewardAmount) {
      const decimal = Number(paymentData?.decimal);
      const bigChangedAmount = new BigNumber(changedRewardAmount);
      const newDecimal = new BigNumber(10 ** decimal);
      finalAmount = bigChangedAmount.times(newDecimal);
      finalAmount = finalAmount.toString();
    }

    if (paymentData?.isEthTransfer) {
      transactionData = {
        to: paymentData.recepientAddress,
        data: '0x00',
        value: finalAmount,
      };
    } else {
      const callData = iface.encodeFunctionData('transfer', [paymentData.recepientAddress, finalAmount]);
      transactionData = {
        to: paymentData.tokenAddress,
        data: callData,
        value: '0',
      };
    }
    let t2 = performance.now();
    console.log(`getting calldata took ${t2 - t1} milliseconds`);
    t1 = performance.now();
    const gnosisClient = wonderGnosis?.safeServiceClient;
    console.log('safeServiceClient, ', gnosisClient);
    const gnosisSdk = wonderGnosis?.safeSdk;
    console.log('gnosisSdk, ', gnosisSdk);
    if (!gnosisSdk) {
      setSafeConnectionError('Error connecting to gnosis safe please try again');
      setGnosisTransactionLoading(false);
      return;
    }

    const nextNonce = await gnosisClient?.getNextNonce(selectedWallet?.address);
    t2 = performance.now();
    console.log(`getting next nonce took ${t2 - t1} milliseconds`);
    t1 = performance.now();
    const estimateGasPayload = {
      to: wonderWeb3.toChecksumAddress(transactionData.to),
      value: transactionData.value,
      data: transactionData.data,
      operation: 0,
    };
    let safeTxGas;
    // try {
    //   const estimateTx: SafeMultisigTransactionEstimateResponse = await gnosisClient.estimateSafeTransaction(
    //     selectedWallet?.address,
    //     estimateGasPayload
    //   );
    //   safeTxGas = estimateTx?.safeTxGas;
    // } catch (e) {
    //   console.log(e);
    // }
    // t2 = performance.now();
    // console.log(`estimate gas took ${t2 - t1} milliseconds`);
    // t1 = performance.now();

    const transaction: SafeTransactionDataPartial = {
      to: wonderWeb3.toChecksumAddress(transactionData.to),
      data: transactionData.data,
      value: transactionData.value,
      nonce: nextNonce,
      safeTxGas: safeTxGas ? Number(safeTxGas) : 0,
    };
    const safeTransaction = await gnosisSdk.createTransaction(transaction);
    const computedSafeTxHash = await gnosisSdk.getTransactionHash(safeTransaction);
    t2 = performance.now();
    console.log(`createTransaction and getTransactionHash took ${t2 - t1} milliseconds`);
    t1 = performance.now();
    setSafeTxHash(computedSafeTxHash);
    try {
      await gnosisSdk.signTransaction(safeTransaction);
    } catch (e) {
      setGnosisTransactionLoading(false);
      if (e.message === 'Transactions can only be signed by Safe owners') {
        setNotOwnerError(`Not a owner of multisig`);
      } else if (e.message.includes('User denied message')) {
        setSigningError(`User denied signature`);
      } else {
        setSigningError(`Error signing transaction`);
      }
      return;
    }
    t2 = performance.now();
    console.log(`signTransaction took ${t2 - t1} milliseconds`);
    t1 = performance.now();
    let sender; // parse out sender from signature, should be checksum addr. although backend can probably just convert
    let signature; // parse out signature
    safeTransaction.signatures.forEach((value, key) => {
      sender = value.signer;
      signature = value.data;
    });

    const txData = {
      ...safeTransaction.data,
      contractTransactionHash: computedSafeTxHash,
      sender,
      signature,
    };
    if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
      proposeGnosisTxForGrantApplication({
        variables: {
          input: {
            grantApplicationId: approvedSubmission.id,
            walletId: selectedWalletId,
            chain: submissionPaymentInfo?.paymentData[0].chain,
            transactionData: txData,
          },
        },
      });
    } else {
      proposeGnosisTxForSubmission({
        variables: {
          input: {
            submissionId: approvedSubmission.id,
            walletId: selectedWalletId,
            chain: submissionPaymentInfo?.paymentData[0].chain,
            transactionData: txData,
          },
        },
        refetchQueries: [
          GET_UNPAID_SUBMISSIONS_FOR_POD,
          GET_UNPAID_SUBMISSIONS_FOR_ORG,
          GET_PAYMENTS_FOR_POD,
          GET_PAYMENTS_FOR_ORG,
        ],
      });
    }
    t2 = performance.now();
    console.log(`proposeGnosisTxForSubmission took ${t2 - t1} milliseconds`);
    setGnosisTransactionLoading(false);
  };

  const sendTransactionFromMetamask = async () => {
    const iface = new ethers.utils.Interface(ERC20abi);
    const paymentData = submissionPaymentInfo?.paymentData[0];
    const chain = paymentData?.chain;
    if (chain !== SUPPORTED_CHAINS[currentChainId]) {
      setWrongChainError(`Please switch to ${chain} chain`);
      return;
    }
    if (selectedWallet?.address?.toLowerCase() !== wonderWeb3.address?.toLowerCase()) {
      setNotOwnerError(`Must be connected to the selected wallet ${selectedWallet?.address}`);
      return;
    }
    let transactionData: TransactionData;
    let finalAmount = paymentData.amount;
    if (changedRewardAmount) {
      const decimal = Number(paymentData?.decimal);
      const bigChangedAmount = new BigNumber(changedRewardAmount);
      const newDecimal = new BigNumber(10 ** decimal);
      finalAmount = bigChangedAmount.times(newDecimal);
      finalAmount = finalAmount.toString();
    }
    const gasPrice = await wonderWeb3.getGasPrice();

    if (paymentData?.isEthTransfer) {
      transactionData = {
        from: selectedWallet?.address,
        to: paymentData.recepientAddress,
        data: '0x00',
        value: finalAmount,
        gasLimit: DEFAULT_ERC20_GAS_LIMIT,
        gasPrice: gasPrice.toHexString(),
      };
    } else {
      const callData = iface.encodeFunctionData('transfer', [paymentData.recepientAddress, finalAmount]);
      transactionData = {
        from: selectedWallet?.address,
        to: paymentData.tokenAddress,
        data: callData,
        value: '0',
        gasLimit: DEFAULT_ERC20_GAS_LIMIT,
        gasPrice: gasPrice.toHexString(),
      };
    }
    const transactionObj = await wonderWeb3.sendTransaction(transactionData);
    const txHash = transactionObj?.hash;
    setTransactionHash(txHash);
    if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
      return linkMetamaskPaymentForGrantApplication({
        variables: {
          input: {
            grantApplicationId: approvedSubmission.id,
            walletId: selectedWalletId,
            chain,
            txHash,
          },
        },
      });
    }
    linkMetamaskPayment({
      variables: {
        input: {
          submissionId: approvedSubmission.id,
          walletId: selectedWalletId,
          chain,
          txHash,
        },
      },
    });
  };

  const handleCreateNewWalletClick = () => {
    if (podId) {
      const newUrl = `/pod/settings/${podId}/wallet`;
      window.location.href = newUrl;
    } else if (orgId) {
      const newUrl = `/organization/settings/${orgId}/wallet`;
      window.location.href = newUrl;
    }
  };

  const handlePaymentClick = () => {
    if (!selectedWallet) {
      console.log('wallet not yet selected');
    }
    if (selectedWallet.type !== WALLET_TYPE.METAMASK) {
      if (!wonderGnosis.isConnected()) {
        console.log('gnosis wallet not yet connected');
      }
      // we use !== metamask because we didn't backfill wallet data, and only other type right now is gnosis
      constructAndSignTransactionData();
    } else if (selectedWallet.type === WALLET_TYPE.METAMASK) {
      sendTransactionFromMetamask();
    }
  };
  if (walletOptions && walletOptions.length > 0) {
    return (
      <>
        <DropdownSelect
          title="Your wallet"
          value={selectedWalletId}
          setValue={setSelectedWalletId}
          labelText="Choose wallet"
          options={walletOptions}
          onChange={(e) => {}}
          formSelectStyle={{
            marginTop: '20px',
            marginBottom: '28px',
          }}
        />
        {selectedWallet && !paymentPending && (
          <>
            {gnosisTransactionLoading ? (
              <CircularProgress />
            ) : (
              <>
                {!exploreRedirectUrl && !paymentPending && (
                  <CreateFormPreviewButton
                    onClick={handlePaymentClick}
                    style={{
                      marginLeft: 0,
                    }}
                  >
                    Pay {changedRewardAmount || reward?.rewardAmount} {reward?.symbol}
                  </CreateFormPreviewButton>
                )}
              </>
            )}
          </>
        )}
        {parentError ? (
          <ErrorText>{parentError}</ErrorText>
        ) : (
          <>
            {wrongChainError && <ErrorText>{wrongChainError}</ErrorText>}
            {signingError && <ErrorText>{signingError}</ErrorText>}
            {notOwnerError && <ErrorText>{notOwnerError}</ErrorText>}
            {safeConnectionError && <ErrorText>{safeConnectionError}</ErrorText>}
          </>
        )}
        {paymentPending && (
          <PaymentPendingTypography>
            Payment pending! Please go to{' '}
            <a
              style={{
                color: '#00BAFF',
              }}
              href={gnosisSafeTxRedirectLink}
              target="_blank"
              rel="noreferrer"
            >
              your Gnosis safe
            </a>{' '}
            to approve the payment.
          </PaymentPendingTypography>
        )}
        {exploreRedirectUrl && (
          <PaymentPendingTypography>
            transaction processing! Go to{' '}
            <a
              style={{
                color: '#00BAFF',
              }}
              href={exploreRedirectUrl}
              target="_blank"
              rel="noreferrer"
            >
              block explorer
            </a>{' '}
            to check the transaction.
          </PaymentPendingTypography>
        )}
      </>
    );
  }
  return (
    <div
      style={{
        marginTop: '16px',
      }}
    >
      {parentError ? (
        <ErrorText
          style={{
            marginBottom: '16px',
          }}
        >
          {parentError}
        </ErrorText>
      ) : (
        <>
          {incompatibleWalletError && (
            <ErrorText
              style={{
                marginBottom: '16px',
              }}
            >
              {incompatibleWalletError}
            </ErrorText>
          )}
        </>
      )}

      <CreateFormPreviewButton
        style={{
          marginLeft: 0,
        }}
        onClick={handleCreateNewWalletClick}
      >
        Create new wallets
      </CreateFormPreviewButton>
    </div>
  );
}
