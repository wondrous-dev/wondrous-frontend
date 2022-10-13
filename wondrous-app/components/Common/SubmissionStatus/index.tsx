import { CompletedIcon, InReviewIcon, RejectedIcon } from 'components/Icons/statusIcons';
import ChangesRequestedIcon from 'components/Icons/changesRequestedIcon.svg';
import { SUBMISSION_STATUS } from 'utils/constants';
import VARIATIONS from './constants';
import {
  IconWrapper,
  TextAwaitingReview,
  TextChangesRejected,
  TextChangesRequested,
  TextCompleted,
  StatusWrapper,
} from './styles';

const statusComponents = {
  [SUBMISSION_STATUS.AWAITING_REVIEW]: {
    Icon: InReviewIcon,
    Text: TextAwaitingReview,
    content: 'Awaiting review',
  },
  [SUBMISSION_STATUS.CHANGE_REQUESTED]: {
    Icon: ChangesRequestedIcon,
    Text: TextChangesRequested,
    content: 'Change requested',
  },
  [SUBMISSION_STATUS.REJECTED]: {
    Icon: RejectedIcon,
    Text: TextChangesRejected,
    content: 'Rejected',
  },
  [SUBMISSION_STATUS.APPROVED_AND_PAID]: {
    Icon: CompletedIcon,
    Text: TextCompleted,
    content: 'Approved and paid',
  },
  [SUBMISSION_STATUS.APPROVED_AND_PROCESSING_PAYMENT]: {
    Icon: CompletedIcon,
    Text: TextCompleted,
    content: 'Approved and processing payment',
  },
  [SUBMISSION_STATUS.APPROVED]: {
    Icon: CompletedIcon,
    Text: TextCompleted,
    content: 'Approved',
  },
};

interface SubmissionStatusProps {
  status?: typeof SUBMISSION_STATUS[keyof typeof SUBMISSION_STATUS];
  variation?: typeof VARIATIONS[keyof typeof VARIATIONS];
}

const SubmissionStatus = (props: SubmissionStatusProps) => {
  const { status = null, variation = VARIATIONS.default } = props;
  const { Icon, Text, content } = statusComponents[status] || {};
  if (!status) return null;
  return (
    <StatusWrapper variation={variation}>
      {variation === VARIATIONS.rounded && (
        <IconWrapper>
          <Icon />
        </IconWrapper>
      )}
      <Text>{content}</Text>
    </StatusWrapper>
  );
};

export default SubmissionStatus;
