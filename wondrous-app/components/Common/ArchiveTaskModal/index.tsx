import { useMutation } from '@apollo/client';
import { ARCHIVE_TASK_PROPOSAL } from '../../../graphql/mutations';
import { GET_ORG_TASK_BOARD_TASKS, GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD } from '../../../graphql/queries';
import { removeProposalItem } from '../../../utils/board';
import * as Constants from '../../../utils/constants';
import { useOrgBoard } from '../../../utils/hooks';
import CloseModalIcon from '../../Icons/closeModal';
import { ArchivedIcon } from '../../Icons/statusIcons';
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

export const ArchiveTaskModal = (props) => {
  const { open, onClose, onArchive, taskType, taskId = '' } = props;
  const board = useOrgBoard();
  const [archiveTaskProposal] = useMutation(ARCHIVE_TASK_PROPOSAL, {
    refetchQueries: () => [
      {
        query: GET_ORG_TASK_BOARD_TASKS,
        variables: board?.getOrgTasksVariables,
      },
      {
        query: GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
        variables: board?.getOrgBoardTaskCountVariables,
      },
    ],
  });

  const isTaskOrMilestone = taskType === Constants.TASK_TYPE || taskType === Constants.MILESTONE_TYPE;
  const isTaskProposal = taskType === 'task proposal';

  const handleArchive = () => {
    if (isTaskOrMilestone) {
      onArchive(Constants.TASK_STATUS_ARCHIVED);
    }
    if (isTaskProposal) {
      board?.setFirstTimeFetch(false);
      archiveTaskProposal({
        variables: { proposalId: taskId },
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
    <>
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
          <StyledBody>You can undo this in the archived section in the board.</StyledBody>
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
    </>
  );
};
