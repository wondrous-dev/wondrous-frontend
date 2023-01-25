import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_SUBMISSION_PAYMENT_INFO } from 'graphql/queries/payment';
import { useRouter } from 'next/router';
import { GET_TASK_SUBMISSION_BY_ID } from 'graphql/queries';
import { ENTITIES_TYPES } from 'utils/constants';
import { SubmissionPaymentInfo } from 'components/Common/Payment/types';
import { useGetOrgOrPodWallet } from 'components/Common/Payment/helper';
import { PaymentSelected } from 'components/Settings/Payouts/types';
import { Modal } from 'components/Modal';
import GradientHeading from 'components/GradientHeading';
import Divider from 'components/Divider';
import Grid from '@mui/material/Grid';
import { BigNumber } from 'bignumber.js';
import PaymentDetails from 'components/Common/Payment/Fields/PaymentDetails';
import PaymentMethodSelector from 'components/Common/Payment/Fields/PaymentMethodSelector';

import { PaymentDescriptionText } from '../../Common/Payment/styles';

interface Props {
  orgId?: string;
  podId?: string;
  open: boolean;
  handleClose: () => void;
  paymentSelected: PaymentSelected;
}

function TaskLedgePayModal(props: Props) {
  // used for payment ledger, different from MakePaymentModal because availabel data is different
  const { podId, orgId, open, handleClose, paymentSelected } = props;
  const footerRef = useRef();
  const footerLeftRef = useRef();

  const [rewardAmount, setRewardAmount] = useState(null);
  const [submissionPaymentError, setSubmissionPaymentError] = useState(null);
  const [changeRewardErrorText, setChangeRewardErrorText] = useState('');

  const wallets = useGetOrgOrPodWallet(podId, orgId);

  const { data: submissionData } = useQuery(GET_TASK_SUBMISSION_BY_ID, {
    variables: {
      submissionId: paymentSelected?.submissionId,
    },
    skip: !paymentSelected?.submissionId,
  });

  const isBounty = submissionData?.getTaskSubmissionById?.task?.type === ENTITIES_TYPES.BOUNTY;

  const [getSubmissionPaymentInfo, { data: submissionPaymentInfo }] = useLazyQuery(GET_SUBMISSION_PAYMENT_INFO, {
    onError: (err) => {},
    fetchPolicy: 'network-only',
  });
  const paymentInfo: SubmissionPaymentInfo = submissionPaymentInfo?.getSubmissionPaymentInfo;

  useEffect(() => {
    if (paymentSelected?.submissionId) {
      getSubmissionPaymentInfo({
        variables: {
          submissionId: paymentSelected?.submissionId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentSelected?.submissionId]);

  useEffect(() => {
    setRewardAmount(paymentSelected?.amount);
  }, [paymentSelected?.amount]);

  const rewardAmountChanged = useMemo(
    () => paymentSelected?.amount !== rewardAmount,
    [paymentSelected?.amount, rewardAmount]
  );

  const handleRewardAmountChange = (e) => {
    const bigChangedRewardAmount = new BigNumber(e.target.value);
    const initialBigRewardAmount = new BigNumber(paymentSelected?.amount);
    const rewardIsSmaller = bigChangedRewardAmount.isLessThan(initialBigRewardAmount);
    if (rewardIsSmaller) {
      setChangeRewardErrorText('New reward must be greater than minimum');
    } else if (!rewardIsSmaller && changeRewardErrorText) {
      setChangeRewardErrorText('');
    }
    setRewardAmount(e.target.value);
  };

  return (
    <Modal
      open={open}
      maxWidth={620}
      title="Payment"
      onClose={handleClose}
      footerRight={<div ref={footerRef} />}
      footerLeft={<div ref={footerLeftRef} />}
    >
      <GradientHeading fontSize={24}>Payment for </GradientHeading>
      <PaymentDescriptionText>
        {isBounty ? 'Bounty' : 'Task'}: {paymentSelected?.taskTitle}
      </PaymentDescriptionText>

      <Grid display="flex" direction="column" gap="24px">
        <PaymentDetails
          rewardAmount={rewardAmount}
          onChange={handleRewardAmountChange}
          tokenName={paymentSelected?.symbol}
          paymentData={paymentInfo?.paymentData[0]}
          entityType={ENTITIES_TYPES.SUBMISSION}
          error={changeRewardErrorText}
          disabled={!isBounty}
          payee={{
            profilePicture: paymentSelected?.payeeProfilePicture,
            username: paymentSelected?.payeeUsername,
            id: paymentSelected?.payeeId,
          }}
        />
        xw
        <Divider />
        <PaymentMethodSelector
          submissionOrApplicationId={paymentSelected?.submissionId}
          wallets={wallets}
          paymentData={paymentInfo?.paymentData[0]}
          ref={footerRef}
          onClose={handleClose}
          orgId={paymentSelected?.orgId}
          podId={paymentSelected?.podId}
          changedRewardAmount={rewardAmountChanged ? rewardAmount : null}
          parentError={submissionPaymentError}
          entityType={ENTITIES_TYPES.SUBMISSION}
          reward={{
            rewardAmount: paymentSelected?.amount,
            symbol: paymentSelected?.symbol,
          }}
        />
      </Grid>
    </Modal>
  );
}

export default TaskLedgePayModal;
