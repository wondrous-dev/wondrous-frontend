import React, { useEffect, useRef, useState } from 'react';
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
import PaymentDetails from './Fields/PaymentDetails';
import PaymentMethod from './Fields/PaymentMethod';

interface Props {
  open: boolean;
  handleClose: () => void;
  setShowPaymentModal: (showPaymentModal: boolean) => void;
  handleGoBack: any;
  submissionOrApplication: any; // taskSubmission or grantApplication
  taskOrGrant: any; // task or grant
  entityType?: string;
}

function MakePaymentModal(props: Props) {
  const { open, handleClose, setShowPaymentModal, handleGoBack, submissionOrApplication, taskOrGrant, entityType } =
    props;

  const footerRef = useRef();
  const footerLeftRef = useRef();

  const [rewardAmount, setRewardAmount] = useState('');
  const [userChangedRewardAmount, setUserChangedRewardAmount] = useState(false);
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
    handleClose();
    setShowPaymentModal(false);
  };

  const canPay = permissions.includes(PERMISSIONS.APPROVE_PAYMENT) || permissions.includes(PERMISSIONS.FULL_ACCESS);

  const isBountyOrGrantApplication =
    taskOrGrant?.type === ENTITIES_TYPES.BOUNTY || entityType === ENTITIES_TYPES.GRANT_APPLICATION;
  let displayEntity = 'Task';
  if (taskOrGrant?.type === ENTITIES_TYPES.BOUNTY) {
    displayEntity = 'Bounty';
  } else if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
    displayEntity = 'Grant';
  }

  const paymentInfo: SubmissionPaymentInfo =
    submissionPaymentInfo?.getSubmissionPaymentInfo || grantApplicationPaymentInfo?.getGrantApplicationPaymentInfo;

  if (!paymentInfo) {
    return null;
  }
  if (!canPay) {
    return null;
  }
  const reward = taskOrGrant?.reward || (taskOrGrant?.rewards?.length ? taskOrGrant?.rewards[0] : null);

  return (
    <Modal
      open={open}
      maxWidth={620}
      title="Payment"
      onClose={handleCloseAll}
      footerRight={<div ref={footerRef} />}
      footerLeft={<div ref={footerLeftRef} />}
    >
      <GradientHeading fontSize={24}>Payout</GradientHeading>
      <Grid display="flex" direction="column" gap="24px">
        <PaymentDetails
          rewardAmount={rewardAmount}
          setRewardAmount={setRewardAmount}
          tokenName={reward?.tokenName}
          payee={{
            profilePicture: submissionOrApplication?.creator?.profilePicture,
            username: submissionOrApplication?.creator?.username,
          }}
          error={changeRewardErrorText}
        />
        <Divider />
        <PaymentMethod
          submissionOrApplicationId={submissionOrApplication?.id}
          wallets={wallets}
          paymentData={paymentInfo?.paymentData[0]}
          ref={footerRef}
          onClose={handleCloseAll}
          orgId={submissionOrApplication?.orgId}
          podId={submissionOrApplication?.podId}
          changedRewardAmount={userChangedRewardAmount ? rewardAmount : null}
          parentError={submissionPaymentError}
          entityType={entityType}
          reward={taskOrGrant?.reward}
        />
      </Grid>
    </Modal>
  );
}

export default MakePaymentModal;
