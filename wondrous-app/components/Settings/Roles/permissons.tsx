import { PERMISSIONS } from '../../../utils/constants';

export type Permisson = {
  title: string;
  subTitle: string;
  permission: string;
};

const permissons: Permisson[] = [
  {
    title: 'All Permissions',
    subTitle: 'Can do everything.',
    permission: PERMISSIONS.FULL_ACCESS,
  },
  {
    title: 'Add members',
    subTitle: 'Can approve contributor requests.',
    permission: PERMISSIONS.MANAGE_MEMBER,
  },
  {
    title: 'Create tasks',
    subTitle: 'Member can create tasks.',
    permission: PERMISSIONS.CREATE_TASK,
  },
  {
    title: 'Manage board',
    subTitle: 'Member can manage board.',
    permission: PERMISSIONS.MANAGE_BOARD,
  },
  {
    title: 'Review tasks',
    subTitle: 'Member can review tasks.',
    permission: PERMISSIONS.REVIEW_TASK,
  },
  {
    title: 'Can comment',
    subTitle: 'Can comment tasks.',
    permission: PERMISSIONS.CAN_COMMENT,
  },
  {
    title: 'Manage comment',
    subTitle: 'Member can manage_comment.',
    permission: PERMISSIONS.MANAGE_COMMENT,
  },
  {
    title: 'Manage pod',
    subTitle: 'Member can manage pod.',
    permission: PERMISSIONS.MANAGE_POD,
  },
  {
    title: 'Manage tasks order.',
    subTitle: 'Member can reorder tasks.',
    permission: PERMISSIONS.REORDER_TASK,
  },
  {
    title: 'Posting privileges',
    subTitle: 'Can post to the activity timeline as brand.',
    permission: PERMISSIONS.MANAGE_POST,
  },
  // {
  //   title: 'Manage Roles',
  //   subTitle: 'Can kick, ban, upgrade, downgrade members.',
  // },
  // {
  //   title: 'Payout Permissions',
  //   subTitle: 'Can payout members for their work.',
  //   permission: PERMISSIONS.APPROVE_PAYMENT
  // },
  // {
  //   title: 'Milestone approvals',
  //   subTitle: 'Can approve requested milestones',
  // },
  // {
  //   title: 'Task approvals',
  //   subTitle: 'Can approve tasks.',
  // },
  // {
  //   title: 'Budget allocation',
  //   subTitle: 'Can allocate resources to pods.',
  // },
  // {
  //   title: 'Set milestone & task rewards',
  //   subTitle: 'Member can decide price payout per completions.',
  // },
  // {
  //   title: 'Set tasks',
  //   subTitle: 'Member can set tasks without approval.',
  // },
  // {
  //   title: 'Set milestones',
  //   subTitle: 'Member can set milestones without approval.',
  // },
  // {
  //   title: 'Can suggest tasks / milestones',
  //   subTitle: 'Bottom up can suggest tasks / milestones.',
  // },
  // {
  //   title: 'Can be assigned to work',
  //   subTitle: 'Basic contributor level permisions.',
  // },
  // {
  //   title: 'Can be assigned to work',
  //   subTitle: 'Access to see all payments done by the DAO.',
  // },
];

export default permissons;
