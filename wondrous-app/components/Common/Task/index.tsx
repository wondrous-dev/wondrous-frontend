import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { LogoButton } from '../logo';
import Link from 'next/link';

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
import { Typography } from '@mui/material';
import { SafeImage } from '../Image';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { useLocation } from 'utils/useLocation';
import palette from 'theme/palette';
import TaskViewModal from 'components/Common/TaskViewModal';
import { useMe } from '../../Auth/withAuth';
import { delQuery } from 'utils';
import { TaskSummaryAction } from '../TaskSummary/styles';
import { Arrow, Archived } from '../../Icons/sections';
import { UPDATE_TASK_ASSIGNEE, ARCHIVE_TASK, UNARCHIVE_TASK } from 'graphql/mutations/task';
import { GET_TASK_REVIEWERS } from 'graphql/queries';
import { DeleteTaskModal } from '../DeleteTaskModal';
import { REQUEST_CHANGE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import { getBoardType } from '../KanbanBoard/kanbanBoard';
import { CreateEntity } from 'components/CreateEntity';

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
  const board = orgBoard || podBoard || userBoard;

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
  const [requestChangeTaskProposal] = useMutation(REQUEST_CHANGE_TASK_PROPOSAL);

  const [archiveTaskMutation, { data: archiveTaskData }] = useMutation(ARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
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

  const reviewerData = useGetReviewers(editTask, task);

  const proposalRequestChange = (id, status) => {
    requestChangeTaskProposal({
      variables: {
        proposalId: id,
      },
      onCompleted: () => {
        let columns = [...board?.columns];
        const columnToChange = columns.findIndex((column) => column.status === status);
        if (Number.isInteger(columnToChange)) {
          columns[columnToChange].tasks = columns[columnToChange].tasks.filter((task) => task.id !== id);
          columns[columns.length - 1].tasks = [
            { ...task, changeRequestedAt: new Date() },
            ...columns[columns.length - 1].tasks,
          ];
        }
        board?.setColumns(columns);
      },
      refetchQueries: ['getPerStatusTaskCountForOrgBoard'],
    });
  };

  const totalSubtask = task?.totalSubtaskCount;
  const completedSubtask = task?.completedSubtaskCount;
  const [claimed, setClaimed] = useState(false);
  const handleOnArchive = useCallback(() => {
    orgBoard?.setFirstTimeFetch(false);
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
  }, [id, orgBoard, archiveTaskMutation, setSnackbarAlertMessage, setSnackbarAlertOpen, unarchiveTaskMutation]);

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

  const taskType = task?.isProposal ? 'taskProposal' : 'task';
  let viewUrl = `${delQuery(router.asPath)}?${taskType}=${task?.id}&view=${router.query.view || 'grid'}`;
  if (board?.entityType) {
    viewUrl = viewUrl + `&entity=${board?.entityType}`;
  }

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
      <CreateEntity
        open={editTask}
        handleCloseModal={() => {
          setEditTask(false);
        }}
        entityType={task?.type}
        handleClose={() => {
          setEditTask(false);
        }}
        cancel={() => setEditTask(false)}
        existingTask={{
          ...task,
          reviewers: reviewerData || [],
        }}
        isTaskProposal={false}
      />
      <ArchiveTaskModal
        open={archiveTask}
        onClose={() => setArchiveTask(false)}
        onArchive={handleOnArchive}
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
        viewUrl={viewUrl}
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
        proposalRequestChange={proposalRequestChange}
        boardType={getBoardType({
          orgBoard,
          podBoard,
          userBoard,
        })}
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
