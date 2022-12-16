import Status from 'components/Common/Status';
import {
  TextAwaitingReview,
  TextChangesRejected,
  TextChangesRequested,
  TextCompleted,
} from 'components/Common/Status/styles';
import ChangesRequestedIcon from 'components/Icons/changesRequestedIcon.svg';
import { CompletedIcon, InReviewIcon, RejectedIcon } from 'components/Icons/statusIcons';
import { SUBMISSION_STATUS } from 'utils/constants';

const statusComponents = {
  [SUBMISSION_STATUS.AWAITING_REVIEW]: {
    Icon: InReviewIcon,
    Text: TextAwaitingReview,
    defaultText: 'Awaiting review',
  },
  [SUBMISSION_STATUS.CHANGE_REQUESTED]: {
    Icon: ChangesRequestedIcon,
    Text: TextChangesRequested,
    defaultText: 'Change requested',
  },
  [SUBMISSION_STATUS.REJECTED]: {
    Icon: RejectedIcon,
    Text: TextChangesRejected,
    defaultText: 'Rejected',
  },
  [SUBMISSION_STATUS.APPROVED_AND_PAID]: {
    Icon: CompletedIcon,
    Text: TextCompleted,
    defaultText: 'Approved and paid',
  },
  [SUBMISSION_STATUS.APPROVED_AND_PROCESSING_PAYMENT]: {
    Icon: CompletedIcon,
    Text: TextCompleted,
    defaultText: 'Approved and processing payment',
  },
  [SUBMISSION_STATUS.APPROVED]: {
    Icon: CompletedIcon,
    Text: TextCompleted,
    defaultText: 'Approved',
  },
};

interface SubmissionStatusProps {
  status: SUBMISSION_STATUS;
  text?: String;
}

const SubmissionStatus = (props: SubmissionStatusProps) => {
  const { status, text = '' } = props;
  const selectedStatusComponent = statusComponents?.[status];
  const { Icon, Text, defaultText } = selectedStatusComponent;
  return <Status Icon={Icon} Text={Text} textContent={text || defaultText} variation="rounded" />;
};

export default SubmissionStatus;
