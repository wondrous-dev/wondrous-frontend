import Box from '@mui/material/Box';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import TaskPriority from 'components/Common/TaskPriority';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { TaskSectionImageContent, TaskSectionLabel } from './helpers';
import {
  ActionButton,
  Tag,
  TaskIntiativesContainer,
  TaskSectionDisplayDiv,
  TaskSectionInfoMilestoneIcon,
  TaskSectionInfoPointsIcon,
  TaskSectionInfoText,
  TaskSectionInfoTextMilestone,
  TaskSectionTagWrapper,
} from './styles';

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
