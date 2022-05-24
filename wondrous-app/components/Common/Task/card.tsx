import { useState, useEffect } from 'react';
import Link from 'next/link';

import { TaskCommentIcon } from '../../Icons/taskComment';
import { TaskMenuIcon } from '../../Icons/taskMenu';
import { DropDown, DropDownItem } from '../dropdown';
import MilestoneIcon from '../../Icons/milestone';
import {
  TaskInner,
  TaskHeader,
  TaskContent,
  TaskTitle,
  TaskSeparator,
  TaskFooter,
  TaskAction,
  TaskActionAmount,
  TaskActionMenu,
  PodWrapper,
  PodName,
  TaskDivider,
  MilestoneProgressWrapper,
  TaskHeaderIconWrapper,
  SubtaskCountWrapper,
  SubtaskCount,
  TaskContentFooter,
  ActionButton,
  TaskCardDescriptionText,
  CheckedIconWrapper,
} from './styles';
import { transformTaskToTaskCard } from 'utils/helpers';
import { White, Red800 } from '../../../theme/colors';
import { TaskCreatedBy } from '../TaskCreatedBy';
import { MilestoneProgress } from '../MilestoneProgress';
import PodIcon from '../../Icons/podIcon';
import { SubtaskDarkIcon, SubtaskLightIcon } from '../../Icons/subtask';
import { CheckedBoxIcon } from '../../Icons/checkedBox';
import { Compensation } from '../Compensation';
import { Claim } from '../../Icons/claimTask';
import { updateInProgressTask, updateTaskItem, getProposalStatus } from 'utils/board';
import { TaskBountyOverview } from '../TaskBountyOverview';
import { SafeImage } from '../Image';
import * as Constants from 'utils/constants';
import { AvatarList } from '../AvatarList';
import { useRouter } from 'next/router';
import { renderMentionString } from 'utils/common';
import {
  TodoWithBorder,
  InProgressWithBorder,
  DoneWithBorder,
  InReview,
  Requested,
  AwaitingPayment,
  Paid,
  Approved,
  Rejected,
} from '../../Icons';
import { Archived } from '../../Icons/sections';
import { TaskMedia } from '../MediaPlayer';
import { useColumns } from 'utils/hooks';
import {
  BoardsCardSubheader,
  BoardsCardBody,
  BoardsCardHeader,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
  BoardsPrivacyLabel,
  BoardsCardMedia,
  BoardsCardFooter,
} from 'components/Common/Boards/styles';
import { ProposalCardWrapper, ProposalCardType, ProposalCardIcon, ProposalFooterButton } from './styles';
import { PRIVACY_LEVEL } from 'utils/constants';
import { Red300, Green800, Grey57 } from 'theme/colors';
import { MakePaymentModal } from 'components/Common/Payment/PaymentModal';
import { GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { useLazyQuery, useQuery } from '@apollo/client';
import { parseUserPermissionContext } from 'utils/helpers';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { PERMISSIONS } from 'utils/constants';
import SmartLink from 'components/Common/SmartLink';
import {useLocation} from "utils/useLocation";

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

export const TaskCard = ({
  openModal,
  id,
  task,
  isMilestone,
  userList,
  isSubtask,
  rewards,
  type,
  createdBy,
  isBounty,
  title,
  viewUrl,
  description,
  goToPod,
  media,
  assigneeId,
  updateTaskAssignee,
  user,
  commentCount,
  canArchive,
  setEditTask,
  setArchiveTask,
  canDelete,
  setDeleteTask,
}) => {
  const location = useLocation();
  let TaskIcon = TASK_ICONS[task.status];
  let windowOffset = 0;

  const boardColumns = useColumns();
  const [claimed, setClaimed] = useState(false);
  const totalSubtask = task?.totalSubtaskCount;
  const [displayActions, setDisplayActions] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isTaskSubmissionLoading, setTaskSubmissionLoading] = useState(false);
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const coverMedia = task?.media?.find((media) => media.type === 'image');

  const router = useRouter();
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const userPermissionsContext = userPermissionsContextData?.getUserPermissionContext
    ? JSON.parse(userPermissionsContextData?.getUserPermissionContext)
    : null;

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: task?.orgId,
    podId: task?.podId,
  });

  const hasPermissionToPay =
    permissions.includes(PERMISSIONS.APPROVE_PAYMENT) || permissions.includes(PERMISSIONS.FULL_ACCESS);
  const [getTaskSubmissionsForTask] = useLazyQuery(GET_TASK_SUBMISSIONS_FOR_TASK, {
    onCompleted: (data) => {
      const taskSubmissions = data?.getTaskSubmissionsForTask;
      taskSubmissions?.map((taskSubmission) => {
        if (taskSubmission?.approvedAt) {
          setApprovedSubmission(taskSubmission);
        }
      });
      setTaskSubmissionLoading(false);
      setShowPaymentModal(true);
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: (err) => {
      setTaskSubmissionLoading(false);
    },
  });

  //refactor this. move this logic in a separate hook
  const displayPayButton =
    !!task?.approvedSubmissionsCount &&
    task?.status === Constants.TASK_STATUS_DONE &&
    hasPermissionToPay &&
    (!task.paymentStatus || task.paymentStatus === 'unpaid') &&
    task?.rewards?.length > 0;

  const handlePaymentModal = () => {
    getTaskSubmissionsForTask({
      variables: {
        taskId: task?.id,
      },
    });
  };

  return (
    <ProposalCardWrapper
      onClick={(e) => !showPaymentModal && openModal(e)}
      onMouseEnter={() => canArchive && setDisplayActions(true)}
      onMouseLeave={() => canArchive && setDisplayActions(false)}
    >
      <SmartLink href={viewUrl} onNavigate={(url) => {
        location.push(url);
        windowOffset = window.scrollY;
        document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
      }}>
        {showPaymentModal && !isTaskSubmissionLoading ? (
          <MakePaymentModal
            getTaskSubmissionsForTask={getTaskSubmissionsForTask}
            open={showPaymentModal}
            approvedSubmission={approvedSubmission}
            handleClose={() => {}}
            setShowPaymentModal={setShowPaymentModal}
            fetchedTask={task}
          />
        ) : null}
        <TaskHeader>
          <TaskHeaderIconWrapper>
            <SafeImage
              src={task?.orgProfilePicture}
              style={{
                width: '29px',
                height: '28px',
                borderRadius: '4px',
                marginRight: '8px',
              }}
            />
            {isMilestone && <MilestoneIcon />}
            <AvatarList users={userList} id={'task-' + task?.id} />
            {isSubtask && <SubtaskLightIcon stroke="white" />}
            {!isSubtask && !isMilestone && totalSubtask > 0 && (
              <CheckedIconWrapper>
                {' '}
                <CheckedBoxIcon stroke="white" pathFill="none" />
              </CheckedIconWrapper>
            )}

            {task?.privacyLevel === Constants.PRIVACY_LEVEL.public && (
              <PodWrapper
                style={{
                  marginTop: '0',
                }}
              >
                <PodName
                  style={{
                    borderRadius: '8px',
                    marginLeft: '4px',
                  }}
                >
                  Public
                </PodName>
              </PodWrapper>
            )}
          </TaskHeaderIconWrapper>
          {rewards && rewards?.length > 0 && <Compensation rewards={rewards} taskIcon={<TaskIcon />} />}
        </TaskHeader>
        <TaskCreatedBy type={type} router={router} createdBy={createdBy} />
        {(isMilestone || isBounty) && <TaskDivider />}

        <TaskContent>
          <TaskTitle>
            <Link href={viewUrl}>{task.title}</Link>
          </TaskTitle>
          {/* <TaskCardDescriptionText>
          {renderMentionString({
            content: description,
            router,
          })}
        </TaskCardDescriptionText> */}
          <TaskContentFooter>
            {task?.podName && (
              <PodWrapper
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPod(task?.podId);
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
                <PodName>{task?.podName}</PodName>
              </PodWrapper>
            )}
          </TaskContentFooter>
          {isBounty && (
            <TaskBountyOverview
              totalSubmissionsCount={task?.totalSubmissionsCount}
              approvedSubmissionsCount={task?.approvedSubmissionsCount}
            />
          )}
          {isMilestone && (
            <MilestoneProgressWrapper>
              <MilestoneProgress milestoneId={id} />
            </MilestoneProgressWrapper>
          )}
          {coverMedia ? (
            <BoardsCardMedia>
              <SafeImage
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                src={coverMedia.slug}
              />
            </BoardsCardMedia>
          ) : null}
        </TaskContent>
        <BoardsCardFooter style={{ paddingBottom: '0' }}>
          {!assigneeId && !isBounty && !isMilestone && (
            <>
              {claimed ? (
                <ActionButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  Claimed
                </ActionButton>
              ) : (
                <ActionButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateTaskAssignee({
                      variables: {
                        taskId: id,
                        assigneeId: user?.id,
                      },
                      onCompleted: (data) => {
                        setClaimed(true);
                        const task = data?.updateTaskAssignee;
                        const transformedTask = transformTaskToTaskCard(task, {});
                        if (boardColumns?.setColumns) {
                          let columns = [...boardColumns?.columns];
                          if (transformedTask.status === Constants.TASK_STATUS_IN_PROGRESS) {
                            columns = updateInProgressTask(transformedTask, columns);
                          } else if (transformedTask.status === Constants.TASK_STATUS_TODO) {
                            columns = updateTaskItem(transformedTask, columns);
                          }
                          boardColumns.setColumns(columns);
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
                </ActionButton>
              )}
            </>
          )}
          {!isBounty && !isMilestone && task?.status === Constants.TASK_STATUS_IN_REVIEW && (
            <ActionButton onClick={openModal}>Review</ActionButton>
          )}
          {displayPayButton && (
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                handlePaymentModal();
              }}
            >
              Pay
            </ActionButton>
          )}
          {!isMilestone && (
            <TaskAction key={'task-comment-' + id}>
              <TaskCommentIcon />
              <TaskActionAmount>{commentCount}</TaskActionAmount>
            </TaskAction>
          )}
          {!isSubtask && !isMilestone && totalSubtask > 0 && (
            <SubtaskCountWrapper>
              <SubtaskLightIcon fill="none" stroke={Grey57} />
              <SubtaskCount>{totalSubtask}</SubtaskCount>
            </SubtaskCountWrapper>
          )}
          {canArchive && displayActions && (
            <TaskActionMenu right="true">
              <DropDown DropdownHandler={TaskMenuIcon}>
                <DropDownItem
                  key={'task-menu-edit-' + id}
                  onClick={() => {
                    setEditTask(true);
                  }}
                  color={White}
                >
                  Edit {type}
                </DropDownItem>
                <DropDownItem
                  key={'task-menu-edit-' + id}
                  onClick={() => {
                    setArchiveTask(true);
                  }}
                  color={White}
                >
                  Archive {type}
                </DropDownItem>
                {canDelete && (
                  <DropDownItem
                    key={'task-menu-delete-' + id}
                    onClick={() => {
                      setDeleteTask(true);
                    }}
                    color={Red800}
                  >
                    Delete {type}
                  </DropDownItem>
                )}
              </DropDown>
            </TaskActionMenu>
          )}
        </BoardsCardFooter>
      </SmartLink>
    </ProposalCardWrapper>
  );
};

const STATUS_ICONS = {
  [Constants.STATUS_APPROVED]: Approved,
  [Constants.STATUS_CHANGE_REQUESTED]: Rejected,
};

export function ProposalCard({ openModal, title, description, task, goToPod, proposalRequestChange }) {
  const router = useRouter();
  const coverMedia = task?.media?.find((media) => media.type === 'image');

  const proposalStatus = getProposalStatus(task);
  const PROPOSAL_STATUS_MAP = {
    [Constants.STATUS_APPROVED]: {
      labelsAndActions: [
        {
          title: 'Approved',
          borderColor: Green800,
          color: Green800,
        },
      ],
    },
    [Constants.STATUS_OPEN]: {
      labelsAndActions: [
        {
          title: 'Reject',
          action: () => {
            if (proposalRequestChange) {
              proposalRequestChange(task.id, proposalStatus);
            }
          },
        },
      ],
    },
    [Constants.STATUS_CHANGE_REQUESTED]: {
      labelsAndActions: [
        {
          title: 'Rejected',
          borderColor: Red300,
          color: Red300,
        },
      ],
    },
  };
  const labelsAndActions = PROPOSAL_STATUS_MAP[proposalStatus]?.labelsAndActions;
  const HeaderIcon = STATUS_ICONS[proposalStatus];
  return (
    <ProposalCardWrapper onClick={openModal}>
      <BoardsCardHeader>
        <BoardsCardSubheader>
          <ProposalCardIcon />
          <ProposalCardType>Proposal</ProposalCardType>
          <BoardsPrivacyLabel>{task?.privacyLevel === PRIVACY_LEVEL.public ? 'Public' : 'Members'}</BoardsPrivacyLabel>
        </BoardsCardSubheader>
        {HeaderIcon ? <HeaderIcon /> : null}
      </BoardsCardHeader>
      <BoardsCardBody>
        <BoardsCardBodyTitle>{title}</BoardsCardBodyTitle>
        <BoardsCardBodyDescription>
          {renderMentionString({
            content: description,
            router,
          })}
        </BoardsCardBodyDescription>
        {coverMedia ? (
          <BoardsCardMedia>
            <SafeImage
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              src={coverMedia.slug}
            />
          </BoardsCardMedia>
        ) : null}
        {task?.podName && (
          <PodWrapper
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPod(task?.podId);
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
            <PodName>{task?.podName}</PodName>
          </PodWrapper>
        )}
      </BoardsCardBody>
      <BoardsCardFooter style={{ paddingBottom: '7px' }}>
        {labelsAndActions?.map((label, idx) => (
          <ProposalFooterButton
            isAction={!!label.action}
            onClick={(e) => {
              e.stopPropagation();
              label.action && label.action();
            }}
            borderColor={label?.borderColor}
            key={idx}
            color={label?.color}
          >
            {label?.title}
          </ProposalFooterButton>
        ))}
      </BoardsCardFooter>
    </ProposalCardWrapper>
  );
}
export default function Card(props) {
  const { task } = props;
  return task.isProposal ? <ProposalCard {...props} /> : <TaskCard {...props} />;
}
