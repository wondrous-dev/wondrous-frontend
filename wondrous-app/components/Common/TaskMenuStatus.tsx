import { useMutation } from '@apollo/client';
import { ButtonBase, Grid, Menu, MenuItem, Popper, Typography } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import Arrow from 'components/Icons/arrow.svg';
import {
  APPROVE_TASK_PROPOSAL,
  ARCHIVE_MILESTONE,
  ARCHIVE_TASK,
  CLOSE_TASK_PROPOSAL,
  UPDATE_MILESTONE_STATUS,
  UPDATE_TASK_STATUS,
} from 'graphql/mutations';
import {
  GET_MILESTONE_BY_ID,
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
import { useContext, useEffect, useRef, useState } from 'react';
import { ENTITIES_TYPES_FILTER_STATUSES, PROPOSAL_TYPE_STATUS_FILTERS } from 'services/board';
import styled from 'styled-components';
import { getProposalStatus } from 'utils/board';
import { ENTITIES_TYPES, PERMISSIONS, STATUS_APPROVED, STATUS_CLOSED, TASK_STATUS_ARCHIVED } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { SnackbarAlertContext } from './SnackbarAlert';

export const TaskStatusMenuWrapper = styled(Popper)`
  && {
    z-index: 1000;
    border-radius 6px;
    outline: ${({ open, theme }) => open && `1px solid ${theme.palette.grey79}`};
    > li:first-child {
      border-radius: 6px 6px 0 0;
    }
    > li:last-child {
      border-radius: 0 0 6px 6px;
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
    padding: 4px;
    height: 18px;
    width: 18px;
    transform: rotate(90deg);
    svg {
      path {
        fill: white;
      }
    }
  }
`;

export const TaskStatusMenuButton = styled(ButtonBase)`
  && {
    outline: ${({ open, theme }) => open && `1px solid ${theme.palette.highlightPurple}`};
    background-color: ${({ theme }) => theme.palette.midnight};
    width: 100%;
    min-width: fit-content;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 6px;
    gap: 8px;
    height: 28px;
    && {
      svg {
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
  GET_MILESTONE_BY_ID,
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

export const getStatusesProposal = ({ task, entityType }) => {
  const filterStatus = PROPOSAL_TYPE_STATUS_FILTERS.items;
  const status = getProposalStatus(task);
  const currentStatus = filterStatus?.find((i) => i.id === status);
  return { filterStatus, currentStatus };
};

export const getStatusesNonProposalEntity = ({ task, entityType, canArchive }) => {
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
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);
  const [archiveTaskMutation] = useMutation(ARCHIVE_TASK, {
    refetchQueries: refetchNonProposalQueries,
  });
  const [archiveMilestone] = useMutation(ARCHIVE_MILESTONE, {
    refetchQueries: refetchNonProposalQueries,
  });
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS, {
    refetchQueries: refetchNonProposalQueries,
    onError: ({ graphQLErrors }) => {
      if (graphQLErrors[0].extensions.errorCode === 'must_go_through_submission') {
        setSnackbarAlertSeverity('error');
        setSnackbarAlertMessage('Cannot complete this task without submission');
        setSnackbarAlertOpen(true);
        return;
      }
      setSnackbarAlertMessage('Something went wrong');
      setSnackbarAlertSeverity('error');
      setSnackbarAlertOpen(true);
    },
  });

  const [updateMilestoneStatus] = useMutation(UPDATE_MILESTONE_STATUS, {
    refetchQueries: refetchNonProposalQueries,
  });

  const handleOnTaskStatusChange = (newStatus) => {
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
  const handleOnMilestoneStatusChange = (newStatus) => {
    if (newStatus === TASK_STATUS_ARCHIVED) {
      return archiveMilestone({
        variables: {
          milestoneId: taskId,
        },
      });
    }
    return updateMilestoneStatus({
      variables: {
        milestoneId: taskId,
        input: {
          newStatus,
        },
      },
    });
  };
  const handleOnChange =
    entityType === ENTITIES_TYPES.MILESTONE ? handleOnMilestoneStatusChange : handleOnTaskStatusChange;
  const { filterStatus, currentStatus } = getStatusesNonProposalEntity({ task, entityType, canArchive });
  return { handleOnChange, filterStatus, currentStatus, disableMenu: false };
};

export function TaskMenu({
  currentStatus,
  filterStatus,
  handleOnChange,
  disableMenu,
  className = '',
  autoFocus = false,
  onClose = null,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(null);
    onClose?.();
  };
  const handleItemOnClick = (status) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleClose(e);
    handleOnChange(status.id);
  };

  const ref = useRef(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      setAnchorEl(ref.current);
    }
  }, [autoFocus, ref.current]);

  return (
    <Grid className={className} position="relative">
      <TaskStatusMenuButton onClick={handleClick} disabled={disableMenu} open={open} disableRipple ref={ref}>
        <Grid container item alignItems="center" gap="8px">
          {currentStatus?.icon}
          <TaskModalStatusLabel>{currentStatus?.label ?? currentStatus?.name}</TaskModalStatusLabel>
        </Grid>
        {!disableMenu && <TaskStatusMenuButtonArrow open={open} />}
      </TaskStatusMenuButton>
      <TaskStatusMenuWrapper
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disablePortal
        modifiers={[
          {
            name: 'offset',
            enabled: true,
            options: {
              offset: [0, 8],
            },
          },
        ]}
        sx={{
          width: anchorEl?.clientWidth,
        }}
      >
        {filterStatus?.map((status) => (
          <TaskStatusMenuItem key={status.id} onClick={handleItemOnClick(status)}>
            {status.icon}
            <TaskModalStatusLabel>{status?.label ?? status?.name}</TaskModalStatusLabel>
          </TaskStatusMenuItem>
        ))}
      </TaskStatusMenuWrapper>
    </Grid>
  );
}

export default function TaskMenuStatus({
  className = '',
  isTaskProposal = false,
  task,
  autoFocus = false,
  onClose = null,
  entityType = ENTITIES_TYPES.TASK,
}) {
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
      onClose={onClose}
      autoFocus={autoFocus}
    />
  );
}
