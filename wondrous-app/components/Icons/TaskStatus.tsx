import { CSSProperties } from 'react';

import {
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_AWAITING_PAYMENT,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_PAID,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUS_TODO,
} from 'utils/constants';
import {
  Archived,
  AwaitingPayment,
  DoneWithBorder,
  InProgressWithBorder,
  InReview,
  MembershipRequest,
  Paid,
  TodoWithBorder,
} from './index';
import { ProposalsRemainingIcon } from './statusIcons';

type Props = {
  status: string;
  style?: CSSProperties;
};

export default function TaskStatus({ status, ...rest }: Props) {
  switch (status) {
    case TASK_STATUS_IN_PROGRESS:
      return <InProgressWithBorder {...rest} />;

    case TASK_STATUS_TODO:
      return <TodoWithBorder {...rest} />;

    case TASK_STATUS_IN_REVIEW:
      return <InReview {...rest} />;

    case TASK_STATUS_DONE:
      return <DoneWithBorder {...rest} />;

    case TASK_STATUS_REQUESTED:
      return <MembershipRequest {...rest} />;

    case TASK_STATUS_AWAITING_PAYMENT:
      return <AwaitingPayment {...rest} />;

    case TASK_STATUS_PAID:
      return <Paid {...rest} />;

    case TASK_STATUS_PROPOSAL_REQUEST:
      return <ProposalsRemainingIcon {...rest} />;

    case TASK_STATUS_SUBMISSION_REQUEST:
      return <InReview {...rest} />;

    case TASK_STATUS_ARCHIVED:
      return <Archived {...rest} />;

    default:
      return <TodoWithBorder {...rest} />;
  }
}
