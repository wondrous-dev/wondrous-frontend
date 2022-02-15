import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { LogoButton } from '../logo';
import {
  TodoWithBorder,
  InProgressWithBorder,
  DoneWithBorder,
  InReview,
  Requested,
  AwaitingPayment,
  Paid,
} from '../../Icons';
import { TaskLikeIcon } from '../../Icons/taskLike';
import { TaskCommentIcon } from '../../Icons/taskComment';
import { TaskShareIcon } from '../../Icons/taskShare';
import { TaskMenuIcon } from '../../Icons/taskMenu';

import { AvatarList, SmallAvatar } from '../AvatarList';
import { Compensation } from '../Compensation';
import { TaskMedia } from '../MediaPlayer';
import { DropDown, DropDownItem } from '../dropdown';
import { CompletedIcon } from '../../Icons/statusIcons';
import { RejectIcon } from '../../Icons/taskModalIcons';
import { SnackbarAlertContext } from '../SnackbarAlert';
import { ArchiveTaskModal } from '../ArchiveTaskModal';
import { GET_ORG_TASK_BOARD_TASKS } from '../../../graphql/queries/taskBoard';
import MilestoneIcon from '../../Icons/milestone';

import * as Constants from '../../../utils/constants';
import { flexDivStyle, rejectIconStyle } from '../TaskSummary';
import {
  TaskWrapper,
  TaskInner,
  TaskHeader,
  TaskContent,
  TaskTitle,
  TaskSeparator,
  TaskFooter,
  TaskAction,
  TaskActionAmount,
  TaskActionMenu,
  PodWrapper,
  PodName,
  TaskListCardWrapper,
  TaskStatusHeaderText,
  ArchivedTaskUndo,
  MilestoneSeparator,
  MilestoneProgressWrapper,
  TaskHeaderIconWrapper,
} from './styles';
import { renderMentionString } from '../../../utils/common';
import { useRouter } from 'next/router';
import { Typography } from '@material-ui/core';
import { SafeImage } from '../Image';
import { parseUserPermissionContext, cutString } from '../../../utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks';
import { White } from '../../../theme/colors';
import { TaskViewModal } from './modal';
import { useMe } from '../../Auth/withAuth';
import { delQuery } from '../../../utils';
import { TaskSummaryAction } from '../TaskSummary/styles';
import { Arrow, Archived } from '../../Icons/sections';
import { UPDATE_TASK_STATUS } from '../../../graphql/mutations/task';
import { GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD } from '../../../graphql/queries';
import { OrgBoardContext } from '../../../utils/contexts';
import { MilestoneLaunchedBy } from '../MilestoneLaunchedBy';
import { MilestoneProgress } from '../MilestoneProgress';
import { MilestoneWrapper } from '../Milestone';
import PodIcon from '../../Icons/podIcon';

export const TASK_ICONS = {
  [Constants.TASK_STATUS_TODO]: TodoWithBorder,
  [Constants.TASK_STATUS_IN_PROGRESS]: InProgressWithBorder,
  [Constants.TASK_STATUS_DONE]: DoneWithBorder,
  [Constants.TASK_STATUS_IN_REVIEW]: InReview,
  [Constants.TASK_STATUS_REQUESTED]: Requested,
  [Constants.TASK_STATUS_ARCHIVED]: Archived,
  [Constants.TASK_STATUS_AWAITING_PAYMENT]: AwaitingPayment,
  [Constants.TASK_STATUS_PAID]: Paid,
};

let windowOffset = 0;
export const Task = ({ task, setTask, onOpen = (task) => null, className }) => {
  const {
    actions = {},
    description = '',
    compensation = {},
    rewards = null,
    id,
    media,
    status,
    title = '',
    assigneeId = null,
    assigneeUsername = null,
    assigneeProfilePicture = null,
    users = [],
    type,
    createdBy,
    commentCount,
  } = task;
  const router = useRouter();
  let { likes = 0, comments = 0, shares = 0, iLiked = false, iCommented = false, iShared = false } = actions || {};
  // Need to understand context
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const user = useMe();
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
  const [userList, setUserList] = useState([]);
  const [liked, setLiked] = useState(iLiked);
  const [modalOpen, setModalOpen] = useState(false);
  const [archiveTask, setArchiveTask] = useState(false);
  const [initialStatus, setInitialStatus] = useState('');
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  let TaskIcon = TASK_ICONS[status];
  if (task?.paymentStatus === Constants.PAYMENT_STATUS.PROCESSING) {
    TaskIcon = TASK_ICONS[Constants.TASK_STATUS_AWAITING_PAYMENT];
  }
  if (task?.paymentStatus === Constants.PAYMENT_STATUS.PAID) {
    TaskIcon = TASK_ICONS[Constants.TASK_STATUS_PAID];
  }
  const isMilestone = type === Constants.ENTITIES_TYPES.MILESTONE;

  const [updateTaskStatusMutation, { data: updateTaskStatusMutationData }] = useMutation(UPDATE_TASK_STATUS, {
    refetchQueries: () => [
      {
        query: GET_ORG_TASK_BOARD_TASKS,
        variables: orgBoard?.getOrgTasksVariables,
      },
      {
        query: GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
        variables: orgBoard?.getOrgBoardTaskCountVariables,
      },
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getSubtasksForTask',
      'getSubtaskCountForTask',
    ],
  });

  const handleNewStatus = useCallback(
    (newStatus) => {
      orgBoard?.setFirstTimeFetch(false);
      updateTaskStatusMutation({
        variables: {
          taskId: id,
          input: {
            newStatus,
          },
        },
      });
    },
    [id, updateTaskStatusMutation, orgBoard]
  );

  useEffect(() => {
    if (!initialStatus) {
      setInitialStatus(status);
    }

    if (updateTaskStatusMutationData?.updateTaskStatus.status === Constants.TASK_STATUS_ARCHIVED) {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(
        <>
          Task archived successfully!{' '}
          <ArchivedTaskUndo
            onClick={() => {
              handleNewStatus(initialStatus);
              setSnackbarAlertOpen(false);
            }}
          >
            Undo
          </ArchivedTaskUndo>
        </>
      );
    }
  }, [
    initialStatus,
    setInitialStatus,
    status,
    updateTaskStatusMutationData,
    setSnackbarAlertOpen,
    setSnackbarAlertMessage,
    handleNewStatus,
  ]);

  const toggleLike = () => {
    setLiked(!liked);

    likes = liked ? likes - 1 : likes + 1;

    setTask({
      ...task,
      actions: {
        ...actions,
        likes,
      },
    });
  };
  // Parse permissions here as well
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: task?.orgId,
    podId: task?.podId,
  });

  const canArchive =
    permissions.includes(Constants.PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(Constants.PERMISSIONS.FULL_ACCESS) ||
    task?.createdBy === user?.id;

  const openModal = () => {
    onOpen(task);
    router.replace(`${delQuery(router.asPath)}?task=${task?.id}&view=${router.query.view || 'grid'}`);
    // document.body.style.overflow = 'hidden'
    // document.body.scroll = false
    windowOffset = window.scrollY;
    document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
    setModalOpen(true);
  };

  const goToPod = (podId) => {
    // Filter or go to Pod Page
    router.push(`/pod/${podId}/boards`, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    // One assigned person.
    if (assigneeUsername) {
      // clean
      setUserList([
        {
          id: assigneeId,
          name: assigneeUsername,
          initials: assigneeUsername[0].toUpperCase(),
          avatar: {
            url: assigneeProfilePicture,
            isOwnerOfPod: false,
            color: null,
          },
        },
      ]);
    } else {
      setUserList(users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assigneeUsername]);

  const taskType = isMilestone ? 'milestone' : 'task';

  return (
    <span className={className}>
      <ArchiveTaskModal
        open={archiveTask}
        onClose={() => setArchiveTask(false)}
        onArchive={handleNewStatus}
        taskType={taskType}
      />
      <TaskViewModal
        open={modalOpen}
        handleOpen={() => setModalOpen(true)}
        handleClose={() => {
          document.body.setAttribute('style', '');
          window?.scrollTo(0, windowOffset);
          setModalOpen(false);
          router.push(`${delQuery(router.asPath)}`, undefined, {
            shallow: true,
          });
        }}
        task={task}
      />
      <TaskWrapper key={id} onClick={openModal}>
        <TaskInner>
          <TaskHeader>
            <TaskHeaderIconWrapper>
              <SafeImage
                src={task?.orgProfilePicture}
                style={{
                  width: '29px',
                  height: '28px',
                  borderRadius: '4px',
                }}
              />
              {isMilestone && <MilestoneIcon />}
              <AvatarList users={userList} id={'task-' + task?.id} />
            </TaskHeaderIconWrapper>
            {rewards && rewards?.length > 0 && <Compensation rewards={rewards} taskIcon={<TaskIcon />} />}
          </TaskHeader>
          <MilestoneLaunchedBy type={type} router={router} createdBy={createdBy} />
          {isMilestone && <MilestoneSeparator />}

          <TaskContent>
            <TaskTitle>{title}</TaskTitle>
            <p>
              {renderMentionString({
                content: cutString(description),
                router,
              })}
            </p>
            {task?.podName && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <PodIcon
                  color={task?.podColor}
                  style={{
                    width: '26px',
                    height: '26px',
                    marginRight: '8px',
                    marginBottom: '16px',
                  }}
                />
                <PodWrapper
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToPod(task?.podId);
                  }}
                >
                  <PodName>{task?.podName}</PodName>
                </PodWrapper>
              </div>
            )}
            <MilestoneProgressWrapper>{isMilestone && <MilestoneProgress milestoneId={id} />}</MilestoneProgressWrapper>
            {media?.length > 0 ? <TaskMedia media={media[0]} /> : <TaskSeparator />}
          </TaskContent>
          <TaskFooter>
            {/* <TaskAction key={'task-like-' + id} onClick={toggleLike}>
						<TaskLikeIcon liked={liked} />
						<TaskActionAmount>{likes}</TaskActionAmount>
					</TaskAction> */}
            {!isMilestone && (
              <TaskAction key={'task-comment-' + id}>
                <TaskCommentIcon />
                <TaskActionAmount>{commentCount}</TaskActionAmount>
              </TaskAction>
            )}
            {/* <TaskAction key={'task-share-' + id}>
              <TaskShareIcon />
              <TaskActionAmount>{shares}</TaskActionAmount>
            </TaskAction> */}

            {canArchive && (
              <TaskActionMenu right="true">
                <DropDown DropdownHandler={TaskMenuIcon}>
                  <DropDownItem
                    key={'task-menu-edit-' + id}
                    onClick={() => {
                      setArchiveTask(true);
                    }}
                    style={{
                      color: White,
                    }}
                  >
                    Archive {taskType}
                  </DropDownItem>
                </DropDown>
              </TaskActionMenu>
            )}
          </TaskFooter>
        </TaskInner>
      </TaskWrapper>
    </span>
  );
};

export const TaskListCard = (props) => {
  const { taskType, task } = props;
  const router = useRouter();
  const [viewDetails, setViewDetails] = useState(false);
  let TaskIcon = TASK_ICONS?.[taskType];
  if (task?.paymentStatus === Constants.PAYMENT_STATUS.PROCESSING) {
    TaskIcon = TASK_ICONS[Constants.TASK_STATUS_AWAITING_PAYMENT];
  }
  if (task?.paymentStatus === Constants.PAYMENT_STATUS.PAID) {
    TaskIcon = TASK_ICONS[Constants.TASK_STATUS_PAID];
  }
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const userPermissionsContext = board?.userPermissionsContext;
  const user = useMe();
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: task?.orgId,
    podId: task?.podId,
  });

  let canEdit, canApprove;
  if (taskType === Constants.TASK_STATUS_REQUESTED) {
    canEdit = permissions.includes(Constants.PERMISSIONS.FULL_ACCESS) || task.createdBy === user?.id;
    canApprove =
      permissions.includes(Constants.PERMISSIONS.FULL_ACCESS) ||
      permissions.includes(Constants.PERMISSIONS.CREATE_TASK);
  } else if (taskType === Constants.TASK_STATUS_IN_REVIEW) {
    canEdit = task.createdBy === user?.id;
    canApprove =
      permissions.includes(Constants.PERMISSIONS.FULL_ACCESS) ||
      permissions.includes(Constants.PERMISSIONS.REVIEW_TASK);
  } else if (taskType === Constants.TASK_STATUS_ARCHIVED) {
    canEdit = task.createdBy === user?.id || task.assigneeId === user?.id;
  }
  if (viewDetails) {
    return (
      <TaskViewModal
        open={true}
        handleClose={() => {
          setViewDetails(false);
        }}
        task={taskType === Constants.TASK_STATUS_IN_REVIEW ? null : task}
        taskId={taskType === Constants.TASK_STATUS_IN_REVIEW ? task?.taskId : task?.id}
        isTaskProposal={taskType === Constants.TASK_STATUS_REQUESTED}
        back={true}
      />
    );
  }

  return (
    <TaskListCardWrapper onClick={() => setViewDetails(true)}>
      <TaskHeader>
        <SafeImage
          src={task?.orgProfilePicture}
          style={{
            width: '29px',
            height: '28px',
            borderRadius: '4px',
          }}
        />
        <AvatarList
          style={{ marginLeft: '12px' }}
          users={[
            {
              id: task?.assigneeId || task?.createdBy,
              name: task?.assigneeUsername || task?.creatorUsername,
              initials:
                (task?.assigneeUsername && task?.assigneeUsername[0].toUpperCase()) ||
                (task?.creatorUsername && task?.creatorUsername[0].toUpperCase()),
              avatar: {
                url: task?.assigneeProfilePicture || task?.creatorProfilePicture,
                isOwnerOfPod: false,
                color: null,
              },
            },
          ]}
          id={'task-' + task?.id}
        />
        {task?.rewards?.length > 0 && <Compensation rewards={task?.rewards} taskIcon={<TaskIcon />} />}
      </TaskHeader>
      <TaskContent>
        <TaskTitle>{task?.title}</TaskTitle>
        <p>
          {renderMentionString({
            content: cutString(task?.description),
            router,
          })}
        </p>
        {task?.podName && (
          <PodWrapper
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/pod/${task?.podId}/boards`, undefined, {
                shallow: true,
              });
            }}
          >
            <PodName>{task?.podName.slice(0, 15)}</PodName>
          </PodWrapper>
        )}
        {task?.media?.length > 0 ? <TaskMedia media={task?.media[0]} /> : <TaskSeparator />}
      </TaskContent>
      <TaskFooter>
        {task?.changeRequestedAt && (
          <div style={flexDivStyle}>
            <RejectIcon style={rejectIconStyle} />
            <TaskStatusHeaderText>Change requested</TaskStatusHeaderText>
          </div>
        )}
        {task?.approvedAt && (
          <div style={flexDivStyle}>
            <CompletedIcon style={rejectIconStyle} />
            <TaskStatusHeaderText>Approved</TaskStatusHeaderText>
          </div>
        )}
        <TaskSummaryAction>
          Details
          <Arrow
            style={{
              marginLeft: '4px',
            }}
          />
        </TaskSummaryAction>
      </TaskFooter>
    </TaskListCardWrapper>
  );
};
