import {
  BountyCardWrapper,
  BountyIcon,
  BountyCardType,
  BountyCardSubmissionsCountWrapper,
  BountyCardSubmissionsCount,
  SubmissionCount,
  SubtasksWrapper,
} from './styles';
import {
  BoardsCardSubheader,
  BoardsCardHeader,
  BoardsCardBody,
  BoardsRewardLabel,
  BoardsPrivacyLabel,
  BoardsCardFooter,
  BoardsCardBodyTitle,
  BoardsCardBodyDescription,
  BoardsCardMedia,
} from 'components/Common/Boards/styles';
import Ethereum from 'components/Icons/ethereum';
import { USDCoin } from 'components/Icons/USDCoin';
import { WonderCoin } from 'components/Icons/wonderCoin';
import { Matic } from 'components/Icons/matic';
import { PRIVACY_LEVEL } from 'utils/constants';
import CommentsIcon from 'components/Icons/comments';
import { SafeImage } from 'components/Common/Image';
import { SubtaskDarkIcon } from 'components/Icons/subtask';

const CURRENCY_SYMBOL = {
  eth: <Ethereum />,
  wonder: <WonderCoin />,
  matic: <Matic />,
  usdc: <USDCoin />,
};

export const SubmissionsCount = ({ total, approved }) => {
  const config = [
    {
      label: 'submissions',
      count: total,
      gradient: 'blue',
    },
    {
      label: 'approved',
      count: approved,
      gradient: 'green',
    },
  ];

  return (
    <BountyCardSubmissionsCountWrapper>
      {config.map((item, idx) => (
        <BountyCardSubmissionsCount key={idx}>
          <SubmissionCount gradient={item.gradient}>{item.count}</SubmissionCount>
          {item.label}
        </BountyCardSubmissionsCount>
      ))}
    </BountyCardSubmissionsCountWrapper>
  );
};
export default function Board({ tasks, handleCardClick = (bounty) => {} }) {
  return (
    <>
      {tasks.map((bounty) => {
        const reward = bounty?.rewards?.[0];
        const rewardSymbol = reward?.symbol?.toLowerCase() || 'eth';
        const rewardAmount = reward?.rewardAmount || null;
        return (
          <BountyCardWrapper onClick={() => handleCardClick(bounty)} key={bounty.id}>
            <BoardsCardHeader>
              <BoardsCardSubheader>
                <BountyIcon />
                <BountyCardType>Bounty</BountyCardType>
                <BoardsPrivacyLabel>
                  {bounty?.privacyLevel === PRIVACY_LEVEL.public ? 'Public' : 'Members'}
                </BoardsPrivacyLabel>
              </BoardsCardSubheader>
              <BoardsRewardLabel>
                {CURRENCY_SYMBOL[rewardSymbol]}
                {rewardAmount}
              </BoardsRewardLabel>
            </BoardsCardHeader>
            <BoardsCardBody>
              <BoardsCardBodyTitle>{bounty.title}</BoardsCardBodyTitle>
              <BoardsCardBodyDescription>{bounty.description}</BoardsCardBodyDescription>
              {bounty?.media?.[0] ? (
                <BoardsCardMedia>
                  <SafeImage
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                    src={bounty?.media[0].slug}
                  />
                </BoardsCardMedia>
              ) : null}
              <SubmissionsCount total={bounty.totalSubmissionsCount} approved={bounty.approvedSubmissionsCount} />
            </BoardsCardBody>
            <BoardsCardFooter>
              {Number.isInteger(bounty.totalSubtaskCount) && (
                <SubtasksWrapper>
                  <SubtaskDarkIcon height="30" width="30" fill="transparent" />
                  {bounty.totalSubtaskCount}
                </SubtasksWrapper>
              )}
              <>
                <CommentsIcon />
                {bounty.commentCount || 0}
              </>
            </BoardsCardFooter>
          </BountyCardWrapper>
        );
      })}
    </>
  );
}
