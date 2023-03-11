import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { PAYMENT_STATUS, PERMISSIONS, ENTITIES_TYPES } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useApprovedSubmission } from 'utils/hooks';
import { Button as WonderButton } from 'components/Button';
import MakePaymentModal from 'components/Common/Payment/PaymentModal';
import { MakeSubmissionPaymentButton } from 'components/Common/Task/styles';

function SubmissionPaymentButton(props) {
  const approvedSubmissionContext = useApprovedSubmission();
  const { fetchedTask, taskSubmissions, handleClose, getTaskSubmissionsForTask, submission } = props;
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const [showPaymentButton, setShowPaymentButton] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const userPermissionsContext = userPermissionsContextData?.getUserPermissionContext
    ? JSON.parse(userPermissionsContextData?.getUserPermissionContext)
    : null;

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: fetchedTask?.orgId,
    podId: fetchedTask?.podId,
  });
  const canPay = permissions.includes(PERMISSIONS.APPROVE_PAYMENT) || permissions.includes(PERMISSIONS.FULL_ACCESS);
  useEffect(() => {
    if (submission && submission?.approvedAt && !approvedSubmission) {
      setApprovedSubmission(submission);
      approvedSubmissionContext?.setApprovedSubmission(submission);
    }
  }, [submission]);
  const handleMakePaymentButtonClick = () => {
    setShowPaymentModal(true);
  };
  useEffect(() => {
    const show =
      canPay &&
      approvedSubmission &&
      approvedSubmission.paymentStatus !== PAYMENT_STATUS.PROCESSING &&
      approvedSubmission.paymentStatus !== PAYMENT_STATUS.PAID &&
      fetchedTask?.rewards.length > 0;

    setShowPaymentButton(show);
  }, [approvedSubmission, canPay]);

  const handleGoBackToTask = () => {
    setShowPaymentModal(false);
    getTaskSubmissionsForTask({
      variables: {
        taskId: fetchedTask?.id,
      },
    });
  };

  return (
    <>
      {showPaymentModal && (
        <MakePaymentModal
          handleGoBack={handleGoBackToTask}
          open={showPaymentModal}
          handleClose={handleClose}
          submissionOrApplication={approvedSubmission}
          setShowPaymentModal={setShowPaymentModal}
          taskOrGrant={fetchedTask}
        />
      )}
      {showPaymentButton && (
        <MakeSubmissionPaymentButton onClick={handleMakePaymentButtonClick}>Make Payment</MakeSubmissionPaymentButton>
      )}
    </>
  );
}

export default SubmissionPaymentButton;
