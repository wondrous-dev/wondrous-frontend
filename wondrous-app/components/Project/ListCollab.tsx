import { SmallDao2DaoIcon } from 'components/Icons/Dao2Dao';
import ListItemBounty from './ListItemBounty';
import ListWrapper from './ListWrapper';

const CollabIcon = () => <SmallDao2DaoIcon stroke="#fff" />;

const ListCollab = () => (
  <ListWrapper
    HeaderTitleProps={{
      text: 'Collab',
      IconComponent: CollabIcon,
    }}
    CreateButtonProps={{
      onClick: () => null,
      text: 'Collab',
    }}
    backgroundImageUrl="/images/project/collab-empty-bg.svg"
    showAllUrl="members?collabs=true"
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

export default ListCollab;
