import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  TodoWithBorder,
  InProgressWithBorder,
  DoneWithBorder,
  InReview,
  Requested,
  AwaitingPayment,
  Paid,
} from '../../Icons';
import Card from './card';
import { AvatarList } from '../AvatarList';
import { Compensation } from '../Compensation';
import { TaskMedia } from '../MediaPlayer';
import { CompletedIcon } from '../../Icons/statusIcons';
import { RejectIcon } from '../../Icons/taskModalIcons';
import { SnackbarAlertContext } from '../SnackbarAlert';
import { ArchiveTaskModal } from '../ArchiveTaskModal';

import * as Constants from 'utils/constants';
import { flexDivStyle, rejectIconStyle } from '../TaskSummary';
import {
  TaskHeader,
  TaskContent,
  TaskTitle,
  TaskSeparator,
  TaskFooter,
  PodWrapper,
  PodName,
  TaskListCardWrapper,
  TaskStatusHeaderText,
  ArchivedTaskUndo,
  TaskCardDescriptionText,
} from './styles';
import { renderMentionString } from 'utils/common';
import { useRouter } from 'next/router';
import { SafeImage } from '../Image';
import { parseUserPermissionContext } from 'utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { useLocation } from 'utils/useLocation';
import { TaskViewModal } from './modal';
import { useMe } from '../../Auth/withAuth';
import { delQuery } from 'utils';
import { TaskSummaryAction } from '../TaskSummary/styles';
import { Arrow, Archived } from '../../Icons/sections';
import { UPDATE_TASK_STATUS, UPDATE_TASK_ASSIGNEE, ARCHIVE_TASK, UNARCHIVE_TASK } from 'graphql/mutations/task';
import { GET_TASK_REVIEWERS } from 'graphql/queries';
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
    const type = task?.isProposal ? 'taskProposal' : 'task';
    const newUrl = `${delQuery(router.asPath)}?${type}=${task?.id}&view=${router.query.view || 'grid'}`;
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
      <Card
        openModal={openModal}
        id={id}
        task={task}
        isMilestone={isMilestone}
        userList={userList}
        isSubtask={isSubtask}
        totalSubtask={totalSubtask}
        rewards={rewards}
        type={type}
        createdBy={createdBy}
        isBounty={isBounty}
        title={title}
        description={description}
        goToPod={goToPod}
        completedSubtask={completedSubtask}
        media={media}
        assigneeId={assigneeId}
        claimed={claimed}
        updateTaskAssignee={updateTaskAssignee}
        setClaimed={setClaimed}
        user={user}
        commentCount={commentCount}
        canArchive={canArchive}
        setEditTask={setEditTask}
        setArchiveTask={setArchiveTask}
        canDelete={canDelete}
        setDeleteTask={setDeleteTask}
      />
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
    </>
  );
};
