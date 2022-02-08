import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { formatDistance } from 'date-fns';
import { TaskSectionInfoText, TaskSectionInfoDiv, MakePaymentDiv } from './styles';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { SafeImage } from '../Image';
import { useMe } from '../../Auth/withAuth';
import DefaultUserImage from '../Image/DefaultUserImage';
import { MakeSubmissionPaymentButton } from '../../CreateEntity/styles';
import { useRouter } from 'next/router';
import { useApprovedSubmission } from '../../../utils/hooks';
import { PAYMENT_STATUS } from '../../../utils/constants';

export const MakePaymentBlock = (props) => {
  const approvedSubmissionContext = useApprovedSubmission();
  const { fetchedTask, taskSubmissions, setShowPaymentModal } = props;
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const [showPaymentButton, setShowPaymentButton] = useState(null);
  useEffect(() => {
    taskSubmissions?.map((taskSubmission) => {
      if (taskSubmission.approvedAt) {
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
      approvedSubmission &&
      approvedSubmission.paymentStatus !== PAYMENT_STATUS.PROCESSING &&
      approvedSubmission.paymentStatus !== PAYMENT_STATUS.PAID;
    setShowPaymentButton(show);
  }, [approvedSubmission]);
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
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '13px',
                      marginRight: '4px',
                    }}
                    src={fetchedTask?.assigneeProfilePicture}
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
};
