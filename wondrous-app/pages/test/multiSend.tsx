import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/Common/Layout/App';
import { ethers, utils } from 'ethers';
import { EthersAdapter, SafeTransactionOptionalProps } from '@gnosis.pm/safe-core-sdk';
import { SafeTransactionDataPartial, SafeTransactionData, MetaTransactionData } from '@gnosis.pm/safe-core-sdk-types';
import Safe from '@gnosis.pm/safe-core-sdk';
import BigNumber from 'bignumber.js';
import * as ethUtil from 'ethereumjs-util';
import axios from 'axios';
import { ERC20abi } from '../../services/contracts/erc20.abi';
import { useMe, withAuth } from '../../components/Auth/withAuth';

import SafeServiceClient from '@gnosis.pm/safe-service-client';
import {
  ProposeTransactionProps,
  TransferListResponse,
  SafeModuleTransactionListResponse,
  SafeMultisigTransactionListResponse,
  SafeMultisigTransactionResponse,
  SafeInfoResponse,
} from '@gnosis.pm/safe-service-client';
import { GET_SUBMISSIONS_PAYMENT_INFO } from '../../graphql/queries';
import { PROPOSE_GNOSIS_MULTISEND_FOR_SUBMISSIONS } from '../../graphql/mutations';

const CHAIN = 'rinkeby'; // there's currently a safe set up at this address, can add people to owner of safe
const GNOSIS_SAFE_ADDR = '0x3c6645cf6e3D33Ec84c731972acDEf100939eE94'; // update to user wallet
const SUBMISSION_IDS = ['46928637151150081', '46928637194141698']; // update to local list of submissions ids

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

const Multisend = () => {
  const user = useMe();
  const [safeSdk, setSafeSdk] = useState<Safe>(null);
  const safeService = new SafeServiceClient(`https://safe-transaction.${CHAIN}.gnosis.io`);
  const configureSafeSdk = async () => {
    // connect wallet, need to make this work with rinkeby polyon and mainnet, if gnosis safe is not deployed
    // at the specified address on network, this will fail, would need to try catch
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const safeOwner = provider.getSigner(0);
    const ethAdapterOwner1 = new EthersAdapter({
      ethers,
      signer: safeOwner,
    });
    const safe: Safe = await Safe.create({ ethAdapter: ethAdapterOwner1, safeAddress: GNOSIS_SAFE_ADDR });
    setSafeSdk(safe);
  };
  const [proposeGnosisMultisend] = useMutation(PROPOSE_GNOSIS_MULTISEND_FOR_SUBMISSIONS, {
    onCompleted: (data) => {},
    onError: (e) => {
      console.error(e);
    },
  });

  const { data: submissionsPaymentData } = useQuery(GET_SUBMISSIONS_PAYMENT_INFO, {
    variables: {
      submissionIds: SUBMISSION_IDS,
    },
  });
  const submissionsPaymentInfo: SubmissionPaymentInfo[] = submissionsPaymentData?.getSubmissionsPaymentInfo;

  const constructAndSignTransaction = async () => {
    // first construct the safe transaction. better to do this on front end so people can trust the transaction generating process
    // after we open source
    let iface = new ethers.utils.Interface(ERC20abi);
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
    const nextNonce = await safeService.getNextNonce(GNOSIS_SAFE_ADDR);
    const options: SafeTransactionOptionalProps = {
      // safeTxGas, // Optional
      // baseGas, // Optional
      // gasPrice, // Optional
      // gasToken, // Optional
      // refundReceiver, // Optional
      nonce: nextNonce,
    };
    const safeTransaction = await safeSdk.createTransaction(transactions, options); // create tx object
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    await safeSdk.signTransaction(safeTransaction);
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
    proposeGnosisMultisend({
      variables: {
        input: {
          submissionIds: SUBMISSION_IDS,
          safeAddress: GNOSIS_SAFE_ADDR,
          chain: CHAIN,
          transactionData: txData,
        },
      },
    });
  };
  useEffect(() => {
    configureSafeSdk();
  }, []);
  return (
    <AppLayout banner={null}>
      <button onClick={constructAndSignTransaction}>create tx</button>
    </AppLayout>
  );
};

export default withAuth(Multisend);
