import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers, utils } from 'ethers';
import { CircularProgress } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { PROPOSE_GNOSIS_MULTISEND_FOR_SUBMISSIONS } from 'graphql/mutations/payment';
import useGnosisSdk from 'services/payment';
import { ERC20abi } from 'services/contracts/erc20.abi';
import {
  SafeTransactionDataPartial,
  SafeTransactionData,
  MetaTransactionData,
  SafeTransaction,
} from '@gnosis.pm/safe-core-sdk-types';
import { SafeTransactionOptionalProps } from '@gnosis.pm/safe-core-sdk';
import { SafeMultisigTransactionEstimateResponse } from '@gnosis.pm/safe-service-client';
import { useWonderWeb3 } from 'services/web3';
import { usePaymentModal } from 'utils/hooks';
import {
  GET_PAYMENTS_FOR_ORG,
  GET_PAYMENTS_FOR_POD,
  GET_UNPAID_SUBMISSIONS_FOR_ORG,
  GET_UNPAID_SUBMISSIONS_FOR_POD,
} from 'graphql/queries/payment';
import { CHAIN_TO_GNOSIS_URL_ABBR, CHAIN_ID_TO_CHAIN_NAME } from 'utils/web3Constants';
import { WALLET_TYPE } from 'components/Settings/WalletSetup/WalletSetupModal/constants';
import DropdownSelect from 'components/Common/DropdownSelect';
import { ErrorText } from '..';
import { CreateFormPreviewButton } from '../../CreateEntity/styles';
import { PaymentPendingTypography } from './styles';
import { constructGnosisRedirectUrl } from './SingleWalletPayment';

const generateReadablePreviewForAddress = (address: String) => {
  if (address && address.length > 10) {
    return `${address.substring(0, 4)}...${address.substring(address.length - 3)}`;
  }
};

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
}

function BatchWalletPayment(props) {
  const { open, handleClose, podId, orgId, unpaidSubmissions, submissionIds, wallets, submissionsPaymentInfo, chain } =
    props;
  const [currentChainId, setCurrentChainId] = useState(null); // chain id current user is on
  const [walletOptions, setWalletOptions] = useState([]); // chain associated with submission
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [wrongChainError, setWrongChainError] = useState(null);
  const [notOwnerError, setNotOwnerError] = useState(null);
  const [signingError, setSigningError] = useState(null);
  const [safeConnectionError, setSafeConnectionError] = useState(null);
  const [incompatibleWalletError, setIncompatibleWalletError] = useState(null);
  const [paymentPending, setPaymentPending] = useState(null);
  const [gnosisSafeTxRedirectLink, setGnosisSafeTxRedirectLink] = useState(null);
  const [gnosisTransactionLoading, setGnosisTransactionLoading] = useState(false);
  const [safeTxHash, setSafeTxHash] = useState(null);
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
      console.log('error connecting to gnosis safe', selectedWallet.chain);
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
    if (chain && currentChainId) {
      if (chain !== CHAIN_ID_TO_CHAIN_NAME[currentChainId]) {
        setWrongChainError(`currently connected to the wrong network should be on ${chain}`);
      }
    }
  }, [currentChainId, chain]);

  useEffect(() => {
    setIncompatibleWalletError(null);
    const corrctChainWallets = [];
    wallets.map((wallet) => {
      if (wallet.chain === chain || wallet.type === WALLET_TYPE.METAMASK) {
        const address = generateReadablePreviewForAddress(wallet.address);
        const label = `${wallet.name}:  ${address}`;
        corrctChainWallets.push({ value: wallet.id, label });
      }
      if (corrctChainWallets.length === 0 && wallets.length > 0) {
        setIncompatibleWalletError(`Existing wallets are not on ${chain}`);
      }
    });
    setWalletOptions(corrctChainWallets);
  }, [chain, wallets]);

  useEffect(() => {
    setNotOwnerError(null);
    const wallet = wallets.filter((wallet) => wallet.id === selectedWalletId)[0];
    setSelectedWallet(wallet);
    if (selectedWallet && selectedWallet.chain) {
      connectSafeSdk(selectedWallet.chain, selectedWallet.address);
    }
  }, [selectedWalletId, selectedWallet?.chain, selectedWallet?.address, currentChainId]);

  const [proposeGnosisMultisendForSubmissions] = useMutation(PROPOSE_GNOSIS_MULTISEND_FOR_SUBMISSIONS, {
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
  useEffect(() => {
    const url = constructGnosisRedirectUrl(selectedWallet?.chain, selectedWallet?.address, safeTxHash);
    setGnosisSafeTxRedirectLink(url);
  }, [safeTxHash, selectedWallet]);

  const constructAndSignTransactionData = async () => {
    setSigningError(null);
    setGnosisTransactionLoading(true);
    const iface = new ethers.utils.Interface(ERC20abi);
    const transactions: MetaTransactionData[] = [];
    submissionsPaymentInfo?.map((submissionPaymentInfo) => {
      const paymentsData = submissionPaymentInfo.paymentData;
      // assume one payment per submission for now
      const paymentData = paymentsData[0];
      let transactionData: MetaTransactionData;
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
      transactions.push(transactionData);
    });
    // includes the pending nonce, better than keeping it empty which would ignore pending txs
    const gnosisClient = wonderGnosis?.safeServiceClient;
    const gnosisSdk = wonderGnosis?.safeSdk;
    if (!gnosisSdk) {
      setSafeConnectionError('Error connecting to gnosis safe please try again');
      setGnosisTransactionLoading(false);
      return;
    }
    const nextNonce = await gnosisClient?.getNextNonce(selectedWallet?.address);
    // first create a safe tx object for gas estimate purposes, then recreate it wit the esimated gas
    let safeTransaction = await gnosisSdk.createTransaction(transactions); // create tx object
    const estimateGasPayload = {
      to: safeTransaction.data.to,
      value: safeTransaction.data.value,
      data: safeTransaction.data.data,
      operation: 1,
    };
    let safeTxGas;

    try {
      const estimateTx: SafeMultisigTransactionEstimateResponse = await gnosisClient.estimateSafeTransaction(
        selectedWallet?.address,
        estimateGasPayload
      );
      safeTxGas = estimateTx?.safeTxGas;
    } catch (e) {
      setGnosisTransactionLoading(false);
      console.log(e);
    }
    const options: SafeTransactionOptionalProps = {
      safeTxGas: safeTxGas || 0,
      // baseGas, // Optional
      // gasPrice, // Optional
      // gasToken, // Optional
      // refundReceiver, // Optional
      nonce: nextNonce,
    };
    safeTransaction = await gnosisSdk.createTransaction(transactions, options);
    const safeTxHash = await gnosisSdk.getTransactionHash(safeTransaction);
    setSafeTxHash(safeTxHash);
    try {
      await gnosisSdk.signTransaction(safeTransaction);
    } catch (e) {
      if (e.message === 'Transactions can only be signed by Safe owners') {
        setNotOwnerError(`Not a owner of multisig`);
      } else if (e.message.includes('User denied message')) {
        setSigningError(`User denied signature`);
      } else {
        setSigningError(`Error signing transaction`);
      }
      setGnosisTransactionLoading(false);
      return;
    }
    setGnosisTransactionLoading(false);
    let sender; // parse out sender from signature, should be checksum addr. although backend can probably just convert
    let signature; // parse out signature
    safeTransaction.signatures.forEach((value, key) => {
      sender = value.signer;
      signature = value.data;
    });
    // txData is the payload to send to gnosis tx service. but we send to backend to validate and send
    const txData = {
      ...safeTransaction.data,
      contractTransactionHash: safeTxHash,
      sender,
      signature,
    };
    proposeGnosisMultisendForSubmissions({
      variables: {
        input: {
          submissionIds,
          walletId: selectedWalletId,
          chain,
          transactionData: txData,
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
    if (!wonderGnosis.isConnected()) {
      console.log('gnosis wallet not yet connected');
    }
    constructAndSignTransactionData();
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
        {selectedWallet && !paymentPending && !gnosisTransactionLoading && (
          <CreateFormPreviewButton
            onClick={handlePaymentClick}
            style={{
              marginLeft: 0,
            }}
          >
            Pay All
          </CreateFormPreviewButton>
        )}
        {gnosisTransactionLoading && <CircularProgress />}
        {wrongChainError && <ErrorText>{wrongChainError}</ErrorText>}
        {signingError && <ErrorText>{signingError}</ErrorText>}
        {notOwnerError && <ErrorText>{notOwnerError}</ErrorText>}
        {safeConnectionError && <ErrorText>{safeConnectionError}</ErrorText>}
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
      </>
    );
  }
  return (
    <div
      style={{
        marginTop: '16px',
      }}
    >
      {incompatibleWalletError && (
        <ErrorText
          style={{
            marginBottom: '16px',
          }}
        >
          {incompatibleWalletError}
        </ErrorText>
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

export default BatchWalletPayment;
