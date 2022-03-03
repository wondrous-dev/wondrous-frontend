import { useMutation } from '@apollo/client';
import {
  APPROVE_SUBMISSION,
  APPROVE_TASK_PROPOSAL,
  CLOSE_TASK_PROPOSAL,
  REJECT_SUBMISSION,
  REQUEST_CHANGE_SUBMISSION,
  REQUEST_CHANGE_TASK_PROPOSAL,
} from '../../../graphql/mutations';
import {
  DECISION_APPROVE_AND_PAY,
  DECISION_APPROVE_ONLY,
  DECISION_REJECT,
  DECISION_SEND_INTO_REVISION,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_SUBMISSION_REQUEST,
} from '../../../utils/constants';
import { ApproveAndPayIcon, ApproveOnlyIcon, RejectIcon, SendIntoRevisionIcon } from '../../Icons/decisionIcons';
import { StyledList, StyledListItem, StyledListItemIcon, StyledListItemText, StyledPopper } from './styles';

const DECISIONS = [
  [DECISION_SEND_INTO_REVISION, SendIntoRevisionIcon],
  [DECISION_REJECT, RejectIcon],
  [DECISION_APPROVE_ONLY, ApproveOnlyIcon],
  // [DECISION_APPROVE_AND_PAY, ApproveAndPayIcon], NOTE: Per Terry's instruction, payments should be hidden for now in Admin View
];

export const DropDownPopper = (props) => {
  const { task, status, onClose, openKudos, setKudosTask } = props;
  const [requestChangeTaskProposal] = useMutation(REQUEST_CHANGE_TASK_PROPOSAL);
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL);
  const [rejectTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);
  const [approveTaskSubmission] = useMutation(APPROVE_SUBMISSION);
  const [requestChangeTaskSubmission] = useMutation(REQUEST_CHANGE_SUBMISSION);
  const [rejectTaskSubmission] = useMutation(REJECT_SUBMISSION);

  const handleTaskProposalDecision = (id, decision) => {
    const refetchQueries = () => ['getProposalsUserCanReview', 'getWorkFlowBoardReviewableItemsCount'];
    if (decision === DECISION_SEND_INTO_REVISION) {
      requestChangeTaskProposal({
        variables: {
          proposalId: id,
        },
        refetchQueries: refetchQueries(),
      });
    }

    if (decision === DECISION_REJECT) {
      rejectTaskProposal({
        variables: {
          proposalId: id,
        },
        refetchQueries: refetchQueries(),
      });
    }

    if (decision === DECISION_APPROVE_ONLY) {
      approveTaskProposal({
        variables: {
          proposalId: id,
        },
        refetchQueries: refetchQueries(),
      });
    }
  };

  const handleTaskSubmissionDecision = (id, decision) => {
    const refetchQueries = () => ['getSubmissionsUserCanReview', 'getWorkFlowBoardReviewableItemsCount'];
    if (decision === DECISION_SEND_INTO_REVISION) {
      requestChangeTaskSubmission({
        variables: {
          submissionId: id,
        },
        refetchQueries: refetchQueries(),
      });
    }
    if (decision === DECISION_REJECT) {
      rejectTaskSubmission({
        variables: {
          submissionId: id,
        },
        refetchQueries: refetchQueries(),
      });
    }
    if (decision === DECISION_APPROVE_ONLY) {
      approveTaskSubmission({
        variables: {
          submissionId: id,
        },
        refetchQueries: refetchQueries(),
      });
      openKudos(true);
      setKudosTask(task);
    }
  };

  const handleOnClick = (id, decision, status) => {
    if (status === TASK_STATUS_PROPOSAL_REQUEST) {
      handleTaskProposalDecision(id, decision);
    }
    if (status === TASK_STATUS_SUBMISSION_REQUEST) {
      handleTaskSubmissionDecision(id, decision);
    }
    onClose();
  };

  return (
    <StyledPopper {...props}>
      <StyledList>
        {DECISIONS.map(([decision, Icon], i) => (
          <StyledListItem key={i} onClick={() => handleOnClick(task.id, decision, status)}>
            <StyledListItemIcon alignItems="center">
              <Icon />
            </StyledListItemIcon>
            <StyledListItemText primary={decision} />
          </StyledListItem>
        ))}
      </StyledList>
    </StyledPopper>
  );
};
