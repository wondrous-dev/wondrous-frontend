import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { transformTaskToTaskCard, parseUserPermissionContext } from 'utils/helpers';
import palette from 'theme/palette';
import { updateInProgressTask, updateTaskItem, getProposalStatus } from 'utils/board';
import * as Constants from 'utils/constants';
import { useRouter } from 'next/router';
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
import { PRIVACY_LEVEL, PERMISSIONS } from 'utils/constants';
import { MakePaymentModal } from 'components/Common/Payment/PaymentModal';
import { GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { DUPLICATE_TASK } from 'graphql/mutations/task';
import SmartLink from 'components/Common/SmartLink';
import { useLocation } from 'utils/useLocation';
import Tooltip from 'components/Tooltip';
import { RichTextViewer } from 'components/RichText';
import { DAOIcon } from 'components/Icons/dao';
import { TaskApplicationButton } from 'components/Common/TaskApplication';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import TaskPriority from 'components/Common/TaskPriority';
import Compensation from 'components/Common/Compensation';
import TaskCardMenu from 'components/Common/TaskCardMenu';
import TaskCardPrivacy from 'components/Common/TaskCardPrivacy';
import TaskCardDate from 'components/Common/TaskCardDate';
import PodIconName from 'components/Common/PodIconName';
import {
  ProposalCardWrapper,
  ProposalCardType,
  ProposalCardIcon,
  ProposalFooterButton,
  TaskHeader,
  TaskContent,
  TaskTitle,
  TaskAction,
  TaskActionAmount,
  PodName,
  MilestoneProgressWrapper,
  TaskHeaderIconWrapper,
  SubtaskCountWrapper,
  SubtaskCount,
  ActionButton,
  DueDateText,
} from './styles';
import { Archived } from '../../Icons/sections';
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
import { AvatarList } from '../AvatarList';
import { SafeImage } from '../Image';
import { TaskBountyOverview } from '../TaskBountyOverview';
import { Claim } from '../../Icons/claimTask';
import { SubtaskLightIcon } from '../../Icons/subtask';
import PodIcon from '../../Icons/podIcon';
import { MilestoneProgress } from '../MilestoneProgress';
import { TaskCreatedBy } from '../TaskCreatedBy';
import MilestoneIcon from '../../Icons/milestone';
import { TaskCommentIcon } from '../../Icons/taskComment';
import { ButtonPrimary } from '../button';
import TASK_ICONS from './constants';
import { hasGR15DEIIntiative } from '../TaskViewModal/utils';

let windowOffset = 0;

export function TaskCard({
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
}) {
  const location = useLocation();
  const TaskIcon = TASK_ICONS[task.status];
  const boardColumns = useColumns();
  const [claimed, setClaimed] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  const totalSubtask = task?.totalSubtaskCount;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isTaskSubmissionLoading, setTaskSubmissionLoading] = useState(false);
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const coverMedia = task?.media?.find((media) => media.type === 'image');
  const userProfile = useUserProfile();

  const router = useRouter();
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const [duplicateTask, { loading }] = useMutation(DUPLICATE_TASK, {
    refetchQueries: () => [
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getSubtaskCountForTask',
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
    ],
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

  // refactor this. move this logic in a separate hook
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

  const hasGR15 = hasGR15DEIIntiative(task?.categories);
  const onNavigate = (e) => {
    // TODO refactor this
    if (!showPaymentModal && !isApplicationModalOpen) {
      location.push(viewUrl);
      windowOffset = window.scrollY;
      document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <ProposalCardWrapper
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => {
        setShowMenu(false);
        setAnchorEl(null);
      }}
      data-cy={`task-card-item-${title}`}
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
                  alt="Organization logo"
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
                  <ButtonPrimary
                    startIcon={<Claim />}
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
                    data-cy={`task-card-item-${title}`}
                  >
                    Claim
                  </ButtonPrimary>
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
            {!userProfile && <AvatarList users={userList} id={`task-${task?.id}`} />}
            {hasGR15 && (
              <>
                <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
                <GR15DEILogo width="28" height="28" onClick={() => setOpenGR15Modal(true)} />
              </>
            )}
            <TaskCardPrivacy privacyLevel={task?.privacyLevel} />
          </TaskHeaderIconWrapper>
          <Grid container width="fit-content" flexGrow="1" justifyContent="flex-end" gap="6px">
            <TaskCardDate date={task?.dueDate} />
            {task?.rewards && task?.rewards?.length > 0 && <Compensation rewards={task?.rewards} />}
          </Grid>
        </TaskHeader>
        <TaskCreatedBy type={type} router={router} createdBy={createdBy} />

        <TaskContent>
          <TaskTitle>
            <a href={viewUrl} data-cy={`task-card-item-${title}-link`}>
              {task.title}
            </a>
          </TaskTitle>

          {/* {task?.priority && (
            <Box
              sx={{
                margin: '14px 0',
              }}
            >
              <TaskPriority value={task?.priority} />
            </Box>
          )}
 */}
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
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  width: '100%',
                  height: 'auto',
                  maxHeight: '104px',
                }}
                width={270}
                height={104}
                src={coverMedia.slug}
                useNextImage
                alt="Task cover"
              />
            </BoardsCardMedia>
          ) : null}
        </TaskContent>
        <BoardsCardFooter style={{ paddingBottom: '0' }}>
          {task?.podName && !isPod && (
            <PodIconName
              color={task?.podColor}
              name={task?.podName}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPod(task?.podId);
              }}
            />
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
                key={`task-comment-${id}`}
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
          <TaskCardMenu
            anchorElParent={anchorEl}
            canArchive={canArchive}
            canEdit={canArchive}
            canDelete={canDelete}
            setAnchorElParent={setAnchorEl}
            setArchiveTask={setArchiveTask}
            setDeleteTask={setDeleteTask}
            setEditTask={setEditTask}
            setDuplicate={() => {
              duplicateTask({
                variables: {
                  taskId: id,
                },
              });
            }}
            taskType={task?.type}
            open={showMenu}
          />
        </BoardsCardFooter>
      </SmartLink>
    </ProposalCardWrapper>
  );
}

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
          <Box>
            <TaskPriority value={task?.priority} />
          </Box>
          <BoardsCardBodyDescription as="div">
            <RichTextViewer text={description} />
          </BoardsCardBodyDescription>
          {coverMedia ? (
            <BoardsCardMedia>
              <SafeImage
                useNextImage={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                src={coverMedia.slug}
                alt="Task cover"
              />
            </BoardsCardMedia>
          ) : null}
          {task?.podName && (
            <PodIconName
              name={task?.podName}
              color={task?.podColor}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPod(task?.podId);
              }}
            />
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
