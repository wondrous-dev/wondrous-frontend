import { useLazyQuery, useMutation } from '@apollo/client';
import cloneDeep from 'lodash/cloneDeep';
import { useRouter } from 'next/router';
import React, { FC, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ARCHIVE_TASK, UNARCHIVE_TASK, UPDATE_TASK_ASSIGNEE } from 'graphql/mutations/task';
import { CLOSE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import { GET_TASK_BY_ID, GET_TASK_REVIEWERS } from 'graphql/queries';
import type { TaskInterface } from 'types/task';
import { delQuery, getBoardType } from 'utils';
import * as Constants from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';

import { useMe } from 'components/Auth/withAuth';
import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import DeleteEntityModal from 'components/Common/DeleteEntityModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { CreateEntity } from 'components/CreateEntity';

import { ARCHIVE_MILESTONE, UNARCHIVE_MILESTONE } from 'graphql/mutations';
import Card from './Card';
import { ArchivedTaskUndo } from './styles';

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
  isMilestone?: boolean;
};

const Task: FC<TaskProps> = (props) => {
  // WHAT IS THIS COMPONENT? IS IT TASK CARD? POORLY NAMED
  const { task, className, isMilestone = false } = props;
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
  const [archiveMilestoneMutation] = useMutation(ARCHIVE_MILESTONE, {
    refetchQueries: [
      'getMilestoneById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
      'getOrgBoardMilestones',
      'getPodBoardMilestones',
    ],
    onError: () => {
      console.error('Something went wrong with archiving tasks');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });
  const [unarchiveMilestoneMutation] = useMutation(UNARCHIVE_MILESTONE, {
    refetchQueries: [
      'getMilestoneById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
    ],
    onError: () => {
      console.error('Something went wrong unarchiving milestone');
    },
  });
  const [unarchiveTaskMutation] = useMutation(UNARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getOrgBoardMilestones',
      'getPodBoardMilestones',
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
  const handleUnarchive = () => {
    setSnackbarAlertOpen(false);

    if (isMilestone) {
      return unarchiveMilestoneMutation({
        variables: {
          milestoneId: id,
        },
      });
    }
    return unarchiveTaskMutation({
      variables: {
        taskId: id,
      },
    });
  };

  const handleArchive = () => {
    if (isMilestone) {
      return archiveMilestoneMutation({
        variables: {
          milestoneId: id,
        },
      });
    }
    return archiveTaskMutation({
      variables: {
        taskId: id,
      },
    });
  };
  const [claimed, setClaimed] = useState(false);
  const handleOnArchive = useCallback(() => {
    orgBoard?.setFirstTimeFetch(false);
    handleArchive().then(() => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(
        <>
          Task archived successfully! <ArchivedTaskUndo onClick={handleUnarchive}>Undo</ArchivedTaskUndo>
        </>
      );
    });
  }, [
    id,
    orgBoard,
    archiveTaskMutation,
    setSnackbarAlertMessage,
    setSnackbarAlertOpen,
    unarchiveTaskMutation,
    handleUnarchive,
    unarchiveMilestoneMutation,
  ]);

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

  const canDelete = canArchive && (task?.type === Constants.ENTITIES_TYPES.TASK || isMilestone);

  const taskType = useMemo(() => {
    if (isMilestone) {
      return Constants.ENTITIES_TYPES.MILESTONE;
    }
    return task?.isProposal ? 'taskProposal' : 'task';
  }, []);

  let viewUrl = `${delQuery(router.asPath)}?${taskType}=${task?.id}&view=${router.query.view || 'grid'}`;
  if (board?.entityType) {
    viewUrl += `&entity=${board?.entityType}`;
  }

  const goToPod = (podId) => {
    // Filter or go to Pod Page
    router.push(`/pod/${podId}/home`, undefined, {
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

  const entityType = isMilestone ? Constants.ENTITIES_TYPES.MILESTONE : task?.type;
  return (
    <span className={className}>
      <CreateEntity
        open={editTask}
        handleCloseModal={() => {
          setEditTask(false);
        }}
        entityType={entityType}
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
        isMilestone={isMilestone}
      />
      <ArchiveTaskModal
        open={archiveTask}
        onClose={() => setArchiveTask(false)}
        onArchive={handleOnArchive}
        taskType={isMilestone ? Constants.ENTITIES_TYPES.MILESTONE : type}
        taskId={task?.id}
      />
      <DeleteEntityModal
        open={deleteTask}
        onClose={() => {
          setDeleteTask(false);
        }}
        entityType={isMilestone ? Constants.ENTITIES_TYPES.MILESTONE : type}
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
