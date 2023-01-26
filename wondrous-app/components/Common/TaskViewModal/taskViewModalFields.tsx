import { useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
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
import { transformTaskProposalToTaskProposalCard } from 'utils/helpers';
import { Typography } from '@mui/material';
import typography from 'theme/typography';
import EditIcon from 'components/Icons/editIcon';
import RecurringIcon from '../../../public/images/icons/recurring.svg';
import { TaskSectionImageContent, TaskSectionLabel } from './helpers';
import {
  ActionButton,
  AddButtonGrid,
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
  ViewFieldWrapper,
} from './styles';
import { useUpdateTaskCardCache } from './utils';
import { UserProfilePicture } from '../ProfilePictureHelpers';

export const UserChip = ({ user }) => (
  <Grid display="flex" gap="6px" alignItems="center">
    <UserProfilePicture avatar={user?.profilePicture} />
    <Typography color={palette.white} fontWeight={500} fontSize="13px" fontFamily={typography.fontFamily}>
      {user?.username}
    </Typography>
  </Grid>
);

interface ApplicationFieldProps {
  shouldDisplay: boolean;
  taskApplicationCount?: any;
  handleReviewButton?: any;
}

export function ApplicationField({ shouldDisplay, taskApplicationCount, handleReviewButton }: ApplicationFieldProps) {
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

export function CategoryField({ shouldDisplay, labels }) {
  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Category</TaskSectionLabel>
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
