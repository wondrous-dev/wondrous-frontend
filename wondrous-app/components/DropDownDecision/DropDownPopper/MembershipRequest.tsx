import { useMutation } from '@apollo/client';
import { APPROVE_JOIN_ORG_REQUEST, REJECT_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import { APPROVE_JOIN_POD_REQUEST, REJECT_JOIN_POD_REQUEST } from 'graphql/mutations/pod';
import { DECISION_APPROVE_ONLY, DECISION_REJECT } from 'utils/constants';
import { ApproveAndPayIcon, ApproveOnlyIcon, RejectIcon, SendIntoRevisionIcon } from '../../Icons/decisionIcons';
import { StyledList, StyledListItem, StyledListItemIcon, StyledListItemText, StyledPopper } from './styles';

const DECISIONS = [
  [DECISION_REJECT, RejectIcon],
  [DECISION_APPROVE_ONLY, ApproveOnlyIcon],
  // [DECISION_APPROVE_AND_PAY, ApproveAndPayIcon], NOTE: Per Terry's instruction, payments should be hidden for now in Admin View
];

export function DropDownPopper(props) {
  const { onClose, orgId, podId, requestId } = props;
  const [approveJoinOrgRequest] = useMutation(APPROVE_JOIN_ORG_REQUEST);
  const [rejectJoinOrgRequest] = useMutation(REJECT_JOIN_ORG_REQUEST);
  const [approveJoinPodRequest] = useMutation(APPROVE_JOIN_POD_REQUEST);
  const [rejectJoinPodRequest] = useMutation(REJECT_JOIN_POD_REQUEST);
  const handleJoinOrgDecision = (decision) => {
    const refetchQueries = () => ['getJoinOrgRequests', 'getWorkFlowBoardReviewableItemsCount'];

    if (decision === DECISION_REJECT) {
      rejectJoinOrgRequest({
        variables: {
          joinOrgRequestId: requestId,
        },
        refetchQueries: refetchQueries(),
      });
    }

    if (decision === DECISION_APPROVE_ONLY) {
      approveJoinOrgRequest({
        variables: {
          joinOrgRequestId: requestId,
        },
        refetchQueries: refetchQueries(),
      });
    }
  };

  const handleJoinPodDecision = (decision) => {
    const refetchQueries = () => ['getJoinPodRequests', 'getWorkFlowBoardReviewableItemsCount'];

    if (decision === DECISION_REJECT) {
      rejectJoinPodRequest({
        variables: {
          joinPodRequestId: requestId,
        },
        refetchQueries: refetchQueries(),
      });
    }

    if (decision === DECISION_APPROVE_ONLY) {
      approveJoinPodRequest({
        variables: {
          joinPodRequestId: requestId,
        },
        refetchQueries: refetchQueries(),
      });
    }
  };

  const handleOnClick = (decision) => {
    if (podId) {
      handleJoinPodDecision(decision);
    } else if (orgId) {
      handleJoinOrgDecision(decision);
    }
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
}
