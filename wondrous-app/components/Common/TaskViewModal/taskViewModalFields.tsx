import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { useRouter } from 'next/router';
import { transformTaskProposalToTaskProposalCard, transformTaskToTaskCard } from 'utils/helpers';
import { TASK_STATUS_DONE, TASK_STATUS_IN_PROGRESS, TASK_STATUS_IN_REVIEW, TASK_STATUS_TODO } from 'utils/constants';
import { Claim } from 'components/Icons/claimTask';
import TaskApplicationButton from 'components/Common/TaskApplication/TaskApplicationButton';
import Image from 'next/image';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK_ASSIGNEE, REMOVE_TASK_ASSIGNEE, UPDATE_TASK_PROPOSAL_ASSIGNEE } from 'graphql/mutations';
import Box from '@mui/material/Box';
import isEmpty from 'lodash/isEmpty';
import { format } from 'date-fns';
import Tooltip from 'components/Tooltip';
import { useHotkeys } from 'react-hotkeys-hook';
import { Badge } from '@mui/material';
import { useHotkey } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { TaskSectionLabel, TaskSectionImageContent } from './helpers';
import {
  TaskSectionDisplayDiv,
  TaskSectionDisplayContentWrapper,
  TaskSectionInfoTextUnderlined,
  TaskSectionInfoText,
  TaskSectionInfoDiv,
  TaskSectionInfoClose,
  TaskSectionInfoTakeTask,
  TaskSectionInfoTakeTaskText,
  ActionButton,
  TaskSectionInfoRecurringIcon,
  TaskSectionInfoCalendar,
  InfoPoint,
  TaskSectionInfoPoints,
  TaskSectionInfoPointsIcon,
  TaskSectionInfoTextMilestone,
  TaskSectionInfoMilestoneIcon,
  TaskSectionTagWrapper,
  Tag,
} from './styles';
import RecurringIcon from '../../../public/images/icons/recurring.svg';

export function ReviewerField({ reviewerData, handleClose, shouldDisplay }) {
  const router = useRouter();

  if (!shouldDisplay) {
    return null;
  }
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Reviewer</TaskSectionLabel>
      <TaskSectionDisplayContentWrapper>
        {reviewerData?.getTaskReviewers?.length > 0 ? (
          (reviewerData?.getTaskReviewers).map((taskReviewer) => (
            <TaskSectionImageContent
              key={taskReviewer.id}
              hasContent={taskReviewer.id}
              imgSrc={taskReviewer?.profilePicture}
              DefaultImageComponent={() => <DefaultUserImage />}
              ContentComponent={() => (
                <TaskSectionInfoTextUnderlined>{taskReviewer?.username}</TaskSectionInfoTextUnderlined>
              )}
              onClick={() => {
                handleClose();
                router.push(`/profile/${taskReviewer?.username}/about`, undefined, {
                  shallow: true,
                });
              }}
            />
          ))
        ) : (
          <TaskSectionInfoText>None</TaskSectionInfoText>
        )}
      </TaskSectionDisplayContentWrapper>
    </TaskSectionDisplayDiv>
  );
}

export function AssigneeField({
  fetchedTask,
  canEdit,
  setFetchedTask,
  updateInReviewItem,
  boardColumns,
  handleClose,
  user,
  canClaim,
  isTaskProposal,
  updateProposalItem,
  updateInProgressTask,
  updateTaskItem,
  updateCompletedItem,
  canApply,
  shouldDisplay,
  orgId,
  podId,
  userId,
}) {
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  const [removeTaskAssignee] = useMutation(REMOVE_TASK_ASSIGNEE);
  const [updateTaskProposalAssignee] = useMutation(UPDATE_TASK_PROPOSAL_ASSIGNEE);
  const showBadge = useHotkey();
  const router = useRouter();

  const onCorrectPage = fetchedTask?.orgId === orgId || fetchedTask?.podId === podId || fetchedTask?.userId === userId;

  // TODO: refactor this code
  const claimTask = () => {
    if (!user) {
      router.push('/signup', undefined, {
        shallow: true,
      });
    } else if (isTaskProposal) {
      updateTaskProposalAssignee({
        variables: {
          proposalId: fetchedTask?.id,
          assigneeId: user?.id,
        },
        onCompleted: (data) => {
          const taskProposal = data?.updateTaskProposalAssignee;
          if (boardColumns?.setColumns && onCorrectPage) {
            const transformedTaskProposal = transformTaskProposalToTaskProposalCard(taskProposal, {});
            const columns = updateProposalItem(transformedTaskProposal, [...boardColumns?.columns]);
            boardColumns?.setColumns(columns);
          }
        },
      });
    } else {
      updateTaskAssignee({
        variables: {
          taskId: fetchedTask?.id,
          assigneeId: user?.id,
        },
        onCompleted: (data) => {
          const task = data?.updateTaskAssignee;
          const transformedTask = transformTaskToTaskCard(task, {});
          setFetchedTask(transformedTask);
          if (!boardColumns?.setColumns || !onCorrectPage) {
            return;
          }
          let columns = [...boardColumns?.columns];
          if (transformedTask.status === TASK_STATUS_IN_REVIEW) {
            columns = updateInReviewItem(transformedTask, columns);
          } else if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
            columns = updateInProgressTask(transformedTask, columns);
          } else if (transformedTask.status === TASK_STATUS_TODO) {
            columns = updateTaskItem(transformedTask, columns);
          } else if (transformedTask.status === TASK_STATUS_DONE) {
            columns = updateCompletedItem(transformedTask, columns);
          }
          boardColumns.setColumns(columns);
        },
      });
    }
  };

  useHotkeys(HOTKEYS.CLAIM_TASK, () => {
    claimTask();
  });
  if (!shouldDisplay) return null;

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Assignee</TaskSectionLabel>
      <TaskSectionInfoDiv key={fetchedTask?.assigneeUsername}>
        <TaskSectionImageContent
          hasContent={fetchedTask?.assigneeUsername}
          imgSrc={fetchedTask?.assigneeProfilePicture}
          DefaultImageComponent={() => <DefaultUserImage />}
          ContentComponent={() => (
            <>
              <TaskSectionInfoTextUnderlined>{fetchedTask?.assigneeUsername}</TaskSectionInfoTextUnderlined>
              {canEdit && (
                <TaskSectionInfoClose
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeTaskAssignee({
                      variables: {
                        taskId: fetchedTask?.id,
                      },
                      onCompleted: (data) => {
                        const task = data?.removeTaskAssignee;
                        const transformedTask = transformTaskToTaskCard(task, {});
                        setFetchedTask(transformedTask);
                        if (boardColumns?.setColumns && onCorrectPage) {
                          let columns = [...boardColumns?.columns];
                          if (transformedTask.status === TASK_STATUS_IN_REVIEW) {
                            columns = updateInReviewItem(transformedTask, columns);
                          } else if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
                            columns = updateInProgressTask(transformedTask, columns);
                          } else if (transformedTask.status === TASK_STATUS_TODO) {
                            columns = updateTaskItem(transformedTask, columns);
                          } else if (transformedTask.status === TASK_STATUS_DONE) {
                            columns = updateCompletedItem(transformedTask, columns);
                          }
                          boardColumns.setColumns(columns);
                        }
                      },
                    });
                  }}
                >
                  <Image src="/images/icons/close.svg" alt="close icon" width={8} height={8} />
                </TaskSectionInfoClose>
              )}
            </>
          )}
          onClick={() => {
            handleClose();
            router.push(`/profile/${fetchedTask?.assigneeUsername}/about`, undefined, {
              shallow: true,
            });
          }}
          DefaultContent={() => (
            <>
              {canClaim ? (
                <Badge badgeContent={HOTKEYS.CLAIM_TASK} color="primary" invisible={!showBadge}>
                  <TaskSectionInfoTakeTask
                    onClick={() => {
                      claimTask();
                    }}
                  >
                    <Claim />
                    <TaskSectionInfoTakeTaskText>Claim this task</TaskSectionInfoTakeTaskText>
                  </TaskSectionInfoTakeTask>
                </Badge>
              ) : (
                <>
                  {canApply ? (
                    <TaskApplicationButton task={fetchedTask} canApply={canApply} title="Apply to task" />
                  ) : (
                    <TaskSectionInfoText
                      style={{
                        marginLeft: '4px',
                        marginTop: '8px',
                      }}
                    >
                      None
                    </TaskSectionInfoText>
                  )}
                </>
              )}
            </>
          )}
        />
      </TaskSectionInfoDiv>
    </TaskSectionDisplayDiv>
  );
}

export function ApplicationField({ shouldDisplay, taskApplicationCount, handleReviewButton }) {
  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Applications</TaskSectionLabel>
      <Box display="flex" alignItems="center">
        <TaskSectionInfoText>
          <ActionButton type="button" onClick={handleReviewButton}>
            Review {taskApplicationCount?.getTaskApplicationsCount?.total} applications
          </ActionButton>
        </TaskSectionInfoText>
      </Box>
    </TaskSectionDisplayDiv>
  );
}

export function ProposerField({ shouldDisplay, creatorUsername, creatorProfilePicture, handleClose }) {
  const router = useRouter();
  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Proposer</TaskSectionLabel>
      <TaskSectionImageContent
        hasContent={creatorUsername}
        onClick={() => {
          handleClose();
          router.push(`/profile/${creatorUsername}/about`, undefined, {
            shallow: true,
          });
        }}
        ContentComponent={() => <TaskSectionInfoText>{creatorUsername}</TaskSectionInfoText>}
        imgSrc={creatorProfilePicture}
        DefaultImageComponent={() => <DefaultUserImage />}
        DefaultContent={() => <TaskSectionInfoText>None</TaskSectionInfoText>}
      />
    </TaskSectionDisplayDiv>
  );
}
export function VotesField({ shouldDisplay, totalVotes, hasContent }) {
  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Voted</TaskSectionLabel>
      <TaskSectionImageContent
        hasContent={hasContent}
        ContentComponent={() => <TaskSectionInfoText>{totalVotes} votes</TaskSectionInfoText>}
        DefaultContent={() => null}
      />
    </TaskSectionDisplayDiv>
  );
}

export function DueDateField({ shouldDisplay, dueDate, recurringSchema, shouldUnclaimOnDueDateExpiry }) {
  if (!shouldDisplay) return null;
  return (
    <div>
      <TaskSectionDisplayDiv>
        <TaskSectionLabel>Due Date</TaskSectionLabel>
        <TaskSectionImageContent
          hasContent={dueDate}
          ContentComponent={() => (
            <TaskSectionInfoText>
              {!isEmpty(recurringSchema) && (
                <Tooltip title="Recurring" placement="right">
                  <TaskSectionInfoRecurringIcon>
                    <RecurringIcon />
                  </TaskSectionInfoRecurringIcon>
                </Tooltip>
              )}
              {format(new Date(dueDate), 'MM/dd/yyyy')}
            </TaskSectionInfoText>
          )}
          DefaultContent={() => null}
          DefaultImageComponent={() => <TaskSectionInfoCalendar />}
        />
      </TaskSectionDisplayDiv>
      {shouldUnclaimOnDueDateExpiry && <InfoPoint>Assignee will be removed once the task is past due date</InfoPoint>}
    </div>
  );
}

export function PointsField({ shouldDisplay, points }) {
  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Points</TaskSectionLabel>
      <TaskSectionImageContent
        hasContent={points}
        ContentComponent={() => <TaskSectionInfoPoints>{points}</TaskSectionInfoPoints>}
        DefaultImageComponent={() => <TaskSectionInfoPointsIcon />}
      />
    </TaskSectionDisplayDiv>
  );
}

export function MilestoneField({ shouldDisplay, milestoneId, getTaskById, milestoneTitle }) {
  const router = useRouter();

  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Milestone</TaskSectionLabel>
      <TaskSectionImageContent
        hasContent={milestoneId}
        ContentComponent={() => (
          <TaskSectionInfoTextMilestone
            onClick={() => {
              if (milestoneId) {
                router.query.task = milestoneId;
                router.push(router);
                getTaskById({
                  variables: {
                    taskId: milestoneId,
                  },
                });
              }
            }}
          >
            {milestoneTitle}
          </TaskSectionInfoTextMilestone>
        )}
        DefaultImageComponent={() => <TaskSectionInfoMilestoneIcon />}
      />
    </TaskSectionDisplayDiv>
  );
}

export function TagsField({ shouldDisplay, labels }) {
  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Tags</TaskSectionLabel>
      <TaskSectionTagWrapper>
        {labels.map(
          (label) =>
            label && (
              <TaskSectionImageContent
                key={label.id}
                hasContent={label}
                ContentComponent={() => <Tag color={label.color}>{label.name}</Tag>}
                DefaultContent={() => <TaskSectionInfoText>None</TaskSectionInfoText>}
              />
            )
        )}
      </TaskSectionTagWrapper>
    </TaskSectionDisplayDiv>
  );
}
