import { useMutation } from '@apollo/client';
import { ButtonBase, Menu, MenuItem, Typography } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import Arrow from 'components/Icons/arrow.svg';
import { APPROVE_TASK_PROPOSAL, ARCHIVE_TASK, CLOSE_TASK_PROPOSAL, UPDATE_TASK_STATUS } from 'graphql/mutations';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE,
  GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
  GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD,
  GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_TASKS,
  GET_TASKS_FOR_MILESTONE,
  GET_TASK_BY_ID,
  GET_USER_TASK_BOARD_PROPOSALS,
  GET_USER_TASK_BOARD_TASKS,
} from 'graphql/queries';
import { GET_TASK_PROPOSAL_BY_ID } from 'graphql/queries/taskProposal';
import { useState } from 'react';
import { ENTITIES_TYPES_FILTER_STATUSES } from 'services/board';
import styled from 'styled-components';
import { getProposalStatus } from 'utils/board';
import { ENTITIES_TYPES, PERMISSIONS, STATUS_APPROVED, STATUS_CLOSED, TASK_STATUS_ARCHIVED } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';

const TaskStatusMenuWrapper = styled(Menu)`
  && {
    .MuiMenu-list,
    .MuiMenu-paper {
      padding: 0;
      background-color: ${({ theme }) => theme.palette.midnight};
      min-width: 150px;
      outline: 1px solid ${({ theme }) => theme.palette.grey79};
    }
  }
`;

const TaskStatusMenuItem = styled(MenuItem)`
  && {
    background-color: ${({ theme }) => theme.palette.midnight};
    display: flex;
    align-items: center;
    gap: 8px;
    height: 28px;
    padding: 0 6px;
    :hover {
      background: ${({ theme }) => theme.palette.grey90};
    }
    > svg {
      width: 18px !important;
      height: 18px !important;
    }
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

export const TaskStatusMenuButton = styled(ButtonBase)`
  && {
    outline: ${({ open, theme }) => open && `1px solid ${theme.palette.grey79}`};
    background-color: ${({ theme }) => theme.palette.midnight};
    min-width: fit-content;
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

const refetchNonProposalQueries = [
  GET_ORG_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
  GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD,
  GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD,
  GET_POD_TASK_BOARD_TASKS,
  GET_TASK_BY_ID,
  GET_TASKS_FOR_MILESTONE,
  GET_USER_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE,
];

const refetchTaskProposalQueries = [
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_TASK_PROPOSAL_BY_ID,
  GET_USER_TASK_BOARD_PROPOSALS,
];

const getStatusesProposal = ({ task, entityType }) => {
  const filterStatus = ENTITIES_TYPES_FILTER_STATUSES({ orgId: task?.orgId })[entityType]?.filters[0].items;
  const status = getProposalStatus(task);
  const currentStatus = filterStatus?.find((i) => i.id === status);
  return { filterStatus, currentStatus };
};

const getStatusesNonProposalEntity = ({ task, entityType, canArchive }) => {
  const entityStatus = ENTITIES_TYPES_FILTER_STATUSES({ orgId: task?.orgId })[entityType]?.filters[0].items;
  const filterStatus = canArchive ? entityStatus : entityStatus?.filter((i) => i.id !== TASK_STATUS_ARCHIVED);
  const currentStatus = entityStatus?.find((i) => i.id === task?.status);
  return { filterStatus, currentStatus };
};

const useUserPermissionContext = () => {
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  return orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
};

const useUserPermission = (task) => {
  const { user } = useMe();
  const userPermissionsContext = useUserPermissionContext();
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: task?.orgId,
    podId: task?.podId,
  });
  const canArchive =
    permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    task?.createdBy === user?.id;
  const canApproveProposal =
    permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.CREATE_TASK);
  return { canArchive, canApproveProposal };
};

const useTaskMenuStatusProposal = ({ task, entityType }) => {
  const { id: proposalId } = task;
  const { canApproveProposal } = useUserPermission(task);
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL, {
    refetchQueries: refetchTaskProposalQueries,
  });
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL, {
    refetchQueries: refetchTaskProposalQueries,
  });
  const handleOnChange = (newStatus) => {
    if (newStatus === STATUS_APPROVED) {
      approveTaskProposal({ variables: { proposalId } });
      return;
    }
    if (newStatus === STATUS_CLOSED) {
      closeTaskProposal({ variables: { proposalId } });
    }
  };
  const { filterStatus, currentStatus } = getStatusesProposal({ task, entityType });
  const disableMenu = !canApproveProposal;
  return { handleOnChange, filterStatus, currentStatus, disableMenu };
};

const useTaskMenuStatusNonProposal = ({ task, entityType }) => {
  const { id: taskId } = task;
  const { canArchive } = useUserPermission(task);
  const [archiveTaskMutation] = useMutation(ARCHIVE_TASK, {
    refetchQueries: refetchNonProposalQueries,
  });
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS, {
    refetchQueries: refetchNonProposalQueries,
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
  const { filterStatus, currentStatus } = getStatusesNonProposalEntity({ task, entityType, canArchive });
  return { handleOnChange, filterStatus, currentStatus, disableMenu: false };
};

function TaskMenu({ currentStatus, filterStatus, handleOnChange, disableMenu, className }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (e) => {
    e.preventDefault();
    setAnchorEl(null);
  };
  const handleItemOnClick = (status) => (e) => {
    e.preventDefault();
    handleClose(e);
    handleOnChange(status.id);
  };
  return (
    <span className={className}>
      <TaskStatusMenuButton onClick={handleClick} disabled={disableMenu} open={open} disableRipple>
        {currentStatus?.icon}
        <TaskModalStatusLabel>{currentStatus?.label ?? currentStatus?.name}</TaskModalStatusLabel>
        {!disableMenu && <TaskStatusMenuButtonArrow open={open} />}
      </TaskStatusMenuButton>
      <TaskStatusMenuWrapper anchorEl={anchorEl} open={open} onClose={handleClose}>
        {filterStatus?.map((status) => (
          <TaskStatusMenuItem key={status.id} onClick={handleItemOnClick(status)}>
            {status.icon}
            <TaskModalStatusLabel>{status?.label ?? status?.name}</TaskModalStatusLabel>
          </TaskStatusMenuItem>
        ))}
      </TaskStatusMenuWrapper>
    </span>
  );
}

export default function TaskMenuStatus({ className = '', isTaskProposal = false, task }) {
  const entityType = isTaskProposal ? ENTITIES_TYPES.PROPOSAL : task?.type;
  const taskMenuStatusProposal = useTaskMenuStatusProposal({
    task,
    entityType,
  });
  const taskMenuStatusNonProposal = useTaskMenuStatusNonProposal({
    task,
    entityType,
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
      className={className}
    />
  );
}
