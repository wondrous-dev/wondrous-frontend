import { MilestoneCard, MilestoneCardTitle, MilestoneIcon, MilestoneProgressWrapper } from './styles';
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
import { renderMentionString } from 'utils/common';
import { SafeImage } from '../Image';
import { PodName, PodWrapper } from 'components/Common/Task/styles';
import PodIcon from 'components/Icons/podIcon';
import { useRouter } from 'next/router';
import { CompletedIcon } from 'components/Icons/statusIcons';
export default function Board({ tasks, handleCardClick }) {
  const router = useRouter();

  const goToPod = (podId) => {
    router.push(`/pod/${podId}/boards`, undefined, {
      shallow: true,
    });
  };

  return (
    <>
      {tasks.map((milestone) => (
        <MilestoneCard onClick={() => handleCardClick(milestone)} key={milestone.id}>
          <BoardsCardHeader>
            <BoardsCardSubheader>
              <MilestoneIcon />
              <MilestoneCardTitle>Milestone</MilestoneCardTitle>
              <BoardsPrivacyLabel>
                {milestone?.privacyLevel === PRIVACY_LEVEL.public ? 'Public' : 'Members'}
              </BoardsPrivacyLabel>
              {milestone?.status === TASK_STATUS_DONE && <CompletedIcon />}
            </BoardsCardSubheader>
          </BoardsCardHeader>
          <BoardsCardBody>
            <BoardsCardBodyTitle>{milestone.title}</BoardsCardBodyTitle>
            <BoardsCardBodyDescription>
              {renderMentionString({
                content: milestone.description,
                router,
              })}
            </BoardsCardBodyDescription>
            <MilestoneProgressWrapper>
              <MilestoneProgress milestoneId={milestone.id} />
            </MilestoneProgressWrapper>
            {milestone?.media?.[0] ? (
              <BoardsCardMedia>
                <SafeImage
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  src={milestone?.media[0].slug}
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
      ))}
    </>
  );
}
