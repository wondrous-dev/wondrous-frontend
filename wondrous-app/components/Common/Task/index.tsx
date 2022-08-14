import useTaskActions from 'hooks/useTaskActions';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import * as Constants from 'utils/constants';
import { useRouter } from 'next/router';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { delQuery } from 'utils';
import { UPDATE_TASK_ASSIGNEE } from 'graphql/mutations/task';
import { CLOSE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';

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
import { useMe } from '../../Auth/withAuth';
import { Archived } from '../../Icons/sections';
import { getBoardType } from '../KanbanBoard/kanbanBoard';

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

export function Task(props) {
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
  const { editTask, deleteTask, archiveTask } = useTaskActions();
  const user = useMe();
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
  const [userList, setUserList] = useState([]);
  const [liked, setLiked] = useState(iLiked);
  const [initialStatus, setInitialStatus] = useState('');
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
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);

  const closeProposal = (id, status) => {
    closeTaskProposal({
      variables: {
        proposalId: id,
      },
      onCompleted: () => {
        const columns = [...board?.columns];
        const columnToChange = columns.findIndex((column) => column.status === status);
        if (Number.isInteger(columnToChange)) {
          columns[columnToChange].tasks = columns[columnToChange].tasks.filter((task) => task.id !== id);
          columns[columns.length - 1].tasks = [{ ...task, closedAt: new Date() }, ...columns[columns.length - 1].tasks];
        }
        board?.setColumns(columns);
      },
      refetchQueries: ['getPerStatusTaskCountForOrgBoard'],
    });
  };

  const totalSubtask = task?.totalSubtaskCount;
  const [claimed, setClaimed] = useState(false);

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
    viewUrl += `&entity=${board?.entityType}`;
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
        setEditTask={() => editTask(task)}
        setArchiveTask={() => archiveTask(board)}
        canDelete={canDelete}
        setDeleteTask={() => deleteTask(board)}
        proposalRequestChange={closeProposal}
        boardType={getBoardType({
          orgBoard,
          podBoard,
          userBoard,
        })}
      />
    </span>
  );
}
