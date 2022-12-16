import React, { useCallback, useContext, useEffect, useState, memo, FC, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import cloneDeep from 'lodash/cloneDeep';

import { delQuery } from 'utils';
import * as Constants from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { UPDATE_TASK_ASSIGNEE, ARCHIVE_TASK, UNARCHIVE_TASK } from 'graphql/mutations/task';
import { GET_TASK_BY_ID, GET_TASK_REVIEWERS } from 'graphql/queries';
import { CLOSE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import type { TaskInterface } from 'types/task';

import { useMe } from 'components/Auth/withAuth';
import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import DeleteTaskModal from 'components/Common/DeleteTaskModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { CreateEntity } from 'components/CreateEntity';

import Card from './Card';
import { ArchivedTaskUndo } from './styles';

const getBoardType = ({ orgBoard, podBoard, userBoard }) => {
  if (orgBoard) return Constants.BOARD_TYPE.org;
  if (podBoard) return Constants.BOARD_TYPE.pod;
  if (userBoard) return Constants.BOARD_TYPE.assignee;
  return Constants.BOARD_TYPE.org;
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

const useGetTaskById = (editTask, task) => {
  const [getTaskById, { data: taskData }] = useLazyQuery(GET_TASK_BY_ID);
  useEffect(() => {
    if (editTask && task?.id) {
      getTaskById({
        variables: {
          taskId: task?.id,
        },
      });
    }
  }, [editTask, getTaskById, task?.id]);
  return taskData?.getTaskById;
};

export type TaskProps = {
  className?: string;
  task: TaskInterface;
};

const Task: FC<TaskProps> = (props) => {
  // WHAT IS THIS COMPONENT? IS IT TASK CARD? POORLY NAMED
  const { task, className } = props;
  const {
    description = '',
    rewards = null,
    id,
    media,
    status,
    title = '',
    assigneeId = null,
    assigneeUsername = null,
    assigneeProfilePicture = null,
    type,
    createdBy,
    commentCount,
  } = task;

  const router = useRouter();
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  // Need to understand context
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard || userBoard;

  const user = useMe();
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
  const [archiveTask, setArchiveTask] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const [initialStatus, setInitialStatus] = useState('');
  const [editTask, setEditTask] = useState(false);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const isMilestone = type === Constants.ENTITIES_TYPES.MILESTONE;
  const isSubtask = task?.parentTaskId !== null;
  const isBounty = type === Constants.ENTITIES_TYPES.BOUNTY;
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);

  const [archiveTaskMutation] = useMutation(ARCHIVE_TASK, {
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
  const [unarchiveTaskMutation] = useMutation(UNARCHIVE_TASK, {
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

  const taskData = useGetTaskById(editTask, task);
  const reviewerData = useGetReviewers(editTask, task);

  const closeProposal = (proposalId, columnStatus) => {
    closeTaskProposal({
      variables: {
        proposalId,
      },
      onCompleted: () => {
        const columns = cloneDeep(board?.columns);
        const columnToChange = columns.findIndex((column) => column.status === columnStatus);
        if (Number.isInteger(columnToChange)) {
          columns[columnToChange].tasks = columns[columnToChange].tasks.filter((i) => i.id !== id);
          columns[columns.length - 1].tasks = [{ ...task, closedAt: new Date() }, ...columns[columns.length - 1].tasks];
        }
        board?.setColumns(columns);
      },
      refetchQueries: ['getPerStatusTaskCountForOrgBoard'],
    });
  };

  const totalSubtask = task?.totalSubtaskCount;
  const [claimed, setClaimed] = useState(false);
  const handleOnArchive = useCallback(() => {
    orgBoard?.setFirstTimeFetch(false);
    archiveTaskMutation({
      variables: {
        taskId: id,
      },
    }).then(() => {
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

  // Parse permissions here as well
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: task?.orgId,
    podId: task?.podId,
  });

  const canArchive =
    permissions.includes(Constants.PERMISSIONS.EDIT_TASK) ||
    permissions.includes(Constants.PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(Constants.PERMISSIONS.FULL_ACCESS) ||
    task?.createdBy === user?.id;

  const canDelete =
    canArchive && (task?.type === Constants.ENTITIES_TYPES.TASK || task?.type === Constants.ENTITIES_TYPES.MILESTONE);

  const taskType = task?.isProposal ? 'taskProposal' : 'task';
  let viewUrl = `${delQuery(router.asPath)}?${taskType}=${task?.id}&view=${router.query.view || 'grid'}`;
  if (board?.entityType) {
    viewUrl += `&entity=${board?.entityType}`;
  }

  const goToPod = (podId) => {
    // Filter or go to Pod Page
    router.push(`/pod/${podId}/boards`, undefined, {
      shallow: true,
    });
  };

  const userList = useMemo(() => {
    if (!assigneeUsername) {
      return [];
    }

    return [
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
    ];
  }, [assigneeUsername, assigneeId, assigneeProfilePicture]);

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
          ...taskData,
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
        proposalRequestChange={closeProposal}
        boardType={getBoardType({
          orgBoard,
          podBoard,
          userBoard,
        })}
      />
    </span>
  );
};

export default memo(Task);
