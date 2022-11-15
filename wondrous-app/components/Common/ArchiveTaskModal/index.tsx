import { useMutation } from '@apollo/client';
import { CLOSE_TASK_PROPOSAL } from 'graphql/mutations';
import { removeProposalItem } from 'utils/board';
import * as Constants from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import CloseModalIcon from 'components/Icons/closeModal';
import { ArchivedIcon } from 'components/Icons/statusIcons';
import {
  StyledArchivedLabel,
  StyledArchiveTaskButton,
  StyledBody,
  StyledBox,
  StyledButtonsContainer,
  StyledCancelButton,
  StyledCloseButton,
  StyledDialog,
  StyledDivider,
  StyledHeader,
} from './styles';
import { ARCHIVE_GRANT } from 'graphql/mutations/grant';

interface IArchiveTaskModalProps {
  open: boolean;
  onClose: () => void;
  onArchive: () => void;
  taskType: string;
  taskId: string;
}

export function ArchiveTaskModal(props: IArchiveTaskModalProps) {
  const { open, onClose, onArchive, taskType, taskId = '' } = props;
  const board = useOrgBoard();
  const [archiveTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);

  const [archiveGrant] = useMutation(ARCHIVE_GRANT, {
    refetchQueries: ['getGrantOrgBoard', 'getGrantPodBoard', 'getGrantById']
  })

  const isTaskOrMilestoneOrBounty =
    taskType === Constants.TASK_TYPE || taskType === Constants.MILESTONE_TYPE || taskType === Constants.BOUNTY_TYPE;
  const isTaskProposal = taskType === 'task proposal';

  const handleArchive = () => {
    if(taskType === Constants.ENTITIES_TYPES.GRANT) {
      archiveGrant({
        variables: {
          grantId: taskId
        }
      })
    }
    if (isTaskOrMilestoneOrBounty) {
      onArchive();
    }
    if (isTaskProposal) {
      board?.setFirstTimeFetch(false);
      archiveTaskProposal({
        variables: { proposalId: taskId },
        refetchQueries: () => [
          'getProposalsUserCanReview',
          'getWorkFlowBoardReviewableItemsCount',
          'getUserTaskBoardProposals',
          'getOrgTaskBoardProposals',
          'getPodTaskBoardProposals',
          'getOrgTaskBoardSubmissions',
          'getPodTaskBoardSubmissions',
          'getPerStatusTaskCountForUserBoard',
          'getPerStatusTaskCountForOrgBoard',
          'getPerStatusTaskCountForPodBoard',
          'getPerTypeTaskCountForOrgBoard',
          'getPerTypeTaskCountForPodBoard',
        ],
      })
        .then(() => {
          const updatedColumn = removeProposalItem(taskId, board.columns);
          board.setColumns(updatedColumn);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="archive-task-modal"
      aria-describedby="modal-modal-description"
    >
      <StyledBox>
        <StyledCloseButton onClick={onClose}>
          <CloseModalIcon />
        </StyledCloseButton>
        <StyledHeader>Archive this {taskType}?</StyledHeader>
        <StyledBody>
          {isTaskProposal ? 'You cannot undo this action.' : 'You can undo this in the archived section in the board.'}
        </StyledBody>
        <StyledDivider />
        <StyledButtonsContainer>
          <StyledCancelButton onClick={onClose}>Cancel</StyledCancelButton>
          <StyledArchiveTaskButton>
            <ArchivedIcon />
            <StyledArchivedLabel onClick={handleArchive}>Archive {taskType}</StyledArchivedLabel>
          </StyledArchiveTaskButton>
        </StyledButtonsContainer>
      </StyledBox>
    </StyledDialog>
  );
}
