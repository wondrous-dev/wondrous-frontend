import { useMutation } from '@apollo/client';
import { APPROVE_JOIN_ORG_REQUEST, REJECT_JOIN_ORG_REQUEST } from '../../../graphql/mutations/org';
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
  [DECISION_REJECT, RejectIcon],
  [DECISION_APPROVE_ONLY, ApproveOnlyIcon],
  // [DECISION_APPROVE_AND_PAY, ApproveAndPayIcon], NOTE: Per Terry's instruction, payments should be hidden for now in Admin View
];

export const DropDownPopper = (props) => {
  const { onClose, userId, orgId } = props;
  const [approveJoinOrgRequest] = useMutation(APPROVE_JOIN_ORG_REQUEST);
  const [rejectJoinOrgRequest] = useMutation(REJECT_JOIN_ORG_REQUEST);
  const handleJoinOrgDecision = (decision) => {
    const refetchQueries = () => ['getJoinOrgRequests', 'getWorkFlowBoardReviewableItemsCount'];

    if (decision === DECISION_REJECT) {
      rejectJoinOrgRequest({
        variables: {
          orgId,
          userId,
        },
        refetchQueries: refetchQueries(),
      });
    }

    if (decision === DECISION_APPROVE_ONLY) {
      approveJoinOrgRequest({
        variables: {
          userId,
          orgId,
        },
        refetchQueries: refetchQueries(),
      });
    }
  };

  const handleOnClick = (decision) => {
    handleJoinOrgDecision(decision);
    onClose();
  };

  return (
    <StyledPopper {...props}>
      <StyledList>
        {DECISIONS.map(([decision, Icon], i) => (
          <StyledListItem key={i} onClick={() => handleOnClick(decision)}>
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
