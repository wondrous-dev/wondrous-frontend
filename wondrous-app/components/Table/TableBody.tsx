import React from 'react';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UPDATE_TASK_ASSIGNEE } from 'graphql/mutations';
import { updateCompletedItem, updateInProgressTask, updateInReviewItem, updateTaskItem } from 'utils/board';
import * as Constants from 'utils/constants';
import {
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUS_TODO,
  ENTITIES_TYPES,
} from 'utils/constants';
import { parseUserPermissionContext, shrinkNumber, transformTaskToTaskCard } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import palette from 'theme/palette';
import { DropDown } from 'components/Common/dropdown';
import DropdownItem from 'components/Common/DropdownItem';
import SmartLink from 'components/Common/SmartLink';
import { ViewType } from 'types/common';
import { delQuery } from 'utils/index';
import { useLocation } from 'utils/useLocation';
import Tooltip from 'components/Tooltip';
import { RichTextViewer } from 'components/RichText';
import { useMe } from '../Auth/withAuth';
import { AvatarList } from '../Common/AvatarList';
import { SafeImage } from '../Common/Image';
import { ActionButton as ClaimButton } from '../Common/Task/styles';
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
  TaskTitle,
} from './styles';

export default function TableBody({
  tasks,
  limit,
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
  const location = useLocation();

  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;

  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  const tasksToLimit = limit && tasks?.length >= limit ? tasks.slice(0, limit) : tasks;
  const view = location.params.view ?? ViewType.List;
  return (
    <StyledTableBody>
      {tasksToLimit?.map((task, index) => {
        /** task here is created with createTasksFromColumns (at least for admin panel it seems) so the schema not exactly from graphql. but mutated some how
         * it's a bit awkward to use this same components for admin panel and also for milestone bounties list view
         *  Long term solution is to not use this table components for milestone and bounties.
         */
        const status = task?.status;
        const isTaskProposal = task?.__typename === 'TaskProposalCard';
        const isTaskSubmission = task?.__typename === 'TaskSubmissionCard';
        const dropdownItemLabel = isTaskProposal ? 'Proposal' : task.type;

        const permissions = parseUserPermissionContext({
          userPermissionsContext,
          orgId: task?.orgId,
          podId: task?.podId,
        });

        let viewUrl = `${delQuery(router.asPath)}?task=${task?.id}&view=${view}`;

        if (status === TASK_STATUS_REQUESTED || status === TASK_STATUS_PROPOSAL_REQUEST || isTaskProposal) {
          viewUrl = `${delQuery(router.asPath)}?taskProposal=${task?.id}&view=${view}`;
        } else if (status === TASK_STATUS_IN_REVIEW || status === TASK_STATUS_SUBMISSION_REQUEST) {
          viewUrl = `${delQuery(router.asPath)}?task=${task?.taskId}&view=${view}`;
        }

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
                  useNextImage={false}
                  src={task?.orgProfilePicture}
                  style={{
                    width: '17px',
                    height: '17px',
                    borderRadius: '17px',
                  }}
                />
              ) : null}
            </StyledTableCell>
            {(task?.type === ENTITIES_TYPES.TASK || isAdmin) && (
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
                  <Link passHref href={`/profile/${username}/about`}>
                    <Initials>{username}</Initials>
                  </Link>
                </div>
                {!task?.assigneeId &&
                  (status === TASK_STATUS_TODO || status === TASK_STATUS_IN_PROGRESS) &&
                  task?.type === 'task' && (
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
                              if (transformedTask.status === Constants.TASK_STATUS_IN_REVIEW) {
                                columns = updateInReviewItem(transformedTask, columns);
                              } else if (transformedTask.status === Constants.TASK_STATUS_IN_PROGRESS) {
                                columns = updateInProgressTask(transformedTask, columns);
                              } else if (transformedTask.status === Constants.TASK_STATUS_TODO) {
                                columns = updateTaskItem(transformedTask, columns);
                              } else if (transformedTask.status === Constants.TASK_STATUS_DONE) {
                                columns = updateCompletedItem(transformedTask, columns);
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
                  )}
              </StyledTableCell>
            )}
            <StyledTableCell align="center">
              <TaskStatus status={status} />
            </StyledTableCell>
            <SmartLink href={viewUrl} preventLinkNavigation onNavigate={() => location.replace(viewUrl)}>
              <StyledTableCell className="clickable">
                <TaskTitle>
                  <a href={viewUrl}>{task.title}</a>
                </TaskTitle>
                <span
                  style={{
                    color: palette.white,
                  }}
                >
                  <RichTextViewer text={task?.description} />
                </span>
              </StyledTableCell>
            </SmartLink>

            <StyledTableCell>
              <RewardContainer>
                {reward ? (
                  <Reward>
                    <SafeImage
                      useNextImage={false}
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
                <Tooltip title="More actions" placement="top">
                  <div>
                    {!isTaskSubmission && (
                      <DropDown DropdownHandler={TaskMenuIcon} fill={palette?.grey95}>
                        <DropdownItem
                          key={`task-menu-edit-${task.id}${index}`}
                          onClick={() => editTask(task, status)}
                          color="#C4C4C4"
                          fontSize="13px"
                          fontWeight="normal"
                          textAlign="left"
                        >
                          Edit {dropdownItemLabel}
                        </DropdownItem>
                        <DropdownItem
                          key={`task-menu-report-${task.id}`}
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
                        </DropdownItem>
                        {(task?.type === Constants.TASK_TYPE || task?.type === Constants.MILESTONE_TYPE) &&
                          !task?.isProposal && (
                            <DropdownItem
                              key={`task-menu-delete-${task.id}`}
                              onClick={() => {
                                setSelectedTask(task);
                                setDeleteModalOpen(true);
                              }}
                              color={palette.red800}
                              fontSize="13px"
                              fontWeight="normal"
                              textAlign="left"
                            >
                              Delete {dropdownItemLabel}
                            </DropdownItem>
                          )}
                      </DropDown>
                    )}
                  </div>
                </Tooltip>
              </MoreOptions>
            </StyledTableCell>
          </StyledTableRow>
        );
      })}
    </StyledTableBody>
  );
}
