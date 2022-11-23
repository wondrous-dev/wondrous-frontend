import StarIcon from 'components/Icons/Sidebar/star.svg';
import ListItemBounty from './ListItemBounty';
import ListWrapper from './ListWrapper';

const ListBounty = () => (
  <ListWrapper
    HeaderTitleProps={{
      text: 'Bounty',
      IconComponent: StarIcon,
    }}
    CreateButtonProps={{
      onClick: () => null,
      text: 'Bounty',
    }}
    backgroundImageUrl="/images/project/bounty-empty-bg.svg"
    showAllUrl="boards?entity=bounty"
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

export default ListBounty;
