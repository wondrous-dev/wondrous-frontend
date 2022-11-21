import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { formatDistance } from 'date-fns';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useApprovedSubmission } from 'utils/hooks';
import { PAYMENT_STATUS, PERMISSIONS } from 'utils/constants';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { parseUserPermissionContext } from 'utils/helpers';
import { MakeSubmissionPaymentButton } from '../../CreateEntity/styles';
import DefaultUserImage from '../Image/DefaultUserImage';
import { useMe } from '../../Auth/withAuth';
import { SafeImage } from '../Image';
import { TaskSectionInfoText, TaskSectionInfoDiv, MakePaymentDiv } from './styles';

export function MakePaymentBlock(props) {
  const approvedSubmissionContext = useApprovedSubmission();
  const { fetchedTask, taskSubmissions, setShowPaymentModal } = props;
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const [showPaymentButton, setShowPaymentButton] = useState(null);

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
      approvedSubmission.paymentStatus !== PAYMENT_STATUS.PAID &&
      fetchedTask &&
      fetchedTask?.rewards.length > 0;
    setShowPaymentButton(show);
  }, [approvedSubmission, canPay]);
  return (
    <>
      {showPaymentButton && (
        <MakePaymentDiv>
          <TaskSectionInfoDiv
            style={{
              marginTop: 0,
              width: '100%',
            }}
          >
            {fetchedTask?.assigneeUsername && (
              <>
                {fetchedTask?.assigneeProfilePicture ? (
                  <SafeImage
                    useNextImage={false}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '13px',
                      marginRight: '4px',
                    }}
                    src={fetchedTask?.assigneeProfilePicture}
                    alt="Assignee profile picture"
                  />
                ) : (
                  <DefaultUserImage
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '13px',
                      marginRight: '4px',
                    }}
                  />
                )}
                <TaskSectionInfoText
                  style={{
                    fontSize: '16px',
                  }}
                >
                  {fetchedTask?.assigneeUsername}
                </TaskSectionInfoText>
                <div
                  style={{
                    flex: 1,
                  }}
                />
                <MakeSubmissionPaymentButton onClick={handleMakePaymentButtonClick}>
                  Make Payment
                </MakeSubmissionPaymentButton>
              </>
            )}
          </TaskSectionInfoDiv>
        </MakePaymentDiv>
      )}
    </>
  );
}
