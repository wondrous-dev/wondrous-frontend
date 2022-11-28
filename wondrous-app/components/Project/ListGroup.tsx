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

import {
  useCollaborationButtonProps,
  useCreateGrantButtonProps,
  useDocCategoriesButtonProps,
  useEntityCreateButtonProps,
  useGetOrgEntity,
} from './hooks';
import ListItemBounty from './ListItemBounty';
import ListItemCollaboration from './ListItemCollaboration';
import ListItemGrant from './ListItemGrant';
import ListItemMember from './ListItemMember';
import ListItemMilestone from './ListItemMilestone';
import ListItemProposal from './ListItemProposal';
import ListItemResource from './ListItemResource';
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
    data: useGetOrgEntity('task'),
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
    data: useGetOrgEntity('bounty'),
  },
  {
    HeaderTitleProps: {
      text: 'Milestone',
      IconComponent: FlagIcon,
    },
    CreateButtonProps: useEntityCreateButtonProps(ENTITIES_TYPES.MILESTONE),
    backgroundImageUrl: '/images/project/milestone-empty-bg.svg',
    showAllUrl: 'boards?entity=milestone',
    ListItemComponent: ListItemMilestone,
    data: [
      {
        title: 'test milestone',
        type: 'milestone',
        orgId: '72322419271925761',
        status: 'completed',
        id: '72401739146330138',
      },
      {
        title: 'test milestone',
        type: 'milestone',
        orgId: '72322419271925761',
        id: '72401739146330138',
      },
      {
        title: 'test milestone',
        type: 'milestone',
        orgId: '72322419271925761',
        status: 'completed',
        id: '72401739146330138',
      },
    ],
  },
  {
    HeaderTitleProps: {
      text: 'Proposal',
      IconComponent: ContentPaste,
    },
    CreateButtonProps: useEntityCreateButtonProps(ENTITIES_TYPES.PROPOSAL),
    backgroundImageUrl: '/images/project/proposal-empty-bg.svg',
    showAllUrl: 'boards?entity=proposal',
    ListItemComponent: ListItemProposal,
    data: [
      {
        title: 'test proposal',
        type: 'proposal',
        orgId: '72322419271925761',
        status: 'open',
        id: '72401739146330138',
      },
      {
        title: 'test proposal',
        type: 'proposal',
        orgId: '72322419271925761',
        status: 'approved',
        id: '72401739146330138',
      },
      {
        title: 'test proposal',
        type: 'proposal',
        orgId: '72322419271925761',
        status: 'closed',
        id: '72401739146330138',
      },
    ],
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
    ListItemComponent: ListItemMember,
    data: [
      {
        user: {
          firstName: 'First',
          lastName: 'Last',
        },
        orgRoleName: 'contributor',
      },
      {
        user: {
          firstName: 'First',
          lastName: 'Last',
        },
        orgRoleName: 'member',
      },
      {
        user: {
          firstName: 'First',
          lastName: 'Last',
        },
        orgRoleName: 'core team',
      },
    ],
  },
  {
    HeaderTitleProps: {
      text: 'Collab',
      IconComponent: () => <SmallDao2DaoIcon stroke="#fff" />,
    },
    CreateButtonProps: useCollaborationButtonProps(),
    backgroundImageUrl: '/images/project/collab-empty-bg.svg',
    showAllUrl: 'members?collabs=true',
    ListItemComponent: ListItemCollaboration,
    data: [
      {
        parentOrg: {
          username: 'parent',
        },
        childOrg: {
          username: 'child',
        },
      },
    ],
  },
  {
    HeaderTitleProps: {
      text: 'Grant',
      IconComponent: PlantIcon,
    },
    CreateButtonProps: useCreateGrantButtonProps(),
    backgroundImageUrl: '/images/project/grant-empty-bg.svg',
    showAllUrl: 'grants',
    ListItemComponent: ListItemGrant,
    data: [
      {
        title: 'grant',
        reward: {
          rewardAmount: 100,
          symbol: 'USDC',
        },
        numOfGrant: 6,
        applicationsCount: 2,
        endDate: new Date('2022-11-29'),
      },
    ],
  },
  {
    HeaderTitleProps: {
      text: 'Resource',
      IconComponent: FolderIcon,
    },
    CreateButtonProps: useDocCategoriesButtonProps(),
    backgroundImageUrl: '/images/project/resources-empty-bg.svg',
    showAllUrl: 'docs',
    ListItemComponent: ListItemResource,
    data: [
      {
        name: 'folder a',
      },
      {
        name: 'resource b',
      },
    ],
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
