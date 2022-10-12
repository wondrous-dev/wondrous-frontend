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
  },
  [SUBMISSION_STATUS.CHANGES_REQUESTED]: {
    Icon: ChangesRequestedIcon,
    Text: TextChangesRequested,
  },
  [SUBMISSION_STATUS.REJECTED]: {
    Icon: RejectedIcon,
    Text: TextChangesRejected,
  },
  [SUBMISSION_STATUS.APPROVED_AND_PAID]: {
    Icon: CompletedIcon,
    Text: TextCompleted,
  },
  [SUBMISSION_STATUS.APPROVED_AND_PROCESSING_PAYMENT]: {
    Icon: CompletedIcon,
    Text: TextCompleted,
  },
  [SUBMISSION_STATUS.APPROVED]: {
    Icon: CompletedIcon,
    Text: TextCompleted,
  },
};

interface SubmissionStatusProps {
  status: typeof SUBMISSION_STATUS[keyof typeof SUBMISSION_STATUS];
  variation?: typeof VARIATIONS[keyof typeof VARIATIONS];
}

const SubmissionStatus = (props: SubmissionStatusProps) => {
  const { status, variation = VARIATIONS.default } = props;
  const { Icon, Text } = statusComponents[status];
  return (
    <StatusWrapper variation={variation}>
      {variation === VARIATIONS.rounded && (
        <IconWrapper>
          <Icon />
        </IconWrapper>
      )}
      <Text>{status}</Text>
    </StatusWrapper>
  );
};

export default SubmissionStatus;
