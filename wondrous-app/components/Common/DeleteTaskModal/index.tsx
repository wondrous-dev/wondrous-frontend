import { useMutation } from '@apollo/client';
import CloseModalIcon from 'components/Icons/closeModal';
import { ArchivedIcon } from 'components/Icons/statusIcons';
import { DELETE_MILESTONE, DELETE_TASK, DELETE_TASK_PROPOSAL } from 'graphql/mutations';
import { DELETE_GRANT, DELETE_GRANT_APPLICATION } from 'graphql/mutations/grant';
import { SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import { useMemo } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { deleteTaskFromCache } from 'utils/helpers';
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

function DeleteTaskModal(props: IArchiveTaskModalProps) {
  const { open, onClose, onDelete, taskType, taskId } = props;
  const refetchQueries = [
    'getPerStatusTaskCountForUserBoard',
    'getPerStatusTaskCountForOrgBoard',
    'getPerStatusTaskCountForPodBoard',
    'getSubtasksForTask',
    'getPerTypeTaskCountForOrgBoard',
    'getPerTypeTaskCountForPodBoard',
    SEARCH_USER_CREATED_TASKS,
  ];
  const [deleteGrant] = useMutation(DELETE_GRANT, {
    variables: { grantId: taskId },
    refetchQueries: ['getGrantOrgBoard', 'getGrantPodBoard', 'getGrantById'],
  });

  const [deleteGrantApplication] = useMutation(DELETE_GRANT_APPLICATION, {
    variables: { grantApplicationId: taskId },
    refetchQueries: ['getGrantOrgBoard', 'getGrantPodBoard', 'getGrantById'],
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    variables: { taskId },
    refetchQueries,
    update: (cache) =>
      deleteTaskFromCache(cache, taskId, ['getUserTaskBoardTasks', 'getOrgTaskBoardTasks', 'getPodTaskBoardTasks']),
  });
  const [deleteMilestone] = useMutation(DELETE_MILESTONE, {
    variables: { milestoneId: taskId },
    refetchQueries,
    update: (cache) =>
      deleteTaskFromCache(cache, taskId, ['getUserTaskBoardTasks', 'getOrgTaskBoardTasks', 'getPodTaskBoardTasks']),
  });

  const [deleteProposal] = useMutation(DELETE_TASK_PROPOSAL, {
    variables: { proposalId: taskId },
    update: (cache) =>
      deleteTaskFromCache(cache, taskId, [
        'getOrgTaskBoardProposals',
        'getPodTaskBoardProposals',
        'getUserTaskBoardProposals',
        'getProposalsUserCanReview',
      ]),
    refetchQueries: [
      'getPerStatusTaskCountForUserBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
    ],
  });

  const handleDelete = () => {
    if (taskType === ENTITIES_TYPES.GRANT_APPLICATION) {
      deleteGrantApplication();
    }
    if (taskType === ENTITIES_TYPES.GRANT) {
      deleteGrant();
    }
    if (taskType === 'task') {
      deleteTask();
    }
    if (taskType === 'milestone') {
      deleteMilestone();
    }
    if (taskType === 'task proposal') {
      deleteProposal();
    }
    onClose();
    onDelete();
  };

  const taskTitle = useMemo(() => (taskType.includes('_') ? taskType.split('_').join(' ') : taskType), [taskType]);

  return (
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
          <StyledDeleteTaskButton data-cy="button-delete" onClick={() => handleDelete()}>
            <ArchivedIcon />
            <StyledDeleteLabel>Delete {taskType}</StyledDeleteLabel>
          </StyledDeleteTaskButton>
        </StyledButtonsContainer>
      </StyledBox>
    </StyledDialog>
  );
}

export default DeleteTaskModal;
