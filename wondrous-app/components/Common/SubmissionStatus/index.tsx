import { CompletedIcon, InReviewIcon, RejectedIcon } from 'components/Icons/statusIcons';
import { SUBMISSION_STATUS } from 'utils/constants';
import {
  SubmissionItemStatusChangesRequestedIcon,
  SubmissionItemStatusTextAwaitingReview,
  SubmissionItemStatusTextChangesRejected,
  SubmissionItemStatusTextChangesRequested,
  SubmissionItemStatusTextCompleted,
  SubmissionItemStatusWrapper,
} from './styles';

const statusComponents = {
  [SUBMISSION_STATUS.AWAITING_REVIEW]: {
    Icon: InReviewIcon,
    Text: SubmissionItemStatusTextAwaitingReview,
  },
  [SUBMISSION_STATUS.CHANGES_REQUESTED]: {
    Icon: SubmissionItemStatusChangesRequestedIcon,
    Text: SubmissionItemStatusTextChangesRequested,
  },
  [SUBMISSION_STATUS.REJECTED]: {
    Icon: RejectedIcon,
    Text: SubmissionItemStatusTextChangesRejected,
  },
  [SUBMISSION_STATUS.APPROVED_AND_PAID]: {
    Icon: CompletedIcon,
    Text: SubmissionItemStatusTextCompleted,
  },
  [SUBMISSION_STATUS.APPROVED_AND_PROCESSING_PAYMENT]: {
    Icon: CompletedIcon,
    Text: SubmissionItemStatusTextCompleted,
  },
  [SUBMISSION_STATUS.APPROVED]: {
    Icon: CompletedIcon,
    Text: SubmissionItemStatusTextCompleted,
  },
};

interface SubmissionStatusProps {
  status: typeof SUBMISSION_STATUS[keyof typeof SUBMISSION_STATUS];
  hideTitle?: boolean;
}

const SubmissionStatus = (props: SubmissionStatusProps) => {
  const { status, hideTitle = false } = props;
  const { Icon, Text } = statusComponents[status] || {};
  return (
    <SubmissionItemStatusWrapper>
      <Icon />
      {!hideTitle && <Text>{status}</Text>}
    </SubmissionItemStatusWrapper>
  );
};

export default SubmissionStatus;
