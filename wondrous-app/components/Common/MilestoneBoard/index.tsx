import { Fragment } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import CommentsIcon from 'components/Icons/comments';
import { PRIVACY_LEVEL, TASK_STATUS_DONE } from 'utils/constants';
import { MilestoneProgress } from 'components/Common/MilestoneProgress';
import {
  BoardsCardSubheader,
  BoardsCardBody,
  BoardsPrivacyLabel,
  BoardsCardFooter,
  BoardsCardHeader,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
  BoardsCardMedia,
} from 'components/Common/Boards/styles';
import { PodName, PodWrapper } from 'components/Common/Task/styles';
import PodIcon from 'components/Icons/podIcon';
import { useRouter } from 'next/router';
import { RichTextViewer } from 'components/RichText';
import EmptyStateBoards from 'components/EmptyStateBoards';
import TaskPriority from 'components/Common/TaskPriority';
import TaskCardDate from 'components/Common/TaskCardDate';
import TaskCardStatus from 'components/Common/TaskCardStatuts';
import { SafeImage } from '../Image';
import { MilestoneCard, MilestoneProgressWrapper } from './styles';

export default function Board({ tasks, handleCardClick, Container = Fragment }) {
  const router = useRouter();

  const goToPod = (podId) => {
    router.push(`/pod/${podId}/boards`, undefined, {
      shallow: true,
    });
  };

  return (
    <Container>
      {tasks?.length ? (
        tasks.map((milestone) => {
          const coverMedia = milestone?.media?.find((media) => media.type === 'image');
          return (
            <MilestoneCard onClick={() => handleCardClick(milestone)} key={milestone.id}>
              <BoardsCardHeader>
                <BoardsCardSubheader>
                  <TaskCardStatus type={milestone?.type} orgId={milestone?.orgId} status={milestone?.status} />
                  <BoardsPrivacyLabel>
                    {milestone?.privacyLevel === PRIVACY_LEVEL.public ? 'Public' : 'Members'}
                  </BoardsPrivacyLabel>
                </BoardsCardSubheader>
                <Grid container width="fit-content" flexGrow="1" justifyContent="flex-end">
                  <TaskCardDate date={milestone?.dueDate} />
                </Grid>
              </BoardsCardHeader>
              <BoardsCardBody>
                <BoardsCardBodyTitle>{milestone.title}</BoardsCardBodyTitle>
                {milestone?.priority ? (
                  <Box>
                    <TaskPriority value={milestone?.priority} />
                  </Box>
                ) : null}
                <BoardsCardBodyDescription>
                  <RichTextViewer text={milestone.description} />
                </BoardsCardBodyDescription>
                <MilestoneProgressWrapper>
                  <MilestoneProgress milestoneId={milestone.id} />
                </MilestoneProgressWrapper>
                {coverMedia ? (
                  <BoardsCardMedia>
                    <SafeImage
                      useNextImage={false}
                      style={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
                      src={coverMedia.slug}
                    />
                  </BoardsCardMedia>
                ) : null}
                {milestone?.podName && (
                  <PodWrapper
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToPod(milestone?.podId);
                    }}
                  >
                    <PodIcon
                      color={milestone?.podColor}
                      style={{
                        width: '26px',
                        height: '26px',
                        marginRight: '8px',
                      }}
                    />
                    <PodName>{milestone?.podName}</PodName>
                  </PodWrapper>
                )}
              </BoardsCardBody>
              <BoardsCardFooter>
                <CommentsIcon />
                {milestone.commentCount || 0}
              </BoardsCardFooter>
            </MilestoneCard>
          );
        })
      ) : (
        <EmptyStateBoards hidePlaceholder status="created" fullWidth />
      )}
    </Container>
  );
}
