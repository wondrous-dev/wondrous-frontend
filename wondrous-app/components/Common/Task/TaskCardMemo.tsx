import { memo } from 'react';
import { format } from 'date-fns';

import { transformTaskToTaskCard } from 'utils/helpers';
import palette from 'theme/palette';
import { updateInProgressTask, updateTaskItem } from 'utils/board';
import * as Constants from 'utils/constants';
import { BoardsCardMedia, BoardsCardFooter } from 'components/Common/Boards/styles';
import { PRIVACY_LEVEL } from 'utils/constants';
import { MakePaymentModal } from 'components/Common/Payment/PaymentModal';
import SmartLink from 'components/Common/SmartLink';
import Tooltip from 'components/Tooltip';
import { DAOIcon } from 'components/Icons/dao';
import { TaskApplicationButton } from 'components/Common/TaskApplication';
import { ButtonPrimary } from '../button';
import {
  ProposalCardWrapper,
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
import { AvatarList } from '../AvatarList';
import { SafeImage } from '../Image';
import { TaskBountyOverview } from '../TaskBountyOverview';
import { Claim } from '../../Icons/claimTask';
import { Compensation } from '../Compensation';
import { SubtaskLightIcon } from '../../Icons/subtask';
import PodIcon from '../../Icons/podIcon';
import { MilestoneProgress } from '../MilestoneProgress';
import { TaskCreatedBy } from '../TaskCreatedBy';
import { ToggleBoardPrivacyIcon } from '../PrivateBoardIcon';
import MilestoneIcon from '../../Icons/milestone';
import { DropDown, DropDownItem } from '../dropdown';
import { TaskMenuIcon } from '../../Icons/taskMenu';
import { TaskCommentIcon } from '../../Icons/taskComment';
import TASK_ICONS from './constants';

function TaskCardMemo({
  approvedSubmission,
  boardColumns,
  canApply,
  canArchive,
  canClaim,
  canDelete,
  claimed,
  commentCount,
  coverMedia,
  createdBy,
  displayActions,
  displayPayButton,
  getTaskSubmissionsForTask,
  goToPod,
  handlePaymentModal,
  id,
  isBounty,
  isMilestone,
  isPod,
  isSubtask,
  isTaskSubmissionLoading,
  isUser,
  onNavigate,
  rewards,
  router,
  setArchiveTask,
  setClaimed,
  setDeleteTask,
  setDisplayActions,
  setEditTask,
  setIsApplicationModalOpen,
  setShowPaymentModal,
  showPaymentModal,
  task,
  totalSubtask,
  type,
  updateTaskAssignee,
  user,
  userList,
  userProfile,
  viewUrl,
}) {
  const TaskIcon = TASK_ICONS[task.status];

  return (
    <ProposalCardWrapper
      onMouseEnter={() => canArchive && setDisplayActions(true)}
      onMouseLeave={() => canArchive && setDisplayActions(false)}
      wrapped
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
          </TaskHeaderIconWrapper>
          {task?.privacyLevel !== PRIVACY_LEVEL.public && (
            <ToggleBoardPrivacyIcon
              style={{
                width: '29px',
                height: '29px',
                marginRight: '0',
                marginLeft: '8px',
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
                      key={`task-menu-edit-edit-${id}`}
                      onClick={() => {
                        setEditTask(true);
                      }}
                      color={palette.white}
                    >
                      Edit {type}
                    </DropDownItem>
                    <DropDownItem
                      key={`task-menu-edit-archive${id}`}
                      onClick={() => {
                        setArchiveTask(true);
                      }}
                      color={palette.white}
                    >
                      Archive {type}
                    </DropDownItem>

                    {canDelete && (
                      <DropDownItem
                        key={`task-menu-delete-${id}`}
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
}

TaskCardMemo.displayName = 'TaskCardMemo';

export default memo(TaskCardMemo, (prevProps, nextProps) => {
  const areEqual =
    prevProps.approvedSubmission === nextProps.approvedSubmission &&
    prevProps.boardColumns === nextProps.boardColumns &&
    prevProps.canApply === nextProps.canApply &&
    prevProps.canArchive === nextProps.canArchive &&
    prevProps.canClaim === nextProps.canClaim &&
    prevProps.canDelete === nextProps.canDelete &&
    prevProps.claimed === nextProps.claimed &&
    prevProps.commentCount === nextProps.commentCount &&
    prevProps.coverMedia === nextProps.coverMedia &&
    prevProps.createdBy === nextProps.createdBy &&
    prevProps.displayActions === nextProps.displayActions &&
    prevProps.displayPayButton === nextProps.displayPayButton &&
    prevProps.id === nextProps.id &&
    prevProps.isBounty === nextProps.isBounty &&
    prevProps.isMilestone === nextProps.isMilestone &&
    prevProps.isPod === nextProps.isPod &&
    prevProps.isSubtask === nextProps.isSubtask &&
    prevProps.isTaskSubmissionLoading === nextProps.isTaskSubmissionLoading &&
    prevProps.isUser === nextProps.isUser &&
    prevProps.rewards === nextProps.rewards &&
    prevProps.router === nextProps.router &&
    prevProps.showPaymentModal === nextProps.showPaymentModal &&
    prevProps.task === nextProps.task &&
    prevProps.totalSubtask === nextProps.totalSubtask &&
    prevProps.type === nextProps.type &&
    prevProps.user === nextProps.user &&
    prevProps.userList === nextProps.userList &&
    prevProps.userProfile === nextProps.userProfile &&
    prevProps.viewUrl === nextProps.viewUrl;

  return areEqual;
});
