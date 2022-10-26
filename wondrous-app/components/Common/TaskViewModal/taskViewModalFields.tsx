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
import { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
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
  const handleOnClick = (username) => () => {
    handleClose();
    router.push(`/profile/${username}/about`);
  };

  if (!shouldDisplay) {
    return null;
  }
  return (
    <TaskSectionDisplayDiv alignItems="start">
      <TaskSectionLabel>Reviewer</TaskSectionLabel>
      <TaskSectionDisplayContentWrapper>
        <ReviewerWrapper showAddButton={showAddButton}>
          {withTaskReviewers &&
            taskReviewers.map((taskReviewer) => (
              <Grid key={taskReviewer.id} item container width="100%">
                <TaskSectionImageContent
                  hasContent={taskReviewer.id}
                  ContentComponent={TaskViewModalUserChip}
                  ContentComponentProps={{
                    user: taskReviewer,
                    handleRemove: (e) => {
                      e.stopPropagation();
                      handleUpdateReviewers(taskReviewerIds.filter((id) => id !== taskReviewer.id));
                    },
                    canEdit,
                  }}
                  onClick={handleOnClick(taskReviewer?.username)}
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
                ListboxProps={{
                  AssignToSelfProps: {
                    user: selfReviewer,
                    onClick: () => handleUpdateReviewers([...taskReviewerIds, user?.id]),
                  },
                }}
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

const AssigneeDefaultContent = ({
  boardColumns,
  canApply,
  canClaim,
  canEdit,
  fetchedTask,
  isTaskProposal,
  onCorrectPage,
  router,
  updateProposalItem,
  user,
  updateBoard,
  setFetchedTask,
}) => {
  const [ref, inView] = useInView({});
  const [updateTaskProposalAssignee] = useMutation(UPDATE_TASK_PROPOSAL_ASSIGNEE);
  const { data: orgUsersData, search, fetchMoreOrgUsers } = useGetOrgUsers(fetchedTask?.orgId);
  useEffect(() => {
    if (inView) fetchMoreOrgUsers();
  }, [fetchMoreOrgUsers, inView]);
  const filteredOrgUsersData = filterOrgUsers({ orgUsersData }).filter(({ value }) => value !== user?.id);
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  const handleUpdateTaskAssignee = (assigneeId) => {
    updateTaskAssignee({
      variables: {
        taskId: fetchedTask?.id,
        assigneeId,
      },
      onCompleted: (data) => {
        const task = data?.updateTaskAssignee;
        updateBoard({ task, setFetchedTask, boardColumns });
      },
    });
  };
  if (canClaim && canEdit)
    return (
      <TaskViewModalAutocomplete
        options={filteredOrgUsersData}
        onChange={(_, value, reason) => {
          if (reason === 'selectOption') {
            handleUpdateTaskAssignee(value?.value);
          }
        }}
        renderInputProps={{
          onChange: (e) => search(e.target.value),
        }}
        ListboxProps={{
          AssignToSelfProps: { user, onClick: () => handleUpdateTaskAssignee(user?.id) },
          innerRef: ref,
        }}
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
};

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
  const onCorrectPage = fetchedTask?.orgId === orgId || fetchedTask?.podId === podId || fetchedTask?.userId === userId;
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);
  const updateBoard = ({ task, setFetchedTask, boardColumns }) => {
    const transformedTask = transformTaskToTaskCard(task, {});
    setFetchedTask(transformedTask);
    if (boardColumns?.setColumns && onCorrectPage) {
      const columns = [...boardColumns?.columns];
      const updateColumnFn = {
        [TASK_STATUS_IN_REVIEW]: updateInReviewItem,
        [TASK_STATUS_IN_PROGRESS]: updateInProgressTask,
        [TASK_STATUS_TODO]: updateTaskItem,
        [TASK_STATUS_DONE]: updateCompletedItem,
      };
      const updatedColumns = updateColumnFn?.[transformedTask?.status](transformedTask, columns);
      boardColumns.setColumns(updatedColumns);
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Assignee updated successfully.');
    }
  };
  const [removeTaskAssignee] = useMutation(REMOVE_TASK_ASSIGNEE);
  const router = useRouter();
  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Assignee</TaskSectionLabel>
      <TaskSectionInfoDiv key={fetchedTask?.assigneeUsername}>
        <TaskSectionImageContent
          hasContent={fetchedTask?.assigneeUsername}
          ContentComponent={TaskViewModalUserChip}
          ContentComponentProps={{
            user: fetchedTask?.assignee,
            handleRemove: (e) => {
              e.preventDefault();
              e.stopPropagation();
              removeTaskAssignee({
                variables: {
                  taskId: fetchedTask?.id,
                },
                onCompleted: (data) => {
                  const task = data?.removeTaskAssignee;
                  updateBoard({ task, setFetchedTask, boardColumns });
                },
              });
            },
            canEdit,
          }}
          onClick={() => {
            handleClose();
            router.push(`/profile/${fetchedTask?.assigneeUsername}/about`, undefined, {
              shallow: true,
            });
          }}
          DefaultContent={AssigneeDefaultContent}
          DefaultContentProps={{
            boardColumns,
            canApply,
            canClaim,
            canEdit,
            fetchedTask,
            isTaskProposal,
            onCorrectPage,
            router,
            updateProposalItem,
            user,
            updateBoard,
            setFetchedTask,
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

const InfoText = ({ content = null }) => <TaskSectionInfoText>{content || 'None'}</TaskSectionInfoText>;

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
        ContentComponent={InfoText}
        ContentComponentProps={{
          content: creatorUsername,
        }}
        imgSrc={creatorProfilePicture}
        DefaultImageComponent={() => <DefaultUserImage />}
        DefaultContent={InfoText}
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
        ContentComponent={InfoText}
        ContentComponentProps={{
          content: `${totalVotes} votes`,
        }}
      />
    </TaskSectionDisplayDiv>
  );
}

const DueDateFieldContent = ({ recurringSchema, dueDate }) => (
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
);

export function DueDateField({ shouldDisplay, dueDate, recurringSchema, shouldUnclaimOnDueDateExpiry }) {
  if (!shouldDisplay) return null;
  return (
    <div>
      <TaskSectionDisplayDiv>
        <TaskSectionLabel>Due Date</TaskSectionLabel>
        <TaskSectionImageContent
          hasContent={dueDate}
          ContentComponent={DueDateFieldContent}
          ContentComponentProps={{ recurringSchema, dueDate }}
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
        ContentComponent={InfoText}
        ContentComponentProps={{
          content: points,
        }}
        DefaultImageComponent={() => <TaskSectionInfoPointsIcon />}
      />
    </TaskSectionDisplayDiv>
  );
}

const MilestoneFieldContent = ({ milestoneId, getTaskById, milestoneTitle }) => {
  const router = useRouter();
  return (
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
  );
};

export function MilestoneField({ shouldDisplay, milestoneId, getTaskById, milestoneTitle }) {
  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Milestone</TaskSectionLabel>
      <TaskSectionImageContent
        hasContent={milestoneId}
        ContentComponent={MilestoneFieldContent}
        ContentComponentProps={{ milestoneId, getTaskById, milestoneTitle }}
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

const TagsFieldContent = ({ label }) => <Tag color={label.color}>{label.name}</Tag>;

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
                ContentComponent={TagsFieldContent}
                ContentComponentProps={{ label }}
                DefaultContent={InfoText}
              />
            )
        )}
      </TaskSectionTagWrapper>
    </TaskSectionDisplayDiv>
  );
}

const InitativesFieldContent = ({ setOpenModal }) => (
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
);
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
          ContentComponent={InitativesFieldContent}
          ContentComponentProps={{ setOpenModal }}
        />
      </TaskSectionDisplayDiv>
    </>
  );
};
