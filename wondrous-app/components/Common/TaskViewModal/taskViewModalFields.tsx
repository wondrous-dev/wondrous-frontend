import { useMutation } from '@apollo/client';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import TaskApplicationButton from 'components/Common/TaskApplication/TaskApplicationButton';
import TaskPriority from 'components/Common/TaskPriority';
import TaskViewModalAutocomplete from 'components/Common/TaskViewModalAutocomplete';
import TaskViewModalUserChip from 'components/Common/TaskViewModalUserChip';
import {
  filterOrgUsers,
  useGetEligibleReviewers,
  useGetOrgUsers,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import { Claim } from 'components/Icons/claimTask';
import PlusIcon from 'components/Icons/plus';
import Tooltip from 'components/Tooltip';
import { format } from 'date-fns';
import {
  REMOVE_TASK_ASSIGNEE,
  UPDATE_TASK_ASSIGNEE,
  UPDATE_TASK_PROPOSAL_ASSIGNEE,
  UPDATE_TASK_REVIEWERS,
} from 'graphql/mutations';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import palette from 'theme/palette';
import { TASK_STATUS_DONE, TASK_STATUS_IN_PROGRESS, TASK_STATUS_IN_REVIEW, TASK_STATUS_TODO } from 'utils/constants';
import { transformTaskProposalToTaskProposalCard, transformTaskToTaskCard } from 'utils/helpers';
import RecurringIcon from '../../../public/images/icons/recurring.svg';
import { TaskSectionImageContent, TaskSectionLabel } from './helpers';
import {
  ActionButton,
  AddReviewerButton,
  InfoPoint,
  ReviewerWrapper,
  Tag,
  TaskIntiativesContainer,
  TaskSectionDisplayContentWrapper,
  TaskSectionDisplayDiv,
  TaskSectionInfoCalendar,
  TaskSectionInfoDiv,
  TaskSectionInfoMilestoneIcon,
  TaskSectionInfoPoints,
  TaskSectionInfoPointsIcon,
  TaskSectionInfoRecurringIcon,
  TaskSectionInfoTakeTask,
  TaskSectionInfoTakeTaskText,
  TaskSectionInfoText,
  TaskSectionInfoTextMilestone,
  TaskSectionTagWrapper,
} from './styles';

export function ReviewerField({ reviewerData, handleClose, shouldDisplay, canEdit = false, fetchedTask, user }) {
  const router = useRouter();
  const eligibleReviewers = useGetEligibleReviewers(fetchedTask?.orgId, fetchedTask?.podId);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [updateTask] = useMutation(UPDATE_TASK_REVIEWERS);
  const handleUpdateReviewers = (reviewerIds) => {
    setShowAutocomplete(false);
    updateTask({
      variables: { taskId: fetchedTask?.id, reviewerIds },
      refetchQueries: ['getTaskReviewers'],
      onCompleted: () => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage('Reviewer updated successfully.');
      },
    });
  };
  const { getTaskReviewers: taskReviewers } = reviewerData || {};
  const withTaskReviewers = Boolean(taskReviewers?.length);
  const taskReviewerIds = taskReviewers?.map(({ id }) => id);
  const filteredEligibleReviewers = eligibleReviewers
    .filter(({ id }) => !taskReviewerIds?.includes(id))
    .map((i) => {
      if (user.id === i.id) return { ...i, hide: true };
      return i;
    });
  const showAutocompleteField = canEdit && (showAutocomplete || !withTaskReviewers);
  const showNone = !canEdit && !withTaskReviewers;
  const showAddButton =
    canEdit &&
    withTaskReviewers &&
    withTaskReviewers < eligibleReviewers?.length &&
    !isEmpty(filteredEligibleReviewers);
  const selfReviewer = !taskReviewerIds?.includes(user.id) && user;

  if (!shouldDisplay) {
    return null;
  }
  return (
    <TaskSectionDisplayDiv style={{ alignItems: 'start' }}>
      <TaskSectionLabel>Reviewer</TaskSectionLabel>
      <TaskSectionDisplayContentWrapper>
        <ReviewerWrapper showAddButton={showAddButton}>
          {withTaskReviewers &&
            taskReviewers.map((taskReviewer) => (
              <Grid key={taskReviewer.id} item container width="100%">
                <TaskSectionImageContent
                  hasContent={taskReviewer.id}
                  ContentComponent={() => (
                    <TaskViewModalUserChip
                      user={taskReviewer}
                      handleRemove={(e) => {
                        e.stopPropagation();
                        handleUpdateReviewers(taskReviewerIds.filter((id) => id !== taskReviewer.id));
                      }}
                      canEdit={canEdit}
                    />
                  )}
                  onClick={() => {
                    handleClose();
                    router.push(`/profile/${taskReviewer?.username}/about`, undefined, {
                      shallow: true,
                    });
                  }}
                />
              </Grid>
            ))}
          {showAutocompleteField && (
            <Grid item width="100%">
              <TaskViewModalAutocomplete
                options={filteredEligibleReviewers}
                onChange={(_, value, reason) => {
                  if (reason === 'selectOption') {
                    handleUpdateReviewers([...taskReviewerIds, value?.id]);
                  }
                }}
                user={selfReviewer}
                handleAssignToSelf={() => handleUpdateReviewers([...taskReviewerIds, user?.id])}
              />
            </Grid>
          )}
          {showNone && <TaskSectionInfoText>None</TaskSectionInfoText>}
          {showAddButton && (
            <Grid item container width="max-content">
              <AddReviewerButton onClick={() => setShowAutocomplete(!showAutocomplete)}>
                <PlusIcon fill={palette.white} />
              </AddReviewerButton>
            </Grid>
          )}
        </ReviewerWrapper>
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
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);
  const handleUpdateTaskAssignee = (assigneeId) => {
    updateTaskAssignee({
      variables: {
        taskId: fetchedTask?.id,
        assigneeId,
      },
      onCompleted: (data) => {
        const task = data?.updateTaskAssignee;
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
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage('Assignee updated successfully.');
      },
    });
  };
  const [removeTaskAssignee] = useMutation(REMOVE_TASK_ASSIGNEE);
  const [updateTaskProposalAssignee] = useMutation(UPDATE_TASK_PROPOSAL_ASSIGNEE);
  const { data: orgUsersData } = useGetOrgUsers(fetchedTask?.orgId);
  const filteredOrgUsersData = filterOrgUsers({ orgUsersData }).filter(({ value }) => value !== user?.id);
  const router = useRouter();
  if (!shouldDisplay) return null;

  const onCorrectPage = fetchedTask?.orgId === orgId || fetchedTask?.podId === podId || fetchedTask?.userId === userId;

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Assignee</TaskSectionLabel>
      <TaskSectionInfoDiv key={fetchedTask?.assigneeUsername}>
        <TaskSectionImageContent
          hasContent={fetchedTask?.assigneeUsername}
          ContentComponent={() => (
            <TaskViewModalUserChip
              user={fetchedTask?.assignee}
              handleRemove={(e) => {
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
                    setSnackbarAlertOpen(true);
                    setSnackbarAlertMessage('Assignee updated successfully.');
                  },
                });
              }}
              canEdit={canEdit}
            />
          )}
          onClick={() => {
            handleClose();
            router.push(`/profile/${fetchedTask?.assigneeUsername}/about`, undefined, {
              shallow: true,
            });
          }}
          DefaultContent={() => {
            if (canEdit)
              return (
                <TaskViewModalAutocomplete
                  options={filteredOrgUsersData}
                  onChange={(_, value, reason) => {
                    if (reason === 'selectOption') {
                      handleUpdateTaskAssignee(value?.value);
                    }
                  }}
                  user={user}
                  handleAssignToSelf={() => handleUpdateTaskAssignee(user?.id)}
                />
              );
            if (canClaim)
              return (
                <TaskSectionInfoTakeTask
                  onClick={() => {
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
                            let columns = [...boardColumns?.columns];
                            columns = updateProposalItem(transformedTaskProposal, columns);
                            boardColumns?.setColumns(columns);
                          }
                        },
                      });
                    } else {
                      handleUpdateTaskAssignee(user?.id);
                    }
                  }}
                >
                  <Claim />
                  <TaskSectionInfoTakeTaskText>Claim this task</TaskSectionInfoTakeTaskText>
                </TaskSectionInfoTakeTask>
              );
            if (canApply) return <TaskApplicationButton task={fetchedTask} canApply={canApply} title="Apply to task" />;
            return null;
          }}
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

export function PriorityField({ priority }) {
  if (!priority) {
    return null;
  }

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Priority</TaskSectionLabel>
      <TaskSectionTagWrapper>
        <TaskPriority value={priority} />
      </TaskSectionTagWrapper>
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

export const InitativesField = ({ shouldDisplay }) => {
  const [openModal, setOpenModal] = useState(false);
  if (!shouldDisplay) return null;
  return (
    <>
      <GR15DEIModal open={openModal} onClose={() => setOpenModal(false)} />
      <TaskSectionDisplayDiv>
        <TaskSectionLabel>Initiative</TaskSectionLabel>
        <TaskSectionImageContent
          hasContent={shouldDisplay}
          ContentComponent={() => (
            <TaskIntiativesContainer>
              <GR15DEILogo
                width="26"
                height="26"
                style={{
                  marginRight: '8px',
                }}
                onClick={() => setOpenModal(true)}
              />
              <TaskSectionInfoText>Gitcoin Grants R15 - DEI</TaskSectionInfoText>
            </TaskIntiativesContainer>
          )}
        />
      </TaskSectionDisplayDiv>
    </>
  );
};
