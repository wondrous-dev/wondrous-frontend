import FlagIcon from 'components/Icons/Sidebar/flag.svg';
import ListItemBounty from './ListItemBounty';
import ListWrapper from './ListWrapper';

const ListMilestone = () => (
  <ListWrapper
    HeaderTitleProps={{
      text: 'Milestone',
      IconComponent: FlagIcon,
    }}
    CreateButtonProps={{
      onClick: () => null,
      text: 'Milestone',
    }}
    backgroundImageUrl="/images/project/milestone-empty-bg.svg"
    showAllUrl="boards?entity=milestone"
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

export default ListMilestone;
