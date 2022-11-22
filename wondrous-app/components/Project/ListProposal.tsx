import PodIcon from 'components/Icons/podIcon';
import ListItemBounty from './ListItemBounty';
import ListWrapper from './ListWrapper';

const ListProposal = () => (
  <ListWrapper
    HeaderTitleProps={{
      text: 'Proposal',
      IconComponent: PodIcon,
    }}
    CreateButtonProps={{
      onClick: () => null,
      text: 'Proposal',
    }}
    backgroundImageUrl="/images/project/proposal-empty-bg.svg"
    showAllOnClick={() => null}
    ListItemComponent={ListItemBounty}
    // data={[
    //   {
    //     title: 'test bounty',
    //     date: new Date(),
    //     type: 'task',
    //     rewards: [
    //       {
    //         rewardAmount: 1000,
    //         symbol: 'USDC',
    //         icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    //       },
    //     ],
    //     id: 1,
    //   },
    //   {
    //     title: 'test bounty',
    //     date: new Date(),
    //     type: 'task',
    //     rewards: [
    //       {
    //         rewardAmount: 1000,
    //         symbol: 'USDC',
    //         icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    //       },
    //     ],
    //     id: 2,
    //   },
    //   {
    //     title: 'test bounty',
    //     date: new Date(),
    //     type: 'task',
    //     rewards: [
    //       {
    //         rewardAmount: 100,
    //         symbol: 'USDC',
    //       },
    //     ],
    //     id: 3,
    //   },
    // ]}
  />
);

export default ListProposal;
