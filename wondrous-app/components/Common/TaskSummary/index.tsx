import React, { useState } from 'react';
import { delQuery } from 'utils';
import Link from 'next/link';

import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { useRouter } from 'next/router';
import Compensation from 'components/Common/Compensation';
import { PERMISSIONS, TASK_STATUS_ARCHIVED, TASK_STATUS_IN_REVIEW, TASK_STATUS_REQUESTED } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useMutation } from '@apollo/client';
import { APPROVE_TASK_PROPOSAL, CLOSE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import { APPROVE_SUBMISSION, REQUEST_CHANGE_SUBMISSION } from 'graphql/mutations/taskSubmission';
import { addTaskItem, removeProposalItem, updateProposalItem, updateSubmissionItem } from 'utils/board';
import { renderMentionString } from 'utils/common';
import { ViewType } from 'types/common';
import { skipForCommandKey } from 'utils/links';
import { RichTextViewer } from 'components/RichText';
import { RejectIcon } from '../../Icons/taskModalIcons';
import { CompletedIcon } from '../../Icons/statusIcons';
import { TaskCommentIcon } from '../../Icons/taskComment';
import { TaskMedia } from '../MediaPlayer';
import { useMe } from '../../Auth/withAuth';
import PodIcon from '../../Icons/podIcon';
import { Arrow, Media } from '../../Icons/sections';
import {
  TaskSummaryWrapper,
  TaskSummaryMedia,
  TaskSummaryInner,
  TaskSummaryAction,
  OrgProfilePicture,
  SmallerCardActionButtons,
} from './styles';
import {
  TaskHeader,
  TaskContent,
  TaskTitle,
  TaskFooter,
  TaskStatusHeaderText,
  PodWrapper,
  PodName,
  TaskAction,
  TaskActionAmount,
  TaskSeparator,
  TaskCardDescriptionText,
} from '../Task/styles';
import { AvatarList } from '../AvatarList';
import { LogoButton } from '../logo';
import TASK_ICONS from '../Task/constants';

let windowOffset;

const iconStyle = {
  width: '20px',
  height: '20px',
  marginRight: '8px',
};

export const flexDivStyle = {
  display: 'flex',
  alignItems: 'center',
  width: 'max-content',
  marginRight: '20px',
};

export const rejectIconStyle = {
  width: '16px',
  height: '16px',
  marginRight: '4px',
};

export function TaskSummary({ task, setTask, action, taskType }) {
  const { compensation = {}, description = '', id, media, status, title = '', users = [] } = task;

  const TaskIcon = TASK_ICONS[status];
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL);
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);
  const [approveTaskSubmission] = useMutation(APPROVE_SUBMISSION);
  const [requestChangeTaskSubmission] = useMutation(REQUEST_CHANGE_SUBMISSION);

  const router = useRouter();
  const goToPod = (podId) => {
    // router query into pod
    const { username } = router.query;
    router.push(`/pod/${podId}/home`, undefined, {
      shallow: true,
    });
  };

  const openModal = () => {
    const query = {
      ...router.query,
      task: task?.id,
    };

    router.push({ query }, undefined, { scroll: false, shallow: true });
  };

  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const boardColumns = useColumns();
  const user = useMe();
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
  const board = orgBoard || podBoard || userBoard;
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: task?.orgId,
    podId: task?.podId,
  });
  let canApprove = false;
  let approve = null;
  let requestChange = null;
  if (taskType === TASK_STATUS_REQUESTED) {
    canApprove = permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.CREATE_TASK);
    approve = () =>
      approveTaskProposal({
        variables: {
          proposalId: task?.id,
        },
        onCompleted: (data) => {
          const taskProposal = data?.approveTaskProposal;
          let columns = [...boardColumns?.columns];
          // Move from proposal to task
          columns = removeProposalItem(task?.id, columns);
          columns = addTaskItem(
            {
              ...task,
              id: taskProposal?.associatedTaskId,
            },
            columns
          );
          boardColumns?.setColumns(columns);
        },
      });
    requestChange = () =>
      closeTaskProposal({
        variables: {
          proposalId: task?.id,
        },
        onCompleted: () => {
          let columns = [...boardColumns?.columns];
          columns = updateProposalItem(
            {
              ...task,
              closedAt: new Date(),
            },
            columns
          );
          boardColumns?.setColumns(columns);
        },
      });
  } else if (taskType === TASK_STATUS_IN_REVIEW) {
    canApprove = permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.REVIEW_TASK);
    approve = () =>
      approveTaskSubmission({
        variables: {
          proposalId: task?.id,
        },
        onCompleted: () => {
          let columns = [...boardColumns?.columns];
          // Move from proposal to task
          columns = updateSubmissionItem(
            {
              ...task,
              approvedAt: new Date(),
            },
            columns
          );
          boardColumns?.setColumns(columns);
        },
      });
    requestChange = () =>
      requestChangeTaskSubmission({
        variables: {
          proposalId: task?.id,
        },
        onCompleted: () => {
          let columns = [...boardColumns?.columns];
          // Move from proposal to task
          columns = updateSubmissionItem(
            {
              ...task,
              changeRequestedAt: new Date(),
              lastReviewdBy: user?.id,
            },
            columns
          );
          boardColumns?.setColumns(columns);
        },
      });
  }

  const view = router.query?.view ?? ViewType.Grid;

  let viewUrl = `${delQuery(router.asPath)}?task=${task?.id}&view=${view}`;

  if (taskType === TASK_STATUS_REQUESTED) {
    viewUrl = `${delQuery(router.asPath)}?taskProposal=${task?.id}&view=${view}`;
  } else if (taskType === TASK_STATUS_IN_REVIEW) {
    viewUrl = `${delQuery(router.asPath)}?task=${task?.taskId}&view=${view}`;
  }

  return (
    <TaskSummaryWrapper key={id} onClick={skipForCommandKey(openModal)}>
      <TaskSummaryInner>
        <TaskHeader style={{ justifyContent: 'start' }}>
          <OrgProfilePicture src={task?.orgProfilePicture} />
          <AvatarList
            id={id}
            users={[
              {
                id: task?.createdBy,
                name: task?.creatorUsername,
                initials: task?.creatorUsername && task?.creatorUsername[0].toUpperCase(),
                avatar: {
                  url: task?.creatorProfilePicture,
                  isOwnerOfPod: false,
                  color: null,
                },
              },
            ]}
          />
          {task?.rewards && task?.rewards > 0 && <Compensation compensation={task?.rewards[0]} />}
        </TaskHeader>

        <TaskContent>
          <TaskTitle>
            <Link href={viewUrl}>{title}</Link>
          </TaskTitle>
          <RichTextViewer text={task?.description} />
          {task?.podName && (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                marginTop: '16px',
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
              <PodWrapper
                style={{
                  marginTop: '0',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPod(task?.podId);
                }}
              >
                <PodName>{task?.podName.slice(0, 15)}</PodName>
              </PodWrapper>
            </div>
          )}
          {task?.media?.length > 0 ? <TaskMedia media={task?.media[0]} /> : <TaskSeparator />}
        </TaskContent>
        <TaskFooter>
          <TaskAction
            style={{
              marginRight: '0',
            }}
            key={`task-comment-${id}`}
          >
            <TaskCommentIcon />
            <TaskActionAmount>{task?.commentCount || 0}</TaskActionAmount>
          </TaskAction>
          {task?.approvedAt && (
            <TaskSummaryAction>
              <div style={flexDivStyle}>
                <CompletedIcon style={iconStyle} />
                <TaskStatusHeaderText>Approved</TaskStatusHeaderText>
              </div>
            </TaskSummaryAction>
          )}

          {action && !task?.approvedAt ? (
            <TaskSummaryAction>
              {task?.changeRequestedAt ? (
                <div style={flexDivStyle} onClick={requestChange}>
                  <RejectIcon style={rejectIconStyle} />
                  Change requested
                </div>
              ) : (
                action.text
              )}
              &nbsp;
              <Arrow />
            </TaskSummaryAction>
          ) : (
            ''
          )}
        </TaskFooter>
      </TaskSummaryInner>
    </TaskSummaryWrapper>
  );
}
