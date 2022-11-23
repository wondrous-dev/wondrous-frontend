import PlantIcon from 'components/Icons/plant.svg';
import ListItemBounty from './ListItemBounty';
import ListWrapper from './ListWrapper';

const ListGrant = () => (
  <ListWrapper
    HeaderTitleProps={{
      text: 'Grant',
      IconComponent: PlantIcon,
    }}
    CreateButtonProps={{
      onClick: () => null,
      text: 'Grant',
    }}
    backgroundImageUrl="/images/project/grant-empty-bg.svg"
    showAllUrl=""
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

export default ListGrant;
