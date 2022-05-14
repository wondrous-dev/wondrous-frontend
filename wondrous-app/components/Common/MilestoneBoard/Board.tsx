import {
  MilestoneCard,
  MilestoneCardHeader,
  MilestoneCardBody,
  MilestoneCardFooter,
  MilestonePrivacyType,
  MilestoneCardTitle,
  MilestoneCardPrice,
  MilestoneBodyTitle,
  MilestoneBodyDescription,
  MilestoneIcon,
  MilestoneSubheader,
  MilestoneProgressWrapper,
} from './styles';
import CommentsIcon from 'components/Icons/comments';
import { PRIVACY_LEVEL } from 'utils/constants';
import { MilestoneProgress } from 'components/Common/MilestoneProgress';
import Ethereum from 'components/Icons/ethereum';
import { USDCoin } from 'components/Icons/USDCoin';
import { WonderCoin } from 'components/Icons/wonderCoin';
import { Matic } from 'components/Icons/matic';

const CURRENCY_SYMBOL = {
  ETH: <Ethereum />,
  WONDER: <WonderCoin />,
  MATIC: <Matic />,
  USDC: <USDCoin />,
};

export default function Board({ milestones, handleCardClick }) {
  return (
    <>
      {milestones.map((milestone) => (
        <MilestoneCard onClick={() => handleCardClick(milestone)} key={milestone.id}>
          <MilestoneCardHeader>
            <MilestoneSubheader>
              <MilestoneIcon />
              <MilestoneCardTitle>Milestone</MilestoneCardTitle>
              <MilestonePrivacyType>
                {PRIVACY_LEVEL[milestone.privacyLevel] === PRIVACY_LEVEL.private ? 'Members' : 'Public'}
              </MilestonePrivacyType>
            </MilestoneSubheader>
            {/*  TODO we don't have price on milestones yet */}
            {/* <MilestoneCardPrice>
                {CURRENCY_SYMBOL[milestone.currency] || CURRENCY_SYMBOL.ETH}
                3.24
              </MilestoneCardPrice> */}
          </MilestoneCardHeader>
          <MilestoneCardBody>
            <MilestoneBodyTitle>{milestone.title}</MilestoneBodyTitle>
            <MilestoneBodyDescription>{milestone.description}</MilestoneBodyDescription>
            <MilestoneProgressWrapper>
              <MilestoneProgress milestoneId={milestone.id} />
            </MilestoneProgressWrapper>
          </MilestoneCardBody>
          <MilestoneCardFooter>
            <CommentsIcon />
            {milestone.commentCount || 0}
          </MilestoneCardFooter>
        </MilestoneCard>
      ))}
    </>
  );
}
