import React, { useState } from 'react';
import { useRouter } from 'next/router';

import * as Constants from 'utils/constants';
import { delQuery } from 'utils/index';
import { renderMentionString } from 'utils/common';

import TaskViewModal from 'components/Common/TaskViewModal';
import { SafeImage } from 'components/Common/Image';
import { AvatarList } from 'components/Common/AvatarList';
import Compensation from 'components/Common/Compensation';
import { TaskMedia } from 'components/Common/MediaPlayer';
import { flexDivStyle, rejectIconStyle } from 'components/Common/TaskSummary';
import { RejectIcon } from 'components/Icons/taskModalIcons';
import { CompletedIcon } from 'components/Icons/statusIcons';
import { TaskSummaryAction } from 'components/Common/TaskSummary/styles';
import { Arrow } from 'components/Icons/sections';

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

export default function TaskListCard(props) {
  const { taskType, task } = props;
  const router = useRouter();
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
    <TaskListCardWrapper
      onClick={() => {
        const query = {
          ...router.query,
          task: task.id,
        };

        router.push({ query }, undefined, { scroll: false, shallow: true });
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
          alt="Organization logo"
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
        {task?.rewards?.length > 0 && <Compensation rewards={task?.rewards} />}
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
              const newUrl = `/pod/${task?.podId}/home`;
              router.push(newUrl);
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
}
