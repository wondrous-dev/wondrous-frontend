import { useState } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';

import { useBoards, useColumns, useTaskActions, useUserProfile } from 'utils/hooks';
import { GET_TASK_SUBMISSIONS_FOR_TASK, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { DUPLICATE_TASK } from 'graphql/mutations';
import { parseUserPermissionContext, transformTaskToTaskCard } from 'utils/helpers';
import * as Constants from 'utils/constants';
import { updateInProgressTask, updateTaskItem } from 'utils/board';
import palette from 'theme/palette';

import { hasGR15DEIIntiative } from 'components/Common/TaskViewModal/utils';
import SmartLink from 'components/Common/SmartLink';
import { MakePaymentModal } from 'components/Common/Payment/PaymentModal';
import { SafeImage } from 'components/Common/Image';
import { DAOIcon } from 'components/Icons/dao';
import { ButtonPrimary } from 'components/Common/button';
import { Claim } from 'components/Icons/claimTask';
import { TaskApplicationButton } from 'components/Common/TaskApplication';
import MilestoneIcon from 'components/Icons/milestone';
import { AvatarList } from 'components/Common/AvatarList';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import TaskCardPrivacy from 'components/Common/TaskCardPrivacy';
import TaskCardDate from 'components/Common/TaskCardDate';
import Compensation from 'components/Common/Compensation';
import { TaskCreatedBy } from 'components/Common/TaskCreatedBy';
import { TaskBountyOverview } from 'components/Common/TaskBountyOverview';
import { MilestoneProgress } from 'components/Common/MilestoneProgress';
import { BoardsCardFooter, BoardsCardMedia } from 'components/Common/Boards/styles';
import PodIconName from 'components/Common/PodIconName';
import Tooltip from 'components/Tooltip';
import { SubtaskLightIcon } from 'components/Icons/subtask';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import TaskCardMenu from 'components/Common/TaskCardMenu';

import TASK_ICONS from './constants';
import {
  ActionButton,
  CardContent,
  MilestoneProgressWrapper,
  SubtaskCount,
  SubtaskCountWrapper,
  TaskAction,
  TaskActionAmount,
  TaskContent,
  TaskHeader,
  TaskHeaderIconWrapper,
  TaskTitle,
} from './styles';

export default function TaskCard({
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
  const TaskIcon = TASK_ICONS[task.status];
  const boardColumns = useColumns();
  const { openTaskViewModal } = useTaskActions();
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
    permissions.includes(Constants.PERMISSIONS.APPROVE_PAYMENT) ||
    permissions.includes(Constants.PERMISSIONS.FULL_ACCESS);
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
      openTaskViewModal(task);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <SmartLink href={viewUrl} preventLinkNavigation onNavigate={onNavigate}>
      <CardContent
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => {
          setShowMenu(false);
          setAnchorEl(null);
        }}
        data-cy={`task-card-item-${title}`}
      >
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
      </CardContent>
    </SmartLink>
  );
}
