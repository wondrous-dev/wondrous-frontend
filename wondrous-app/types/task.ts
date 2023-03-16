import { User } from 'types/User';
import { PAYMENT_STATUS } from 'utils/constants';
import { ValueOf } from 'types/common';

export type TaskFilter = {
  category?: string;
  date?: string;
  fromDate?: Date | null;
  labelId?: string;
  limit?: number;
  offset?: number;
  orgId?: string;
  podIds?: any[];
  priorities?: string[];
  privacyLevel?: string;
  statuses?: any[];
  toDate?: Date | null;
};

export interface IUser {
  avatar: {
    id: string;
    isOwnerOfPod: boolean;
  };
  id: string;
  initials: string;
  name: string;
}

export interface ITask {
  actions: {
    comments: number;
    likes: number;
    shares: number;
  };
  compensation?: {
    amount: number | string;
    currency: string;
  };
  description: string;
  id: number | string;
  media: {
    id: string;
    type: string;
    url: string;
  };
  priority: number;
  status: string;
  title: string;
  users?: Array<IUser>;
}

export interface TaskMint {
  tokenId?: string;
  status: string;
}

export interface TaskInterface {
  __typename: string;
  assigneeId: string;
  assigneeOrder: string;
  assigneeProfilePicture?: any;
  assigneeUsername: string;
  commentCount?: any;
  completedAt: Date;
  createdAt: Date;
  createdBy: string;
  description: string;
  dueDate?: any;
  endDate?: string;
  id: string;
  links?: any;
  media?: any;
  milestoneId?: any;
  milestoneTitle?: any;
  orgId: string;
  orgName: string;
  orgOrder: string;
  orgProfilePicture?: any;
  observers: User[];
  podColor?: any;
  podId?: any;
  podName?: any;
  podOrder?: any;
  podProfilePicture?: any;
  priority?: any;
  reactionCount?: any;
  rewards?: any;
  status: string;
  startDate: string;
  title: string;
  type: string;
  taskMint?: TaskMint;
  parentTaskId?: string;
  totalSubtaskCount?: number;
  isProposal?: boolean;
  paymentStatus: ValueOf<typeof PAYMENT_STATUS> | null;
}
