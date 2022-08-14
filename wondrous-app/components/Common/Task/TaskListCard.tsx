import React, { useState } from 'react';
import * as Constants from 'utils/constants';
import { renderMentionString } from 'utils/common';
import { useRouter } from 'next/router';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import TaskViewModal from 'components/Common/TaskViewModal';
import { delQuery } from 'utils';

import {
  TodoWithBorder,
  InProgressWithBorder,
  DoneWithBorder,
  InReview,
  Requested,
  AwaitingPayment,
  Paid,
} from '../../Icons';
import { AvatarList } from '../AvatarList';
import { Compensation } from '../Compensation';
import { TaskMedia } from '../MediaPlayer';
import { CompletedIcon } from '../../Icons/statusIcons';
import { RejectIcon } from '../../Icons/taskModalIcons';

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
  TaskCardDescriptionText,
} from './styles';
import { SafeImage } from '../Image';
import { useMe } from '../../Auth/withAuth';
import { TaskSummaryAction } from '../TaskSummary/styles';
import { Arrow, Archived } from '../../Icons/sections';

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

export function TaskListCard(props) {
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

  let canEdit;
  let canApprove;
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
