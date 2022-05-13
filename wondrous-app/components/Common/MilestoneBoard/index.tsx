import {
  MilestonesContainer,
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
} from './styles';
import Ethereum from 'components/Icons/ethereum';
import { USDCoin } from 'components/Icons/USDCoin';
import { WonderCoin } from 'components/Icons/wonderCoin';
import { Matic } from 'components/Icons/matic';
import CommentsIcon from 'components/Icons/comments';
import { PRIVACY_LEVEL } from 'utils/constants';
import { useRouter } from 'next/router';
import { MilestoneProgress } from 'components/Common/MilestoneProgress';
import { MilestoneWrapper } from 'components/Common/Milestone/index';
const CURRENCY_SYMBOL = {
  ETH: <Ethereum />,
  WONDER: <WonderCoin />,
  MATIC: <Matic />,
  USDC: <USDCoin />,
};

type Props = {
  columns: Array<any>;
  onLoadMore: any;
  hasMore: any;
  isAdmin?: boolean;
  setColumns: React.Dispatch<React.SetStateAction<{}>>;
};

export default function MilestonesBoard({
  columns = [],
  onLoadMore = () => {},
  hasMore,
  setColumns = () => {},
}: Props) {
  const router = useRouter();

  const handleClick = (milestone) => {
    // router.push(`/organization/${taskProposal?.org?.username}/boards?taskProposal=${taskProposal?.id}`, undefined, {
    //   shallow: true,
    // });
  };
  return (
    <MilestonesContainer>
      {columns.map((milestone) => (
        <MilestoneCard onClick={() => handleClick(milestone)} key={milestone.id}>
          {/* top */}
          <MilestoneCardHeader>
            <MilestoneSubheader>
              <MilestoneIcon />
              <MilestoneCardTitle>Milestone</MilestoneCardTitle>
              <MilestonePrivacyType>
                {PRIVACY_LEVEL[milestone.privacyLevel] === PRIVACY_LEVEL.private ? 'Members' : 'Public'}
              </MilestonePrivacyType>
            </MilestoneSubheader>
            <MilestoneCardPrice>
              {CURRENCY_SYMBOL[milestone.currency] || CURRENCY_SYMBOL.ETH}
              {/* {milestone.price} */}
              3.24
            </MilestoneCardPrice>
          </MilestoneCardHeader>
          <MilestoneCardBody>
            <MilestoneBodyTitle>{milestone.title}</MilestoneBodyTitle>
            <MilestoneBodyDescription>{milestone.description}</MilestoneBodyDescription>
            <MilestoneWrapper>
              <MilestoneProgress milestoneId={milestone.id} />
            </MilestoneWrapper>
          </MilestoneCardBody>
          <MilestoneCardFooter>
            <CommentsIcon />
            876
          </MilestoneCardFooter>
        </MilestoneCard>
      ))}
    </MilestonesContainer>
  );
}
