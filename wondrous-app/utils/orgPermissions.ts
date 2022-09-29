import { PERMISSIONS } from './constants';

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
    title: 'Create task',
    subTitle: 'Member can create tasks.',
    permission: PERMISSIONS.CREATE_TASK,
  },
  {
    title: 'Edit task',
    subTitle: 'Member can edit tasks.',
    permission: PERMISSIONS.EDIT_TASK,
  },
  // {
  //   title: 'Manage board',
  //   subTitle: 'Member can manage board.',
  //   permission: PERMISSIONS.MANAGE_BOARD,
  // },
  {
    title: 'Review tasks',
    subTitle: 'Member can review tasks.',
    permission: PERMISSIONS.REVIEW_TASK,
  },
  {
    title: 'Manage comment',
    subTitle: 'Member can manage comment.',
    permission: PERMISSIONS.MANAGE_COMMENT,
  },
  {
    title: 'Manage pod',
    subTitle: 'Member can manage pod.',
    permission: PERMISSIONS.MANAGE_POD,
  },
  {
    title: 'Posting privileges',
    subTitle: 'Can post to the activity timeline as brand.',
    permission: PERMISSIONS.MANAGE_POST,
  },
  {
    title: 'Payout Permissions',
    subTitle: 'Can payout members for their work.',
    permission: PERMISSIONS.APPROVE_PAYMENT,
  },
];

export default permissons;
