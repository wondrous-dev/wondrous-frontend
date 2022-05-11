import { useMutation } from '@apollo/client';
import { DELETE_MILESTONE, DELETE_TASK } from 'graphql/mutations';
import CloseModalIcon from '../../Icons/closeModal';
import { ArchivedIcon } from '../../Icons/statusIcons';
import {
  StyledBody,
  StyledBox,
  StyledButtonsContainer,
  StyledCancelButton,
  StyledCloseButton,
  StyledDeleteLabel,
  StyledDeleteTaskButton,
  StyledDialog,
  StyledDivider,
  StyledHeader,
} from './styles';

interface IArchiveTaskModalProps {
  open: boolean;
  onClose: () => void;
  taskType: string;
  taskId: string;
  onDelete: () => void;
}

export const DeleteTaskModal = (props: IArchiveTaskModalProps) => {
  const { open, onClose, onDelete, taskType, taskId } = props;
  const refetchQueries = [
    'getUserTaskBoardTasks',
    'getOrgTaskBoardTasks',
    'getPodTaskBoardTasks',
    'getPerStatusTaskCountForUserBoard',
    'getPerStatusTaskCountForOrgBoard',
    'getPerStatusTaskCountForPodBoard',
    'getSubtasksForTask',
  ];
  const [deleteTask] = useMutation(DELETE_TASK, {
    variables: { taskId },
    refetchQueries,
  });
  const [deleteMilestone] = useMutation(DELETE_MILESTONE, {
    variables: { milestoneId: taskId },
    refetchQueries,
  });
  const handleDelete = () => {
    if (taskType === 'task') {
      deleteTask();
    }
    if (taskType === 'milestone') {
      deleteMilestone();
    }
    onClose();
    onDelete();
  };

  return (
    <>
      <StyledDialog
        open={open}
        onClose={onClose}
        aria-labelledby="delete-task-modal"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <StyledCloseButton onClick={onClose}>
            <CloseModalIcon />
          </StyledCloseButton>
          <StyledHeader>Delete this {taskType}?</StyledHeader>
          <StyledBody>You cannot undo this action.</StyledBody>
          <StyledDivider />
          <StyledButtonsContainer>
            <StyledCancelButton onClick={onClose}>Cancel</StyledCancelButton>
            <StyledDeleteTaskButton>
              <ArchivedIcon />
              <StyledDeleteLabel onClick={() => handleDelete()}>Delete {taskType}</StyledDeleteLabel>
            </StyledDeleteTaskButton>
          </StyledButtonsContainer>
        </StyledBox>
      </StyledDialog>
    </>
  );
};
