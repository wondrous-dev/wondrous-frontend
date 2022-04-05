import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { PAYMENT_STATUS, PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useApprovedSubmission } from 'utils/hooks';
import { MakeSubmissionPaymentButton } from '../../CreateEntity/styles';
import { MakePaymentModal } from '../Payment/PaymentModal';

export const PaymentButton = (props) => {
  const approvedSubmissionContext = useApprovedSubmission();
  const { fetchedTask, taskSubmissions, handleClose, getTaskSubmissionsForTask } = props;
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
    taskSubmissions?.map((taskSubmission) => {
      if (taskSubmission?.approvedAt) {
        setApprovedSubmission(taskSubmission);
        approvedSubmissionContext?.setApprovedSubmission(taskSubmission);
      }
    });
  }, [taskSubmissions, approvedSubmissionContext]);
  const handleMakePaymentButtonClick = () => {
    setShowPaymentModal(true);
  };
  useEffect(() => {
    const show =
      canPay &&
      approvedSubmission &&
      approvedSubmission.paymentStatus !== PAYMENT_STATUS.PROCESSING &&
      approvedSubmission.paymentStatus !== PAYMENT_STATUS.PAID;
    setShowPaymentButton(show);
  }, [approvedSubmission, canPay]);
  return (
    <>
      {showPaymentModal && (
        <MakePaymentModal
          getTaskSubmissionsForTask={getTaskSubmissionsForTask}
          open={showPaymentModal}
          handleClose={handleClose}
          approvedSubmission={approvedSubmission}
          setShowPaymentModal={setShowPaymentModal}
          fetchedTask={fetchedTask}
        />
      )}
      {showPaymentButton && (
        <MakeSubmissionPaymentButton onClick={handleMakePaymentButtonClick}>Make Payment</MakeSubmissionPaymentButton>
      )}
    </>
  );
};
