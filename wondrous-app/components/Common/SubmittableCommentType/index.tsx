import Status from 'components/Common/Status';
import { GRANT_APPLICATION_STATUSES, SUBMISSION_COMMENT_TYPE } from 'utils/constants';
import {
  TextAwaitingReview,
  TextChangesRejected,
  TextChangesRequested,
  TextCompleted,
} from 'components/Common/Status/styles';

const statusComponents = {
  [SUBMISSION_COMMENT_TYPE.RESUBMIT]: {
    Text: TextAwaitingReview,
    defaultText: 'Resubmitted',
  },
  [SUBMISSION_COMMENT_TYPE.REOPEN]: {
    Text: TextAwaitingReview,
    defaultText: 'Re-opened',
  },
  [SUBMISSION_COMMENT_TYPE.CHANGE_REQUESTED]: {
    Text: TextChangesRequested,
    defaultText: 'Change requested',
  },
  [SUBMISSION_COMMENT_TYPE.APPROVED]: {
    Text: TextCompleted,
    defaultText: 'Approved',
  },
  [GRANT_APPLICATION_STATUSES.APPROVED]: {
    Text: TextCompleted,
    defaultText: 'Approved',
  },
  [GRANT_APPLICATION_STATUSES.APPROVED_AND_PAID]: {
    Text: TextCompleted,
    defaultText: 'Approved and paid',
  },
  [GRANT_APPLICATION_STATUSES.APPROVED_AND_PROCESSING]: {
    Text: TextCompleted,
    defaultText: 'Approved and processing payment',
  },
  [GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED]: {
    Text: TextChangesRequested,
    defaultText: 'Request changes',
  },
  [GRANT_APPLICATION_STATUSES.REJECTED]: {
    Text: TextChangesRejected,
    defaultText: 'Reject',
  },
  [GRANT_APPLICATION_STATUSES.WAITING_FOR_REVIEW]: {
    Text: TextAwaitingReview,
    defaultText: 'Waiting for review',
  },
};

interface SubmittableStatusProps {
  status: SUBMISSION_COMMENT_TYPE | GRANT_APPLICATION_STATUSES;
  text?: String;
}

const SubmittableCommentType = (props: SubmittableStatusProps) => {
  const { status, text = '' } = props;
  const selectedStatusComponent = statusComponents?.[status];
  const { Text, defaultText } = selectedStatusComponent;
  return <Status Text={Text} textContent={text || defaultText} variation="default" />;
};

export default SubmittableCommentType;
