import { MilestoneCard, MilestoneCardTitle, MilestoneIcon, MilestoneProgressWrapper } from './styles';
import CommentsIcon from 'components/Icons/comments';
import { PRIVACY_LEVEL } from 'utils/constants';
import { MilestoneProgress } from 'components/Common/MilestoneProgress';
import {
  BoardsCardSubheader,
  BoardsCardBody,
  BoardsPrivacyLabel,
  BoardsCardFooter,
  BoardsCardHeader,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
} from 'components/Common/Boards/styles';

export default function Board({ tasks, handleCardClick }) {
  return (
    <>
      {tasks.map((milestone) => (
        <MilestoneCard onClick={() => handleCardClick(milestone)} key={milestone.id}>
          <BoardsCardHeader>
            <BoardsCardSubheader>
              <MilestoneIcon />
              <MilestoneCardTitle>Milestone</MilestoneCardTitle>
              <BoardsPrivacyLabel>
                {PRIVACY_LEVEL[milestone.privacyLevel] === PRIVACY_LEVEL.private ? 'Members' : 'Public'}
              </BoardsPrivacyLabel>
            </BoardsCardSubheader>
            {/*  TODO we don't have price on milestones yet */}
            {/* <BoardsRewardLabel>
                {CURRENCY_SYMBOL[milestone.currency] || CURRENCY_SYMBOL.ETH}
                3.24
              </BoardsRewardLabel> */}
          </BoardsCardHeader>
          <BoardsCardBody>
            <BoardsCardBodyTitle>{milestone.title}</BoardsCardBodyTitle>
            <BoardsCardBodyDescription>{milestone.description}</BoardsCardBodyDescription>
            <MilestoneProgressWrapper>
              <MilestoneProgress milestoneId={milestone.id} />
            </MilestoneProgressWrapper>
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
