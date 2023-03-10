import { useQuery } from '@apollo/client';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useEffect, useState } from 'react';
import { PAYMENT_STATUS, PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useApprovedSubmission } from 'utils/hooks';
import DefaultUserImage from '../Image/DefaultUserImage';
import {
  SubmissionButtonCreate,
  SubmissionButtonWrapperBackground,
  SubmissionButtonWrapperGradient,
  SubmissionItemHeaderContent,
  SubmissionItemSafeImage,
  TaskSectionInfoText,
} from './styles';

const useApprovedSubmissions = ({ taskSubmissions }) => {
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const approvedSubmissionContext = useApprovedSubmission();
  useEffect(() => {
    taskSubmissions?.map((taskSubmission) => {
      if (taskSubmission?.approvedAt) {
        setApprovedSubmission(taskSubmission);
        approvedSubmissionContext?.setApprovedSubmission(taskSubmission);
      }
    });
  }, [taskSubmissions]);
  return (
    approvedSubmission &&
    approvedSubmission.paymentStatus !== PAYMENT_STATUS.PROCESSING &&
    approvedSubmission.paymentStatus !== PAYMENT_STATUS.PAID
  );
};

const useCanPayPermission = ({ fetchedTask }) => {
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
  return canPay;
};

function SubmissionPaymentButtonCheck({ fetchedTask, approvedSubmission, canPay, children }) {
  if (canPay && approvedSubmission && fetchedTask?.rewards.length > 0 && fetchedTask?.assigneeUsername) return children;
  return null;
}

export function SubmissionPayment(props) {
  const { fetchedTask, taskSubmissions, setShowPaymentModal } = props;
  const { assigneeUsername, assigneeProfilePicture } = fetchedTask;
  const approvedSubmissions = useApprovedSubmissions({ taskSubmissions });
  const canPay = useCanPayPermission({ fetchedTask });
  const handleMakePaymentButtonClick = () => setShowPaymentModal(true);
  return (
    <SubmissionPaymentButtonCheck fetchedTask={fetchedTask} approvedSubmission={approvedSubmissions} canPay={canPay}>
      <SubmissionButtonWrapperGradient>
        <SubmissionButtonWrapperBackground>
          <SubmissionItemHeaderContent>
            {assigneeProfilePicture ? <SubmissionItemSafeImage src={assigneeProfilePicture} /> : <DefaultUserImage />}
            <TaskSectionInfoText>{assigneeUsername}</TaskSectionInfoText>
          </SubmissionItemHeaderContent>
          <SubmissionButtonCreate onClick={handleMakePaymentButtonClick}>Make Payment</SubmissionButtonCreate>
        </SubmissionButtonWrapperBackground>
      </SubmissionButtonWrapperGradient>
    </SubmissionPaymentButtonCheck>
  );
}
