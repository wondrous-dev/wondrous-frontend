import { useLazyQuery, useMutation } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import { AvatarList } from 'components/Common/AvatarList';
import { Compensation } from 'components/Common/Compensation';
import { SafeImage } from 'components/Common/Image';
import { TaskMedia } from 'components/Common/MediaPlayer';
import { flexDivStyle, rejectIconStyle } from 'components/Common/TaskSummary';
import { TaskSummaryAction } from 'components/Common/TaskSummary/styles';
import TaskViewModal from 'components/Common/TaskViewModal';
import { Arrow } from 'components/Icons/sections';
import { CompletedIcon } from 'components/Icons/statusIcons';
import { RejectIcon } from 'components/Icons/taskModalIcons';
import { UPDATE_TASK_ASSIGNEE } from 'graphql/mutations/task';
import { CLOSE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import { GET_TASK_REVIEWERS } from 'graphql/queries';
import useTaskActions from 'hooks/useTaskActions';
import { cloneDeep } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { delQuery } from 'utils';
import { renderMentionString } from 'utils/common';
import * as Constants from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';

import Card from './card';
import TASK_ICONS from './constants';
import {
  PodName,
  PodWrapper,
  TaskCardDescriptionText,
  TaskContent,
  TaskFooter,
  TaskHeader,
  TaskListCardWrapper,
  TaskSeparator,
  TaskStatusHeaderText,
  TaskTitle,
} from './styles';

const getBoardType = ({ orgBoard, podBoard, userBoard }) => {
  if (orgBoard) return Constants.BOARD_TYPE.org;
  if (podBoard) return Constants.BOARD_TYPE.pod;
  if (userBoard) return Constants.BOARD_TYPE.assignee;
  return Constants.BOARD_TYPE.org;
};

export function Task(props) {
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
    users = [],
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
  const [userList, setUserList] = useState([]);
  const [initialStatus, setInitialStatus] = useState('');
  const isMilestone = type === Constants.ENTITIES_TYPES.MILESTONE;
  const isSubtask = task?.parentTaskId !== null;
  const isBounty = type === Constants.ENTITIES_TYPES.BOUNTY;
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);
  const { editTask, archiveTask, deleteTask } = useTaskActions();

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
        setArchiveTask={() => archiveTask(task)}
        canDelete={canDelete}
        setDeleteTask={() => deleteTask(task)}
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

export function TaskListCard(props) {
  const { taskType, task } = props;
  const router = useRouter();
  const [viewDetails, setViewDetails] = useState(false);
  const TaskIcon = () => {
    if (task?.paymentStatus === Constants.PAYMENT_STATUS.PROCESSING) {
      return TASK_ICONS[Constants.TASK_STATUS_AWAITING_PAYMENT];
    }
    if (task?.paymentStatus === Constants.PAYMENT_STATUS.PAID) {
      return TASK_ICONS[Constants.TASK_STATUS_PAID];
    }
    return TASK_ICONS?.[taskType];
  };

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
        back
      />
      <TaskListCardWrapper
        onClick={() => {
          setViewDetails(true);
        }}
      >
        <TaskHeader>
          <SafeImage
            useNextImage={false}
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
            id={`task-${task?.id}`}
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
}
