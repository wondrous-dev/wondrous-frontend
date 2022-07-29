import { useState, useRef } from 'react';
import { format } from 'date-fns';

import { TaskCommentIcon } from '../../Icons/taskComment';
import { TaskMenuIcon } from '../../Icons/taskMenu';
import { DropDown, DropDownItem } from '../dropdown';
import MilestoneIcon from '../../Icons/milestone';
import {
  TaskHeader,
  TaskContent,
  TaskTitle,
  TaskAction,
  TaskActionAmount,
  TaskActionMenu,
  PodWrapper,
  PodName,
  MilestoneProgressWrapper,
  TaskHeaderIconWrapper,
  SubtaskCountWrapper,
  SubtaskCount,
  ActionButton,
  DueDateText,
} from './styles';
import { transformTaskToTaskCard } from 'utils/helpers';
import palette from 'theme/palette';
import { TaskCreatedBy } from '../TaskCreatedBy';
import { MilestoneProgress } from '../MilestoneProgress';
import PodIcon from '../../Icons/podIcon';
import { SubtaskLightIcon } from '../../Icons/subtask';
import { Compensation } from '../Compensation';
import { Claim } from '../../Icons/claimTask';
import { updateInProgressTask, updateTaskItem, getProposalStatus } from 'utils/board';
import { TaskBountyOverview } from '../TaskBountyOverview';
import { SafeImage } from '../Image';
import * as Constants from 'utils/constants';
import { AvatarList } from '../AvatarList';
import { useRouter } from 'next/router';
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
import { useColumns, useUserProfile } from 'utils/hooks';
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
import { MakePaymentModal } from 'components/Common/Payment/PaymentModal';
import { GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { useLazyQuery, useQuery } from '@apollo/client';
import { parseUserPermissionContext } from 'utils/helpers';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { PERMISSIONS } from 'utils/constants';
import SmartLink from 'components/Common/SmartLink';
import { useLocation } from 'utils/useLocation';
import { ToggleBoardPrivacyIcon } from '../PrivateBoardIcon';
import Tooltip from 'components/Tooltip';
import { RichTextViewer } from 'components/RichText';
import { DAOIcon } from 'components/Icons/dao';
import { TaskApplicationButton } from 'components/Common/TaskApplication';

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

let windowOffset = 0;

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
  boardType,
}) => {
  const location = useLocation();
  let TaskIcon = TASK_ICONS[task.status];
  const ref = useRef(null);
  const boardColumns = useColumns();
  const [claimed, setClaimed] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const totalSubtask = task?.totalSubtaskCount;
  const [displayActions, setDisplayActions] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isTaskSubmissionLoading, setTaskSubmissionLoading] = useState(false);
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const coverMedia = task?.media?.find((media) => media.type === 'image');
  const userProfile = useUserProfile();

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
  const isUser = boardType === Constants.BOARD_TYPE.assignee;
  const isPod = boardType === Constants.BOARD_TYPE.pod;

  const canClaim =
    task?.taskApplicationPermissions?.canClaim &&
    !assigneeId &&
    !isBounty &&
    !isMilestone &&
    task?.status !== Constants.TASK_STATUS_DONE;
  const canApply = !canClaim && task?.taskApplicationPermissions?.canApply;

  const onNavigate = (e) => {
    //TODO refactor this
    if (!showPaymentModal && !isApplicationModalOpen) {
      location.push(viewUrl);
      windowOffset = window.scrollY;
      document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
    }
  };

  return (
    <ProposalCardWrapper
      onMouseEnter={() => canArchive && setDisplayActions(true)}
      onMouseLeave={() => canArchive && setDisplayActions(false)}
      ref={ref}
    >
      <SmartLink href={viewUrl} preventLinkNavigation onNavigate={onNavigate}>
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
            {(isUser || userProfile) &&
              (task?.orgProfilePicture ? (
                <SafeImage
                  useNextImage={false}
                  src={task?.orgProfilePicture}
                  style={{
                    width: '29px',
                    height: '28px',
                    borderRadius: '4px',
                    marginRight: '8px',
                  }}
                />
              ) : (
                <DAOIcon />
              ))}
            {canClaim ? (
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
                    style={{
                      marginRight: '8px',
                    }}
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
            ) : (
              <>
                {canApply && (
                  <TaskApplicationButton
                    setIsApplicationModalOpen={setIsApplicationModalOpen}
                    task={task}
                    canApply={canApply}
                  />
                )}
              </>
            )}

            {displayPayButton && !userProfile && (
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaymentModal();
                }}
              >
                Pay
              </ActionButton>
            )}
            {isMilestone && <MilestoneIcon />}
            {!userProfile && <AvatarList users={userList} id={'task-' + task?.id} />}
          </TaskHeaderIconWrapper>
          {task?.privacyLevel === PRIVACY_LEVEL.public && (
            <ToggleBoardPrivacyIcon
              style={{
                width: '29px',
                height: '29px',
                marginRight: '0',
              }}
              isPrivate={task?.privacyLevel !== PRIVACY_LEVEL.public}
              tooltipTitle={task?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}
            />
          )}

          <div
            style={{
              flex: 1,
            }}
          />
          {task?.dueDate && <DueDateText>{format(new Date(task?.dueDate), 'MMM d')}</DueDateText>}
          {rewards && rewards?.length > 0 && (
            <Compensation
              style={{
                flexGrow: '0',
                marginLeft: '8px',
                alignSelf: 'center',
              }}
              rewards={rewards}
              taskIcon={<TaskIcon />}
            />
          )}
        </TaskHeader>
        <TaskCreatedBy type={type} router={router} createdBy={createdBy} />

        <TaskContent>
          <TaskTitle>
            <a href={viewUrl}>{task.title}</a>
          </TaskTitle>

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
                width={270}
                objectFit="cover"
                objectPosition="center"
                height="100%"
                layout="responsive"
                src={coverMedia.slug}
                useNextImage
              />
            </BoardsCardMedia>
          ) : null}
        </TaskContent>
        <BoardsCardFooter style={{ paddingBottom: '0' }}>
          {task?.podName && !isPod && (
            <PodWrapper
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPod(task?.podId);
              }}
              style={{
                marginTop: '0',
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
              <PodName
                style={{
                  whiteSpace: 'nowrap',
                  maxWidth: '155px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {task?.podName}
              </PodName>
            </PodWrapper>
          )}
          {isSubtask && (
            <Tooltip title="Subtask" placement="top">
              <div>
                <SubtaskLightIcon stroke="white" />
              </div>
            </Tooltip>
          )}

          <div
            style={{
              flex: 1,
            }}
          />
          {!isMilestone && commentCount > 0 && (
            <Tooltip title="View comments" placement="top">
              <TaskAction
                key={'task-comment-' + id}
                style={{
                  marginRight: !isSubtask && !isMilestone && totalSubtask > 0 ? '0' : '18px',
                }}
              >
                <TaskCommentIcon />
                <TaskActionAmount>{commentCount}</TaskActionAmount>
              </TaskAction>
            </Tooltip>
          )}
          {!isSubtask && !isMilestone && totalSubtask > 0 && (
            <Tooltip title="Subtasks" placement="top">
              <SubtaskCountWrapper
                style={{
                  marginRight: '12px',
                  paddingLeft: '0',
                }}
              >
                <SubtaskLightIcon fill="none" stroke={palette.grey57} />
                <SubtaskCount>{totalSubtask}</SubtaskCount>
              </SubtaskCountWrapper>
            </Tooltip>
          )}
          {canArchive && (
            <TaskActionMenu
              right="true"
              style={{
                flexGrow: '0',
                position: 'absolute',
                right: '4px',
                visibility: displayActions ? 'visible' : 'hidden',
              }}
            >
              <Tooltip title="More actions" placement="top">
                <div>
                  <DropDown
                    DropdownHandler={TaskMenuIcon}
                    divStyle={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <DropDownItem
                      key={'task-menu-edit-edit-' + id}
                      onClick={() => {
                        setEditTask(true);
                      }}
                      color={palette.white}
                    >
                      Edit {type}
                    </DropDownItem>
                    <DropDownItem
                      key={'task-menu-edit-archive' + id}
                      onClick={() => {
                        setArchiveTask(true);
                      }}
                      color={palette.white}
                    >
                      Archive {type}
                    </DropDownItem>

                    {canDelete && (
                      <DropDownItem
                        key={'task-menu-delete-' + id}
                        onClick={() => {
                          setDeleteTask(true);
                        }}
                        color={palette.red800}
                      >
                        Delete {type}
                      </DropDownItem>
                    )}
                  </DropDown>
                </div>
              </Tooltip>
            </TaskActionMenu>
          )}
        </BoardsCardFooter>
      </SmartLink>
    </ProposalCardWrapper>
  );
};

const STATUS_ICONS = {
  [Constants.STATUS_APPROVED]: Approved,
  [Constants.STATUS_CLOSED]: Rejected,
};

export function ProposalCard({ openModal, title, description, task, goToPod, proposalRequestChange, viewUrl }) {
  const router = useRouter();
  const coverMedia = task?.media?.find((media) => media.type === 'image');

  const proposalStatus = getProposalStatus(task);
  const PROPOSAL_STATUS_MAP = {
    [Constants.STATUS_APPROVED]: {
      labelsAndActions: [
        {
          title: 'Approved',
          borderColor: palette.green800,
          color: palette.green800,
        },
      ],
    },
    // [Constants.STATUS_OPEN]: {
    //   labelsAndActions: [
    //     {
    //       title: 'Reject',
    //       action: () => {
    //         if (proposalRequestChange) {
    //           proposalRequestChange(task.id, proposalStatus);
    //         }
    //       },
    //     },
    //   ],
    // },
    [Constants.STATUS_CLOSED]: {
      labelsAndActions: [
        {
          title: 'Rejected',
          borderColor: palette.red300,
          color: palette.red300,
        },
      ],
    },
  };
  const labelsAndActions = PROPOSAL_STATUS_MAP[proposalStatus]?.labelsAndActions;
  const HeaderIcon = STATUS_ICONS[proposalStatus];
  const location = useLocation();
  return (
    <SmartLink
      href={viewUrl}
      preventLinkNavigation
      onNavigate={() => {
        location.push(viewUrl);
        windowOffset = window.scrollY;
        document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
      }}
    >
      <ProposalCardWrapper>
        <BoardsCardHeader>
          <BoardsCardSubheader>
            <ProposalCardIcon />
            <ProposalCardType>Proposal</ProposalCardType>
            <BoardsPrivacyLabel>
              {task?.privacyLevel === PRIVACY_LEVEL.public ? 'Public' : 'Members'}
            </BoardsPrivacyLabel>
          </BoardsCardSubheader>
          {HeaderIcon ? <HeaderIcon /> : null}
        </BoardsCardHeader>
        <BoardsCardBody>
          <BoardsCardBodyTitle>{title}</BoardsCardBodyTitle>
          <BoardsCardBodyDescription>
            <RichTextViewer text={description} />
          </BoardsCardBodyDescription>
          {coverMedia ? (
            <BoardsCardMedia>
              <SafeImage
                useNextImage={false}
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
              <PodName style={{}}>{task?.podName}</PodName>
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
    </SmartLink>
  );
}
export default function Card(props) {
  const { task } = props;
  return task.isProposal ? <ProposalCard {...props} /> : <TaskCard {...props} />;
}
