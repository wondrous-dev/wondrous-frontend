import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
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
import { GET_ORG_TASK_BOARD_TASKS } from 'graphql/queries/taskBoard';
import MilestoneIcon from '../../Icons/milestone';

import * as Constants from 'utils/constants';
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
  TaskDivider,
  MilestoneProgressWrapper,
  TaskHeaderIconWrapper,
  SubtaskCountWrapper,
  SubtaskCount,
  TaskContentFooter,
  ClaimButton,
  TaskCardDescriptionText,
} from './styles';
import { renderMentionString } from 'utils/common';
import { useRouter } from 'next/router';
import { Typography } from '@material-ui/core';
import { SafeImage } from '../Image';
import { parseUserPermissionContext, cutString, transformTaskToTaskCard } from 'utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { useLocation } from 'utils/useLocation';
import { White, Red800 } from '../../../theme/colors';
import { TaskViewModal } from './modal';
import { useMe } from '../../Auth/withAuth';
import { delQuery } from 'utils';
import { TaskSummaryAction } from '../TaskSummary/styles';
import { Arrow, Archived } from '../../Icons/sections';
import { UPDATE_TASK_STATUS, UPDATE_TASK_ASSIGNEE, ARCHIVE_TASK, UNARCHIVE_TASK } from 'graphql/mutations/task';
import { GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD, GET_TASK_REVIEWERS } from 'graphql/queries';
import { OrgBoardContext } from 'utils/contexts';
import { TaskCreatedBy } from '../TaskCreatedBy';
import { MilestoneProgress } from '../MilestoneProgress';
import { MilestoneWrapper } from '../Milestone';
import PodIcon from '../../Icons/podIcon';
import { SubtaskDarkIcon } from '../../Icons/subtask';
import { CheckedBoxIcon } from '../../Icons/checkedBox';

import { Claim } from '../../Icons/claimTask';
import { updateInProgressTask, updateTaskItem } from 'utils/board';
import { TaskBountyOverview } from '../TaskBountyOverview';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import EditLayoutBaseModal from 'components/CreateEntity/editEntityModal';
import { DeleteTaskModal } from '../DeleteTaskModal';

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

const useGetReviewers = (editTask, task) => {
  const [getReviewers, { data: reviewerData }] = useLazyQuery(GET_TASK_REVIEWERS);
  useEffect(() => {
    if (editTask && !reviewerData?.getTaskReviewers?.length) {
      getReviewers({
        variables: {
          taskId: task?.id,
        },
      });
    }
  }, [editTask, getReviewers, reviewerData?.getTaskReviewers?.length, task?.id]);
  return reviewerData?.getTaskReviewers;
};

let windowOffset = 0;
export const Task = (props) => {
  const { task, setTask, className } = props;
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
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  let { likes = 0, comments = 0, shares = 0, iLiked = false, iCommented = false, iShared = false } = actions || {};
  // Need to understand context
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const boardColumns = useColumns();
  const user = useMe();
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
  const [userList, setUserList] = useState([]);
  const [liked, setLiked] = useState(iLiked);
  const [archiveTask, setArchiveTask] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const [initialStatus, setInitialStatus] = useState('');
  const [editTask, setEditTask] = useState(false);
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
  const isSubtask = task?.parentTaskId !== null;
  const isBounty = type === Constants.ENTITIES_TYPES.BOUNTY;
  const location = useLocation();

  const [archiveTaskMutation, { data: archiveTaskData }] = useMutation(ARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
    ],
    onError: () => {
      console.error('Something went wrong with archiving tasks');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });
  const [unarchiveTaskMutation, { data: unarchiveTaskData }] = useMutation(UNARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
    ],
    onError: () => {
      console.error('Something went wrong unarchiving tasks');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });
  const [updateTaskStatusMutation, { data: updateTaskStatusMutationData }] = useMutation(UPDATE_TASK_STATUS, {
    refetchQueries: () => [
      'getUserTaskBoardTasks',
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getSubtasksForTask',
    ],
  });
  const reviewerData = useGetReviewers(editTask, task);

  const totalSubtask = task?.totalSubtaskCount;
  const completedSubtask = task?.completedSubtaskCount;
  const [claimed, setClaimed] = useState(false);
  const handleNewStatus = useCallback(
    (newStatus) => {
      orgBoard?.setFirstTimeFetch(false);
      if (newStatus === Constants.TASK_STATUS_ARCHIVED) {
        archiveTaskMutation({
          variables: {
            taskId: id,
          },
        }).then((result) => {
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(
            <>
              Task archived successfully!{' '}
              <ArchivedTaskUndo
                onClick={() => {
                  setSnackbarAlertOpen(false);
                  unarchiveTaskMutation({
                    variables: {
                      taskId: id,
                    },
                  });
                }}
              >
                Undo
              </ArchivedTaskUndo>
            </>
          );
        });
      } else {
        updateTaskStatusMutation({
          variables: {
            taskId: id,
            input: {
              newStatus,
            },
          },
        });
      }
    },
    [
      id,
      updateTaskStatusMutation,
      orgBoard,
      archiveTaskMutation,
      setSnackbarAlertMessage,
      setSnackbarAlertOpen,
      unarchiveTaskMutation,
    ]
  );

  useEffect(() => {
    if (!initialStatus) {
      setInitialStatus(status);
    }
  }, [initialStatus, setInitialStatus, status]);

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

  const canDelete =
    canArchive && (task?.type === Constants.ENTITIES_TYPES.TASK || task?.type === Constants.ENTITIES_TYPES.MILESTONE);

  const openModal = (e) => {
    const newUrl = `${delQuery(router.asPath)}?task=${task?.id}&view=${router.query.view || 'grid'}`;
    location.push(newUrl);
    // document.body.style.overflow = 'hidden'
    // document.body.scroll = false
    windowOffset = window.scrollY;
    document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
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

  return (
    <span className={className}>
      <CreateModalOverlay
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={editTask}
        onClose={() => {
          setEditTask(false);
        }}
      >
        <EditLayoutBaseModal
          open={open}
          entityType={task?.type}
          handleClose={() => {
            setEditTask(false);
          }}
          cancelEdit={() => setEditTask(false)}
          existingTask={{
            ...task,
            reviewers: reviewerData || [],
          }}
          isTaskProposal={false}
        />
      </CreateModalOverlay>
      <ArchiveTaskModal
        open={archiveTask}
        onClose={() => setArchiveTask(false)}
        onArchive={handleNewStatus}
        taskType={type}
        taskId={task?.id}
      />
      <DeleteTaskModal
        open={deleteTask}
        onClose={() => {
          setDeleteTask(false);
        }}
        taskType={type}
        taskId={task?.id}
        onDelete={() => {
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(`Deleted successfully!`);
        }}
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
                  marginRight: '8px',
                }}
              />
              {isMilestone && <MilestoneIcon />}
              <AvatarList users={userList} id={'task-' + task?.id} />
              {isSubtask && <SubtaskDarkIcon />}
              {!isSubtask && !isMilestone && totalSubtask > 0 && <CheckedBoxIcon />}
              {task?.privacyLevel === Constants.PRIVACY_LEVEL.public && (
                <PodWrapper
                  style={{
                    marginTop: '0',
                  }}
                >
                  <PodName
                    style={{
                      borderRadius: '8px',
                      marginLeft: '4px',
                    }}
                  >
                    Public
                  </PodName>
                </PodWrapper>
              )}
            </TaskHeaderIconWrapper>
            {!assigneeId && !isBounty && !isMilestone && (
              <>
                {claimed ? (
                  <ClaimButton
                    style={{
                      background: 'linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%)',
                      border: '1px solid #7427ff',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Claimed
                  </ClaimButton>
                ) : (
                  <ClaimButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateTaskAssignee({
                        variables: {
                          taskId: id,
                          assigneeId: user?.id,
                        },
                        onCompleted: (data) => {
                          setClaimed(true);
                          const task = data?.updateTaskAssignee;
                          const transformedTask = transformTaskToTaskCard(task, {});
                          if (boardColumns?.setColumns) {
                            let columns = [...boardColumns?.columns];
                            if (transformedTask.status === Constants.TASK_STATUS_IN_PROGRESS) {
                              columns = updateInProgressTask(transformedTask, columns);
                            } else if (transformedTask.status === Constants.TASK_STATUS_TODO) {
                              columns = updateTaskItem(transformedTask, columns);
                            }
                            boardColumns.setColumns(columns);
                          }
                        },
                      });
                    }}
                  >
                    <Claim />
                    <span
                      style={{
                        marginLeft: '4px',
                      }}
                    >
                      Claim
                    </span>
                  </ClaimButton>
                )}
              </>
            )}
            {rewards && rewards?.length > 0 && <Compensation rewards={rewards} taskIcon={<TaskIcon />} />}
          </TaskHeader>
          <TaskCreatedBy type={type} router={router} createdBy={createdBy} />

          <TaskContent>
            <TaskTitle>{title}</TaskTitle>
            {/* <TaskCardDescriptionText>
              {renderMentionString({
                content: description,
                router,
              })}
            </TaskCardDescriptionText> */}
            <TaskContentFooter>
              {task?.podName && (
                <PodWrapper
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToPod(task?.podId);
                  }}
                >
                  <PodIcon
                    color={task?.podColor}
                    style={{
                      width: '26px',
                      height: '26px',
                      marginRight: '8px',
                    }}
                  />
                  <PodName>{task?.podName}</PodName>
                </PodWrapper>
              )}
              {!isSubtask && !isMilestone && totalSubtask > 0 && (
                <SubtaskCountWrapper
                  style={{
                    marginTop: '24px',
                  }}
                >
                  <SubtaskDarkIcon />
                  <SubtaskCount>
                    {completedSubtask}/{totalSubtask}
                  </SubtaskCount>
                </SubtaskCountWrapper>
              )}
            </TaskContentFooter>
            {isBounty && (
              <TaskBountyOverview
                totalSubmissionsCount={task?.totalSubmissionsCount}
                approvedSubmissionsCount={task?.approvedSubmissionsCount}
              />
            )}
            {isMilestone && (
              <MilestoneProgressWrapper>
                <MilestoneProgress milestoneId={id} />
              </MilestoneProgressWrapper>
            )}
          </TaskContent>
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

  return (
    <>
      <TaskViewModal
        open={viewDetails}
        handleClose={() => {
          setViewDetails(false);
          const newUrl = `${delQuery(router.asPath)}?view=${router?.query?.view || 'grid'}`;
          window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
        }}
        taskId={taskType === Constants.TASK_STATUS_IN_REVIEW ? task?.taskId : task?.id}
        isTaskProposal={taskType === Constants.TASK_STATUS_REQUESTED}
        back={true}
      />
      <TaskListCardWrapper
        onClick={() => {
          setViewDetails(true);
        }}
      >
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
          <TaskCardDescriptionText>
            {renderMentionString({
              content: task?.description,
              router,
            })}
          </TaskCardDescriptionText>
          {task?.podName && (
            <PodWrapper
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const newUrl = `/pod/${task?.podId}/boards`;
                window.location.href = newUrl;
              }}
            >
              <PodName>{task?.podName.slice(0, 15)}</PodName>
            </PodWrapper>
          )}
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
    </>
  );
};
