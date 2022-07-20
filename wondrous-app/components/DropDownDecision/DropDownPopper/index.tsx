import react, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  APPROVE_SUBMISSION,
  APPROVE_TASK_PROPOSAL,
  REJECT_SUBMISSION,
  REQUEST_CHANGE_SUBMISSION,
  CLOSE_TASK_PROPOSAL,
} from 'graphql/mutations';
import {
  DECISION_APPROVE_AND_PAY,
  DECISION_APPROVE_ONLY,
  DECISION_REJECT,
  DECISION_SEND_INTO_REVISION,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_SUBMISSION_REQUEST,
} from 'utils/constants';
import { ApproveAndPayIcon, ApproveOnlyIcon, RejectIcon, SendIntoRevisionIcon } from '../../Icons/decisionIcons';
import { StyledList, StyledListItem, StyledListItemIcon, StyledListItemText, StyledPopper } from './styles';
import { ErrorModal } from 'components/Common/ErrorModal';

const SUBMISSION_DECISIONS = [
  [DECISION_SEND_INTO_REVISION, SendIntoRevisionIcon],
  [DECISION_REJECT, RejectIcon],
  [DECISION_APPROVE_ONLY, ApproveOnlyIcon],
  // [DECISION_APPROVE_AND_PAY, ApproveAndPayIcon], NOTE: Per Terry's instruction, payments should be hidden for now in Admin View
];

const PROPOSAL_DECISIONS = [
  [DECISION_REJECT, RejectIcon],
  [DECISION_APPROVE_ONLY, ApproveOnlyIcon],
];
export const DropDownPopper = (props) => {
  const { task, status, onClose, openKudos, setKudosTask } = props;
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL);
  const [approveTaskSubmission] = useMutation(APPROVE_SUBMISSION);
  const [requestChangeTaskSubmission] = useMutation(REQUEST_CHANGE_SUBMISSION);
  const [rejectTaskSubmission] = useMutation(REJECT_SUBMISSION);
  const [submissionApprovalError, setSubmissionApprovalError] = useState(null);
  const handleTaskProposalDecision = (id, decision) => {
    const refetchQueries = () => ['getProposalsUserCanReview', 'getWorkFlowBoardReviewableItemsCount'];
    if (decision === DECISION_REJECT) {
      closeTaskProposal({
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
      })
        .then(() => {
          openKudos(true);
          setKudosTask(task);
        })
        .catch((err) => {
          if (err?.graphQLErrors && err?.graphQLErrors[0]?.extensions.errorCode) {
            const errorCode = err?.graphQLErrors && err?.graphQLErrors[0]?.extensions.errorCode;
            if (errorCode === 'task_already_completed') {
              setSubmissionApprovalError('Associated task is already completed, please reject the submission');
            }
            if (errorCode === 'task_already_archived') {
              setSubmissionApprovalError('Associated task is already archived, please reject the submission');
            }
          }
          console.error(err);
        });
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

  const DECISIONS = status === TASK_STATUS_PROPOSAL_REQUEST ? PROPOSAL_DECISIONS : SUBMISSION_DECISIONS;
  return (
    <>
      {submissionApprovalError && (
        <ErrorModal
          open={submissionApprovalError}
          onClose={() => setSubmissionApprovalError(null)}
          text={submissionApprovalError}
          buttonText={'Reject Submission'}
          buttonAction={() => {
            handleTaskSubmissionDecision(task.id, DECISION_REJECT);
            setSubmissionApprovalError(null);
          }}
        />
      )}
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
    </>
  );
};
