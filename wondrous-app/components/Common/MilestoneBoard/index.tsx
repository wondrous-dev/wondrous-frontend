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
  MilestoneProgress,
  MilestoneIcon,
  MilestoneSubheader,
} from './styles';
import Ethereum from 'components/Icons/ethereum';
import { USDCoin } from 'components/Icons/USDCoin';
import { WonderCoin } from 'components/Icons/wonderCoin';
import { Matic } from 'components/Icons/matic';
import CommentsIcon from 'components/Icons/comments';

const CURRENCY_SYMBOL = {
  ETH: <Ethereum />,
  WONDER: <WonderCoin />,
  MATIC: <Matic />,
  USDC: <USDCoin />,
};

const MOCK_DATA = [
  {
    title: 'Successfull beta launch',
    desc: 'Placerat sit nisl tempus, bibendum egestas. Nibh risus vel enim sapien sagittis, massa lectus leo. Integer...',
    complete: '33',
    comments: '876',
    members: true,
    price: '3.504',
    currency: 'ETH',
  },
  {
    title: 'Successfull beta launch',
    desc: 'Placerat sit nisl tempus.',
    complete: '33',
    comments: '876',
    members: true,
    price: '3.504',
    currency: 'WONDER',
  },
  {
    title: 'Successfull beta launch',
    desc: 'Placerat sit nisl tempus, bibendum egestas. Nibh risus vel enim sapien sagittis, massa lectus leo. Integer...',
    complete: '33',
    comments: '876',
    members: true,
    price: '3.504',
    currency: 'USDC',
  },
  {
    title: 'Successfull beta launch',
    desc: 'Placerat sit nisl tempus, bibendum egestas. Nibh risus vel enim sapien sagittis, massa lectus leo. Integer...',
    complete: '33',
    comments: '876',
    members: true,
    price: '3.504',
    currency: 'Matic',
  },
  {
    title: 'Successfull beta launch',
    desc: 'Placerat sit nisl tempus, bibendum egestas. Nibh risus vel enim sapien sagittis, massa lectus leo. Integer...',
    complete: '33',
    comments: '876',
    members: true,
    price: '3.504',
    currency: 'ETH',
  },
  {
    title: 'Successfull beta launch',
    desc: 'Placerat sit nisl tempus, bibendum egestas. Nibh risus vel enim sapien sagittis, massa lectus leo. Integer...',
    complete: '33',
    comments: '876',
    members: true,
    price: '3.504',
    currency: 'ETH',
  },
  {
    title: 'Successfull beta launch',
    desc: 'Placerat sit nisl tempus, bibendum egestas. Nibh risus vel enim sapien sagittis, massa lectus leo. Integer...',
    complete: '33',
    comments: '876',
    members: true,
    price: '3.504',
    currency: 'ETH',
  },
  {
    title: 'Successfull beta launch',
    desc: 'Placerat sit nisl tempus, bibendum egestas. Nibh risus vel enim sapien sagittis, massa lectus leo. Integer...',
    complete: '33',
    comments: '876',
    members: true,
    price: '3.504',
    currency: 'ETH',
  },
  {
    title: 'Successfull beta launch',
    desc: 'Placerat sit nisl tempus, bibendum egestas. Nibh risus vel enim sapien sagittis, massa lectus leo. Integer...',
    complete: '33',
    comments: '876',
    members: true,
    price: '3.504',
    currency: 'ETH',
  },
];

export default function MilestonesBoard({
  milestones = MOCK_DATA,
  onLoadMore = () => {},
  hasMore = true,
  setColumns = () => {},
}) {
  return (
    <MilestonesContainer>
      {milestones.map((milestone, idx) => (
        <MilestoneCard key={idx}>
          {/* top */}
          <MilestoneCardHeader>
            <MilestoneSubheader>
              <MilestoneIcon />
              <MilestoneCardTitle>Milestone</MilestoneCardTitle>
              <MilestonePrivacyType>Members</MilestonePrivacyType>
            </MilestoneSubheader>
            <MilestoneCardPrice>
              {CURRENCY_SYMBOL[milestone.currency] || CURRENCY_SYMBOL.ETH}
              {milestone.price}
            </MilestoneCardPrice>
          </MilestoneCardHeader>
          <MilestoneCardBody>
            <MilestoneBodyTitle>{milestone.title}</MilestoneBodyTitle>
            <MilestoneBodyDescription>{milestone.desc}</MilestoneBodyDescription>
            {/* <MilestoneProgress /> */}
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
