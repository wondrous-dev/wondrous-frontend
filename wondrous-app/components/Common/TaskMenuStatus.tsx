import { useMutation } from '@apollo/client';
import { ButtonBase, Menu, MenuItem, Typography } from '@mui/material';
import Arrow from 'components/Icons/arrow.svg';
import { APPROVE_TASK_PROPOSAL, CLOSE_TASK_PROPOSAL, UPDATE_TASK_STATUS } from 'graphql/mutations';
import { useState } from 'react';
import { ENTITIES_TYPES_FILTER_STATUSES } from 'services/board';
import styled from 'styled-components';
import { STATUS_APPROVED, STATUS_CLOSED, STATUS_OPEN, TASK_STATUS_ARCHIVED } from 'utils/constants';

const TaskStatusMenuWrapper = styled(Menu)`
  && {
    .MuiMenu-list,
    .MuiMenu-paper {
      padding: 0;
      background-color: #141414;
      min-width: 150px;
      outline: 1px solid #424242;
    }
  }
`;

const TaskStatusMenuItem = styled(MenuItem)`
  background-color: #141414;
  display: flex;
  align-items: center;
  padding: 6px;
  gap: 8px;
  height: 28px;
  && {
    > svg {
      width: 18px !important;
      height: 18px !important;
    }
  }
  :hover {
    background: #040404;
  }
`;

const TaskStatusMenuButtonArrow = styled((props) => (
  <div {...props}>
    <Arrow />
  </div>
))`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 9px;
    transform: rotate(${({ open }) => (open ? `-90` : `90`)}deg);
    svg {
      path {
        fill: white;
      }
    }
  }
`;

const TaskStatusMenuButton = styled(ButtonBase)`
  outline: ${({ open }) => open && `1px solid #424242`};
  background-color: #141414;
  max-width: fit-content;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  gap: 8px;
  height: 28px;
  && {
    > svg {
      width: 18px !important;
      height: 18px !important;
    }
  }
`;

const TaskModalStatusLabel = styled(Typography)`
  && {
    font-size: 14px;
    line-height: 0;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightRegular};
    color: ${theme.palette.white};
  `}
  }
`;

const taskProposalStatus = (task) => {
  if (task?.approvedAt) return STATUS_APPROVED;
  if (task?.closedAt) return STATUS_CLOSED;
  return STATUS_OPEN;
};

const statusesProposal = ({ task, entityType }) => {
  const filterStatus = ENTITIES_TYPES_FILTER_STATUSES({ orgId: task?.orgId })[entityType]?.filters[0].items;
  const status = taskProposalStatus(task);
  const currentStatus = filterStatus?.find((i) => i.id === status);
  return { filterStatus, currentStatus };
};

const statusesNonProposal = ({ task, entityType, canArchive, status }) => {
  const entityStatus = ENTITIES_TYPES_FILTER_STATUSES({ orgId: task?.orgId })[entityType]?.filters[0].items;
  const filterStatus = canArchive ? entityStatus : entityStatus?.filter((i) => i.id !== TASK_STATUS_ARCHIVED);
  const currentStatus = entityStatus?.find((i) => i.id === status);
  return { filterStatus, currentStatus };
};

const useTaskMenuStatusProposal = ({ task, entityType, taskId, canApproveProposal }) => {
  const refetchTaskProposalQueries = [
    'getUserTaskBoardProposals',
    'getOrgTaskBoardProposals',
    'getPodTaskBoardProposals',
    'getTaskProposalById',
  ];
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL, {
    refetchQueries: refetchTaskProposalQueries,
  });
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL, {
    refetchQueries: refetchTaskProposalQueries,
  });
  const handleOnChange = (newStatus) => {
    if (newStatus === STATUS_APPROVED) {
      approveTaskProposal({ variables: { proposalId: taskId } });
      return;
    }
    if (newStatus === STATUS_CLOSED) {
      closeTaskProposal({ variables: { proposalId: taskId } });
    }
  };
  const { filterStatus, currentStatus } = statusesProposal({ task, entityType });
  const disableMenu = !canApproveProposal;
  return { handleOnChange, filterStatus, currentStatus, disableMenu };
};

const useTaskMenuStatusNonProposal = ({ task, entityType, canArchive, status, archiveTaskMutation, taskId }) => {
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS, {
    refetchQueries: ['getUserTaskBoardTasks', 'getOrgTaskBoardTasks', 'getPodTaskBoardTasks'],
  });
  const handleOnChange = (newStatus) => {
    if (newStatus === TASK_STATUS_ARCHIVED) {
      archiveTaskMutation({
        variables: {
          taskId,
        },
      });
      return;
    }
    updateTaskStatus({
      variables: {
        taskId,
        input: {
          newStatus,
        },
      },
    });
  };
  const { filterStatus, currentStatus } = statusesNonProposal({ task, entityType, canArchive, status });
  return { handleOnChange, filterStatus, currentStatus, disableMenu: false };
};

function TaskMenu({ currentStatus, filterStatus, handleOnChange, disableMenu }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handleOnClick = (status) => {
    handleClose();
    handleOnChange(status.id);
  };
  return (
    <>
      <TaskStatusMenuButton onClick={handleClick} disabled={disableMenu} open={open}>
        {currentStatus?.icon}
        <TaskModalStatusLabel>{currentStatus?.label ?? currentStatus?.name}</TaskModalStatusLabel>
        {!disableMenu && <TaskStatusMenuButtonArrow open={open} />}
      </TaskStatusMenuButton>
      <TaskStatusMenuWrapper anchorEl={anchorEl} open={open} onClose={handleClose}>
        {filterStatus?.map((status) => (
          <TaskStatusMenuItem key={status.id} onClick={() => handleOnClick(status)}>
            {status.icon}
            <TaskModalStatusLabel>{status?.label ?? status?.name}</TaskModalStatusLabel>
          </TaskStatusMenuItem>
        ))}
      </TaskStatusMenuWrapper>
    </>
  );
}

export default function TaskMenuStatus({
  task,
  entityType,
  archiveTaskMutation,
  canArchive,
  canApproveProposal,
  isTaskProposal,
}) {
  const status = task?.status;
  const taskId = task?.id;
  const taskMenuStatusProposal = useTaskMenuStatusProposal({
    task,
    entityType,
    taskId,
    canApproveProposal,
  });
  const taskMenuStatusNonProposal = useTaskMenuStatusNonProposal({
    task,
    entityType,
    canArchive,
    status,
    archiveTaskMutation,
    taskId,
  });
  const { handleOnChange, filterStatus, currentStatus, disableMenu } = isTaskProposal
    ? taskMenuStatusProposal
    : taskMenuStatusNonProposal;
  return (
    <TaskMenu
      currentStatus={currentStatus}
      filterStatus={filterStatus}
      handleOnChange={handleOnChange}
      disableMenu={disableMenu}
    />
  );
}
