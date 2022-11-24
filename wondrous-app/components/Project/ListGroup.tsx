import Grid from '@mui/material/Grid';
import { SmallDao2DaoIcon } from 'components/Icons/Dao2Dao';
import PlantIcon from 'components/Icons/plant.svg';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import ContentPaste from 'components/Icons/Sidebar/contentPaste.svg';
import FlagIcon from 'components/Icons/Sidebar/flag.svg';
import FolderIcon from 'components/Icons/Sidebar/folder.svg';
import GroupIcon from 'components/Icons/Sidebar/group.svg';
import StarIcon from 'components/Icons/Sidebar/star.svg';
import { ENTITIES_TYPES } from 'utils/constants';

import { useCollabButtonProps, useEntityCreateButtonProps } from './hooks';
import ListItemBounty from './ListItemBounty';
import ListItemTask from './ListItemTask';
import ListWrapper from './ListWrapper';

const useListGroup = () => [
  {
    HeaderTitleProps: {
      text: 'Task',
      IconComponent: CheckBoxIcon,
    },
    CreateButtonProps: useEntityCreateButtonProps(ENTITIES_TYPES.TASK),
    backgroundImageUrl: '/images/project/task-empty-bg.svg',
    showAllUrl: 'boards?entity=task',
    ListItemComponent: ListItemTask,
    // data: [
    //   {
    //     title: 'test task',
    //     date: new Date(),
    //     type: 'task',
    //     id: 1,
    //   },
    //   {
    //     title: 'test task',
    //     date: new Date(),
    //     type: 'task',
    //     id: 2,
    //   },
    //   {
    //     title: 'test task',
    //     date: new Date(),
    //     type: 'task',
    //     id: 3,
    //   },
    // ],
  },
  {
    HeaderTitleProps: {
      text: 'Bounty',
      IconComponent: StarIcon,
    },
    CreateButtonProps: useEntityCreateButtonProps(ENTITIES_TYPES.BOUNTY),
    backgroundImageUrl: '/images/project/bounty-empty-bg.svg',
    showAllUrl: 'boards?entity=bounty',
    ListItemComponent: ListItemBounty,
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
  },
  {
    HeaderTitleProps: {
      text: 'Milestone',
      IconComponent: FlagIcon,
    },
    CreateButtonProps: useEntityCreateButtonProps(ENTITIES_TYPES.MILESTONE),
    backgroundImageUrl: '/images/project/milestone-empty-bg.svg',
    showAllUrl: 'boards?entity=milestone',
    ListItemComponent: ListItemBounty,
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
  },
  {
    HeaderTitleProps: {
      text: 'Proposal',
      IconComponent: ContentPaste,
    },
    CreateButtonProps: useEntityCreateButtonProps(ENTITIES_TYPES.PROPOSAL),
    backgroundImageUrl: '/images/project/proposal-empty-bg.svg',
    showAllUrl: 'boards?entity=proposal',
    ListItemComponent: ListItemBounty,
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
  },
  {
    HeaderTitleProps: {
      text: 'Member',
      IconComponent: GroupIcon,
    },
    CreateButtonProps: {
      onClick: () => null,
      text: 'Member',
    },
    backgroundImageUrl: '/images/project/collab-empty-bg.svg',
    showAllUrl: 'members',
    ListItemComponent: ListItemBounty,
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
    // ]}}
  },
  {
    HeaderTitleProps: {
      text: 'Collab',
      IconComponent: () => <SmallDao2DaoIcon stroke="#fff" />,
    },
    CreateButtonProps: useCollabButtonProps(),
    backgroundImageUrl: '/images/project/collab-empty-bg.svg',
    showAllUrl: 'members?collabs=true',
    ListItemComponent: ListItemBounty,
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
  },
  {
    HeaderTitleProps: {
      text: 'Grant',
      IconComponent: PlantIcon,
    },
    CreateButtonProps: {
      onClick: () => null,
      text: 'Grant',
    },
    backgroundImageUrl: '/images/project/grant-empty-bg.svg',
    showAllUrl: '',
    ListItemComponent: ListItemBounty,
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
  },
  {
    HeaderTitleProps: {
      text: 'Resource',
      IconComponent: FolderIcon,
    },
    CreateButtonProps: {
      onClick: () => null,
      text: 'Resource',
    },
    backgroundImageUrl: '/images/project/resources-empty-bg.svg',
    showAllUrl: 'docs',
    ListItemComponent: ListItemBounty,
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
  },
];

const ListGroup = () => (
  <Grid
    container
    justifyContent="space-between"
    gap="24px"
    sx={[
      {
        '& > *': {
          maxWidth: 'calc(50% - 12px)',
        },
      },
    ]}
  >
    {useListGroup().map((i, index) => (
      <ListWrapper key={index} {...i} />
    ))}
  </Grid>
);

export default ListGroup;
