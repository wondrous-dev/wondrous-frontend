import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { UPDATE_TASK_ASSIGNEE, UPDATE_TASK_STATUS } from 'graphql/mutations';
import { updateInProgressTask, updateTaskItem } from 'utils/board';
import { renderMentionString } from 'utils/common';
import * as Constants from 'utils/constants';
import { TASK_STATUS_IN_PROGRESS, TASK_STATUS_TODO } from 'utils/constants';
import { cutString, parseUserPermissionContext, shrinkNumber, transformTaskToTaskCard } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { useMe } from '../Auth/withAuth';
import { AvatarList } from '../Common/AvatarList';
import { DropDown, DropDownItem } from '../Common/dropdown';
import { SafeImage } from '../Common/Image';
import { ClaimButton } from '../Common/Task/styles';
import { DropDownButtonDecision } from '../DropDownDecision/DropDownButton';
import { Claim } from '../Icons/claimTask';
import { TaskMenuIcon } from '../Icons/taskMenu';
import TaskStatus from '../Icons/TaskStatus';
import {
  Box,
  Initials,
  MoreOptions,
  Reward,
  RewardAmount,
  RewardContainer,
  StyledTableBody,
  StyledTableCell,
  StyledTableRow,
  TaskDescription,
  TaskTitle,
} from './styles';

let tasksCount = 0;
import { Red800 } from 'theme/colors';
import { DeleteTaskModal } from 'components/Common/DeleteTaskModal';

export default function TableBody({
  tasks,
  limit,
  openTask,
  isAdmin,
  setKudosTask,
  setKudosModalOpen,
  editTask,
  setSelectedTask,
  setArchiveModalOpen,
  setDeleteModalOpen,
}) {
  const user = useMe();
  const router = useRouter();
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;

  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;

  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);

  return (
    <StyledTableBody>
      {tasks.map((task, index) => {
        if (limit && tasksCount >= limit) {
          return;
        }
        tasksCount++;
        const status = task?.status;
        const dropdownItemLabel =
          status === Constants.TASK_STATUS_PROPOSAL_REQUEST || status === Constants.TASK_STATUS_REQUESTED
            ? 'task proposal'
            : 'task';
        const permissions = parseUserPermissionContext({
          userPermissionsContext,
          orgId: task?.orgId,
          podId: task?.podId,
        });

        const reward = (task.rewards || [])[0];

        const canManageTask =
          permissions.includes(Constants.PERMISSIONS.MANAGE_BOARD) ||
          permissions.includes(Constants.PERMISSIONS.FULL_ACCESS) ||
          task?.createdBy === user?.id;

        const username =
          task?.__typename === 'TaskSubmissionCard' || task?.__typename === 'TaskProposalCard'
            ? task?.creatorUsername
            : task.assigneeUsername;
        const userProfilePicture =
          task?.__typename === 'TaskSubmissionCard' || task?.__typename === 'TaskProposalCard'
            ? task?.creatorProfilePicture
            : task.assigneeProfilePicture;
        return (
          <StyledTableRow key={task.id}>
            <StyledTableCell align="center">
              {task.orgProfilePicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <SafeImage
                  src={task?.orgProfilePicture}
                  style={{
                    width: '17px',
                    height: '17px',
                    borderRadius: '17px',
                  }}
                />
              ) : null}
            </StyledTableCell>
            <StyledTableCell align="center">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                {userProfilePicture && (
                  <AvatarList
                    align="center"
                    users={[
                      {
                        avatar: {
                          url: userProfilePicture,
                        },
                        id: username,
                        initials: username,
                      },
                    ]}
                  />
                )}
                <Link passHref={true} href={`/profile/${username}/about`}>
                  <Initials>{username}</Initials>
                </Link>
              </div>
              {!task?.assigneeId &&
                (status === TASK_STATUS_TODO || status === TASK_STATUS_IN_PROGRESS) &&
                task?.type === 'task' && (
                  <>
                    <ClaimButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateTaskAssignee({
                          variables: {
                            taskId: task?.id,
                            assigneeId: user?.id,
                          },
                          onCompleted: (data) => {
                            const task = data?.updateTaskAssignee;
                            const transformedTask = transformTaskToTaskCard(task, {});
                            if (board?.setColumns) {
                              let columns = [...board?.columns];
                              if (transformedTask.status === Constants.TASK_STATUS_IN_PROGRESS) {
                                columns = updateInProgressTask(transformedTask, columns);
                              } else if (transformedTask.status === Constants.TASK_STATUS_TODO) {
                                columns = updateTaskItem(transformedTask, columns);
                              }
                              board.setColumns(columns);
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
                  </>
                )}
            </StyledTableCell>
            <StyledTableCell align="center">
              <TaskStatus status={status} />
            </StyledTableCell>
            <StyledTableCell className="clickable" onClick={() => openTask(task, status)}>
              <TaskTitle>{task.title}</TaskTitle>
              <TaskDescription
                style={{
                  maxWidth: '600px',
                }}
              >
                {renderMentionString({
                  content: cutString(task?.description),
                  router,
                })}
              </TaskDescription>
            </StyledTableCell>
            {/*<StyledTableCell>*/}
            {/*  <DeliverableContainer>*/}
            {/*    {Object.entries(groupBy(task?.media || [], 'type')).map(([key, value]: [string, any], index) => {*/}
            {/*      return (*/}
            {/*        <DeliverableItem key={index}>*/}
            {/*          <DeliverablesIconContainer>{DELIVERABLES_ICONS[key]}</DeliverablesIconContainer>*/}
            {/*          {value?.length}*/}
            {/*        </DeliverableItem>*/}
            {/*      );*/}
            {/*    })}*/}
            {/*  </DeliverableContainer>*/}
            {/*</StyledTableCell>*/}
            <StyledTableCell>
              <RewardContainer>
                {reward ? (
                  <Reward>
                    <SafeImage
                      src={reward.icon}
                      style={{
                        width: '16px',
                        height: '16px',
                      }}
                    />
                    <RewardAmount>{shrinkNumber(reward?.rewardAmount)}</RewardAmount>
                  </Reward>
                ) : (
                  <Box color="#fff">None</Box>
                )}
              </RewardContainer>
            </StyledTableCell>
            {isAdmin && (
              <StyledTableCell align="center">
                <DropDownButtonDecision
                  task={task}
                  status={task.status}
                  openKudos={setKudosModalOpen}
                  setKudosTask={setKudosTask}
                />
              </StyledTableCell>
            )}
            <StyledTableCell align="center">
              <MoreOptions disabled={!canManageTask}>
                <DropDown DropdownHandler={TaskMenuIcon} fill="#1F1F1F">
                  <DropDownItem
                    key={'task-menu-edit-' + task.id}
                    onClick={() => editTask(task, status)}
                    color="#C4C4C4"
                    fontSize="13px"
                    fontWeight="normal"
                    textAlign="left"
                  >
                    Edit {dropdownItemLabel}
                  </DropDownItem>
                  <DropDownItem
                    key={'task-menu-report-' + task.id}
                    onClick={() => {
                      setSelectedTask(task);
                      setArchiveModalOpen(true);
                    }}
                    color="#C4C4C4"
                    fontSize="13px"
                    fontWeight="normal"
                    textAlign="left"
                  >
                    Archive {dropdownItemLabel}
                  </DropDownItem>
                  {(task?.type === Constants.TASK_TYPE || task?.type === Constants.MILESTONE_TYPE) && (
                    <DropDownItem
                      key={'task-menu-delete-' + task.id}
                      onClick={() => {
                        setSelectedTask(task);
                        setDeleteModalOpen(true);
                      }}
                      color={Red800}
                      fontSize="13px"
                      fontWeight="normal"
                      textAlign="left"
                    >
                      Delete {dropdownItemLabel}
                    </DropDownItem>
                  )}
                </DropDown>
              </MoreOptions>
            </StyledTableCell>
          </StyledTableRow>
        );
      })}
    </StyledTableBody>
  );
}
