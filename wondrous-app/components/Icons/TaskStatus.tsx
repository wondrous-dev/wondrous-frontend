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
} from '../../utils/constants';
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
import Tooltip from '../Common/Popover';

type Props = {
  status: string;
};

export default function TaskStatus({ status, ...rest }: Props) {
  switch (status) {
    case TASK_STATUS_IN_PROGRESS:
      return (
        <Tooltip content="In-Progress">
          <InProgressWithBorder {...rest} />
        </Tooltip>
      );

    case TASK_STATUS_TODO:
      return (
        <Tooltip content="To-Do">
          <TodoWithBorder {...rest} />
        </Tooltip>
      );

    case TASK_STATUS_IN_REVIEW:
      return (
        <Tooltip content="In-Review">
          <InReview {...rest} />
        </Tooltip>
      );

    case TASK_STATUS_DONE:
      return (
        <Tooltip content="Completed">
          <DoneWithBorder {...rest} />
        </Tooltip>
      );

    case TASK_STATUS_REQUESTED:
      return (
        <Tooltip content="Proposals">
          <MembershipRequest {...rest} />
        </Tooltip>
      );

    case TASK_STATUS_AWAITING_PAYMENT:
      return <AwaitingPayment {...rest} />;

    case TASK_STATUS_PAID:
      return <Paid {...rest} />;

    case TASK_STATUS_PROPOSAL_REQUEST:
      return (
        <Tooltip content="Proposals">
          <ProposalsRemainingIcon {...rest} />
        </Tooltip>
      );

    case TASK_STATUS_SUBMISSION_REQUEST:
      return (
        <Tooltip content="InReview">
          <InReview {...rest} />
        </Tooltip>
      );

    case TASK_STATUS_ARCHIVED:
      return <Archived {...rest} />;

    default:
      return null;
  }
}
