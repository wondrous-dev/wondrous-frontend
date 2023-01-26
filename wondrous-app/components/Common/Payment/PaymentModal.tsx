import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GRAPHQL_ERRORS, PERMISSIONS, ENTITIES_TYPES } from 'utils/constants';
import { useLazyQuery } from '@apollo/client';
import { GET_GRANT_APPLICATION_PAYMENT_INFO, GET_SUBMISSION_PAYMENT_INFO } from 'graphql/queries/payment';
import { parseUserPermissionContext } from 'utils/helpers';
import { SubmissionPaymentInfo } from 'components/Common/Payment/types';
import { Modal } from 'components/Modal';
import GradientHeading from 'components/GradientHeading';
import Divider from 'components/Divider';
import { useGlobalContext } from 'utils/hooks';
import { useGetOrgOrPodWallet } from 'components/Common/Payment/helper';
import Grid from '@mui/material/Grid';
import { BigNumber } from 'bignumber.js';
import PaymentDetails from 'components/Common/Payment/Fields/PaymentDetails';
import PaymentMethodSelector from 'components/Common/Payment/Fields/PaymentMethodSelector';

interface Props {
  open: boolean;
  handleClose?: () => void;
  setShowPaymentModal: (showPaymentModal: boolean) => void;
  handleGoBack: any;
  submissionOrApplication: any; // taskSubmission or grantApplication
  taskOrGrant: any; // task or grant
  entityType?: string;
}

function MakePaymentModal(props: Props) {
  const { open, handleClose, setShowPaymentModal, submissionOrApplication, taskOrGrant, entityType } = props;

  const footerRef = useRef();
  const footerLeftRef = useRef();

  const [rewardAmount, setRewardAmount] = useState(null);
  const [submissionPaymentError, setSubmissionPaymentError] = useState(null);
  const [changeRewardErrorText, setChangeRewardErrorText] = useState('');
  const { userPermissionsContext } = useGlobalContext();

  const wallets = useGetOrgOrPodWallet(submissionOrApplication?.podId, submissionOrApplication?.orgId);

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: submissionOrApplication?.orgId,
    podId: submissionOrApplication?.podId,
  });

  const [getSubmissionPaymentInfo, { data: submissionPaymentInfo }] = useLazyQuery(GET_SUBMISSION_PAYMENT_INFO, {
    onError: (err) => {
      if (err?.graphQLErrors[0]?.extensions?.message === GRAPHQL_ERRORS.NO_RECIPIENT_WEB_3_ADDRESS) {
        setSubmissionPaymentError(
          'Recipient has no active wallet. Please inform them to connect their wallet to their account'
        );
      }
    },
    fetchPolicy: 'network-only',
  });

  const [getGrantApplicationPaymentInfo, { data: grantApplicationPaymentInfo }] = useLazyQuery(
    GET_GRANT_APPLICATION_PAYMENT_INFO,
    {
      onError: (err) => {
        if (err?.graphQLErrors[0].extensions?.message === GRAPHQL_ERRORS.NO_RECIPIENT_WEB_3_ADDRESS) {
          setSubmissionPaymentError(
            'Recipient has no active wallet. Please inform them to connect their wallet to their account'
          );
        }
      },
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (taskOrGrant?.rewards?.length) {
      setRewardAmount(taskOrGrant?.rewards[0]?.rewardAmount);
    }
    if (taskOrGrant.reward) {
      setRewardAmount(taskOrGrant?.reward?.rewardAmount);
    }
  }, [taskOrGrant?.rewards?.length, taskOrGrant.reward]);

  useEffect(() => {
    if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
      getGrantApplicationPaymentInfo({
        variables: {
          grantApplicationId: submissionOrApplication?.id,
        },
      });
    } else {
      getSubmissionPaymentInfo({
        variables: {
          submissionId: submissionOrApplication?.id,
        },
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionOrApplication]);

  const handleCloseAll = () => {
    if (handleClose) {
      handleClose();
    }
    setShowPaymentModal(false);
  };

  const canPay = permissions.includes(PERMISSIONS.APPROVE_PAYMENT) || permissions.includes(PERMISSIONS.FULL_ACCESS);

  let displayEntity = 'Task';
  if (taskOrGrant?.type === ENTITIES_TYPES.BOUNTY) {
    displayEntity = 'Bounty';
  } else if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
    displayEntity = 'Grant';
  }

  const paymentInfo: SubmissionPaymentInfo =
    submissionPaymentInfo?.getSubmissionPaymentInfo || grantApplicationPaymentInfo?.getGrantApplicationPaymentInfo;

  const reward = taskOrGrant?.reward || (taskOrGrant?.rewards?.length ? taskOrGrant?.rewards[0] : null);

  const rewardAmountChanged = useMemo(
    () => reward?.rewardAmount !== rewardAmount,
    [reward?.rewardAmount, rewardAmount]
  );

  if (!paymentInfo) {
    return null;
  }
  if (!canPay) {
    return null;
  }

  const handleRewardAmountChange = (e) => {
    const bigChangedRewardAmount = new BigNumber(e.target.value);
    const initialBigRewardAmount = new BigNumber(reward?.rewardAmount);
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
      onClose={handleCloseAll}
      footerRight={<div ref={footerRef} />}
      footerLeft={<div ref={footerLeftRef} />}
    >
      <GradientHeading fontSize={24}>Payment for {displayEntity}</GradientHeading>
      <Grid display="flex" direction="column" gap="24px">
        <PaymentDetails
          rewardAmount={rewardAmount}
          onChange={handleRewardAmountChange}
          tokenName={reward?.tokenName}
          paymentData={paymentInfo?.paymentData[0]}
          entityType={entityType}
          payee={{
            profilePicture: submissionOrApplication?.creator?.profilePicture,
            username: submissionOrApplication?.creator?.username,
            id: submissionOrApplication?.creator?.id,
          }}
          error={changeRewardErrorText}
        />
        <Divider />
        <PaymentMethodSelector
          submissionOrApplicationId={submissionOrApplication?.id}
          wallets={wallets}
          paymentData={paymentInfo?.paymentData[0]}
          ref={footerRef}
          onClose={handleCloseAll}
          orgId={submissionOrApplication?.orgId}
          podId={submissionOrApplication?.podId}
          changedRewardAmount={rewardAmountChanged ? rewardAmount : null}
          parentError={submissionPaymentError}
          entityType={entityType}
          reward={taskOrGrant?.reward}
        />
      </Grid>
    </Modal>
  );
}

export default MakePaymentModal;
