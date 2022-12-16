import {
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_AWAITING_PAYMENT,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_PAID,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_TODO,
} from 'utils/constants';

import {
  Archived,
  AwaitingPayment,
  DoneWithBorder,
  InProgressWithBorder,
  InReview,
  Paid,
  Requested,
  TodoWithBorder,
} from 'components/Icons';

const TASK_ICONS = {
  [TASK_STATUS_TODO]: TodoWithBorder,
  [TASK_STATUS_IN_PROGRESS]: InProgressWithBorder,
  [TASK_STATUS_DONE]: DoneWithBorder,
  [TASK_STATUS_IN_REVIEW]: InReview,
  [TASK_STATUS_REQUESTED]: Requested,
  [TASK_STATUS_ARCHIVED]: Archived,
  [TASK_STATUS_AWAITING_PAYMENT]: AwaitingPayment,
  [TASK_STATUS_PAID]: Paid,
};

export default TASK_ICONS;
