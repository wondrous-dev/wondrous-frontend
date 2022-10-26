import Status from 'components/Common/Status';
import { SUBMISSION_COMMENT_TYPE } from 'utils/constants';
import { TextAwaitingReview, TextChangesRequested, TextCompleted } from 'components/Common/Status/styles';

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
};

interface SubmissionStatusProps {
  status: SUBMISSION_COMMENT_TYPE;
  text?: String;
}

const SubmissionCommentType = (props: SubmissionStatusProps) => {
  const { status, text = '' } = props;
  const selectedStatusComponent = statusComponents?.[status];
  const { Text, defaultText } = selectedStatusComponent;
  return <Status Text={Text} textContent={text || defaultText} variation="default" />;
};

export default SubmissionCommentType;
