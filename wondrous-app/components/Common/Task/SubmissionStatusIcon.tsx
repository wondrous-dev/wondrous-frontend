import { CompletedIcon, InProgressIcon, InReviewIcon } from 'components/Icons/statusIcons';
import { TaskStatusHeaderText, TaskSubmissionHeaderCreatorText } from 'components/Common/Task/styles';
import { RejectIcon } from 'components/Icons/decisionIcons';
import { PAYMENT_STATUS } from 'utils/constants';
import React from 'react';

const SubmissionStatusIcon = (props) => {
  const { submission } = props;
  const iconStyle = {
    width: '28px',
    height: '28px',
    marginRight: '10px',
  };
  if (!submission?.approvedAt && !submission?.changeRequestedAt && !submission.rejectedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <InReviewIcon style={iconStyle} />
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
        <TaskStatusHeaderText>Awaiting review</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.changeRequestedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <InProgressIcon style={iconStyle} />
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
        <TaskStatusHeaderText>requested changes</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.rejectedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <RejectIcon
          style={{
            width: '16px',
            height: '16px',
            marginRight: '8px',
          }}
        />
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
        <TaskStatusHeaderText>rejected</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PAID) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CompletedIcon style={iconStyle} />
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
        <TaskStatusHeaderText>Approved and Paid</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PROCESSING) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CompletedIcon style={iconStyle} />
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
        <TaskStatusHeaderText>Approved and Processing Payment</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.approvedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CompletedIcon style={iconStyle} />
        <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
        <TaskStatusHeaderText>Approved</TaskStatusHeaderText>
      </div>
    );
  }
};

export default SubmissionStatusIcon;
