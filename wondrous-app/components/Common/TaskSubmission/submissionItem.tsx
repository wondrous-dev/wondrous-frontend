import { useMutation } from '@apollo/client';
import { RichTextViewer } from 'components/RichText';
import { formatDistance } from 'date-fns';
import {
  APPROVE_BOUNTY_SUBMISSION,
  APPROVE_SUBMISSION,
  REQUEST_CHANGE_SUBMISSION,
} from 'graphql/mutations/taskSubmission';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { BOUNTY_TYPE, PAYMENT_STATUS, TASK_STATUS_DONE, TASK_TYPE } from 'utils/constants';
import { transformTaskToTaskCard } from 'utils/helpers';
import { useBoards, useColumns } from 'utils/hooks';

import { CompletedIcon, InReviewIcon } from '../../Icons/statusIcons';
import DefaultUserImage from '../Image/DefaultUserImage';
import { KudosForm } from '../KudosForm';
import { PaymentButton } from '../Task/paymentButton';
import {
  SubmissionButtonApprove,
  SubmissionButtonEdit,
  SubmissionButtonRequestChange,
  SubmissionButtonReviewWrapper,
  SubmissionDescription,
  SubmissionDivider,
  SubmissionItemCreator,
  SubmissionItemFooter,
  SubmissionItemHeader,
  SubmissionItemHeaderContent,
  SubmissionItemSafeImage,
  SubmissionItemSection,
  SubmissionItemsMedia,
  SubmissionItemStatusChangesRequestedIcon,
  SubmissionItemStatusTextAwaitingReview,
  SubmissionItemStatusTextChangesRequested,
  SubmissionItemStatusTextCompleted,
  SubmissionItemStatusWrapper,
  SubmissionItemTimeText,
  SubmissionItemWrapper,
  TaskSubmissionLink,
  TaskSubmissionLinkIcon,
  TaskSubmissionLinkWrapper,
} from './styles';

const isBountyApprovedUnpaid = ({ fetchedTask, submission }) => {
  const { approvedAt, paymentStatus } = submission;
  return (
    fetchedTask?.type === BOUNTY_TYPE &&
    approvedAt &&
    (paymentStatus !== PAYMENT_STATUS.PAID || paymentStatus !== PAYMENT_STATUS.PROCESSING)
  );
};

const isBountyTypeOnBoard = ({ fetchedTask, orgBoard, podBoard }) => {
  return fetchedTask?.type === BOUNTY_TYPE && (orgBoard || podBoard);
};

const idNotEqual = (submission) => (taskSubmission) => taskSubmission.id !== submission?.id;

const updateColumns = ({ columns, submission, newInProgress, newDone }) => {
  if (columns[1].section) {
    const newInReview = (columns[1].section.tasks = columns[1].section.tasks.filter(idNotEqual(submission)));
    columns[1].tasks = newInProgress;
    columns[1].section.tasks = newInReview;
    columns[2].tasks = newDone;
    return columns;
  }
  const newInReview = (columns[2].tasks = columns[2].tasks.filter(idNotEqual(submission)));
  columns[1].tasks = newInProgress;
  columns[2].tasks = newInReview;
  columns[3].tasks = newDone;
  return columns;
};

const completeTask = ({ fetchedTask, boardColumns, submission }) => {
  if (!boardColumns) return;
  const newTask = {
    ...fetchedTask,
    completedAt: new Date(),
    status: TASK_STATUS_DONE,
  };
  const transformedTask = transformTaskToTaskCard(newTask, {});
  //TODO refactor this
  const columns = [...boardColumns?.columns];
  const newInProgress = columns[1].tasks.filter((task) => task.id !== fetchedTask.id);
  const newDone = [transformedTask, ...columns[2].tasks];
  const newColumns = updateColumns({ columns, submission, newInProgress, newDone });
  boardColumns?.setColumns(newColumns);
  //TODO: add pod board and user board
};

const nonBountyTypeCompletion = ({ fetchedTask, completeTask, setIsKudosForm, boardColumns, submission }) => {
  if (fetchedTask?.type !== BOUNTY_TYPE) {
    completeTask({ fetchedTask, boardColumns, submission });
    setIsKudosForm(true);
  }
};

const bountyTypeCompletion = ({ fetchedTask, orgBoard, podBoard, board, submission }) => {
  if (isBountyTypeOnBoard({ fetchedTask, orgBoard, podBoard })) {
    const columns = board?.columns.map((col) =>
      col.id === submission.taskId
        ? {
            ...col,
            approvedSubmissionsCount:
              (Number.isInteger(col.approvedSubmissionsCount) ? col.approvedSubmissionsCount : 0) + 1,
          }
        : col
    );
    board?.setColumns(columns);
  }
};

const useApproveSubmission = ({ submission, handleNonBountyTypeCompletion }) => {
  const [approveSubmission] = useMutation(APPROVE_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      handleNonBountyTypeCompletion();
    },
    refetchQueries: [
      'getTaskSubmissionsForTask',
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getUserTaskBoardTasks',
    ],
  });
  return approveSubmission;
};

const useApproveBountySubmission = ({ submission, handleBountyTypeCompletion, handleNonBountyTypeCompletion }) => {
  const [approveBountySubmission] = useMutation(APPROVE_BOUNTY_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      handleBountyTypeCompletion();
      handleNonBountyTypeCompletion();
    },
    refetchQueries: ['getTaskSubmissionsForTask'],
  });
  return approveBountySubmission;
};

const useRequestChangeTaskSubmission = ({ submission, handleBountyTypeCompletion }) => {
  const [requestChangeTaskSubmission] = useMutation(REQUEST_CHANGE_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      handleBountyTypeCompletion();
    },
    refetchQueries: ['getTaskSubmissionsForTask'],
  });
  return requestChangeTaskSubmission;
};

const SubmissionItemStatus = (props) => {
  const { submission } = props;
  const awaitingReview = !submission?.approvedAt && !submission?.changeRequestedAt && !submission.rejectedAt;
  const changesRequested = submission?.changeRequestedAt || submission?.rejectedAt;
  const approvedAndPaid = submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PAID;
  const approvedAndProcessingPayment =
    submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PROCESSING;
  const approvedAt = submission?.approvedAt;
  if (awaitingReview) {
    return (
      <SubmissionItemStatusWrapper>
        <InReviewIcon />
        <SubmissionItemStatusTextAwaitingReview>Awaiting review</SubmissionItemStatusTextAwaitingReview>
      </SubmissionItemStatusWrapper>
    );
  } else if (changesRequested) {
    return (
      <SubmissionItemStatusWrapper>
        <SubmissionItemStatusChangesRequestedIcon />
        <SubmissionItemStatusTextChangesRequested>Changes requested</SubmissionItemStatusTextChangesRequested>
      </SubmissionItemStatusWrapper>
    );
  } else if (approvedAndPaid) {
    return (
      <SubmissionItemStatusWrapper>
        <CompletedIcon />
        <SubmissionItemStatusTextCompleted>Approved and Paid</SubmissionItemStatusTextCompleted>
      </SubmissionItemStatusWrapper>
    );
  } else if (approvedAndProcessingPayment) {
    return (
      <SubmissionItemStatusWrapper>
        <CompletedIcon />
        <SubmissionItemStatusTextCompleted>Approved and Processing Payment</SubmissionItemStatusTextCompleted>
      </SubmissionItemStatusWrapper>
    );
  } else if (approvedAt) {
    return (
      <SubmissionItemStatusWrapper>
        <CompletedIcon />
        <SubmissionItemStatusTextCompleted>Approved</SubmissionItemStatusTextCompleted>
      </SubmissionItemStatusWrapper>
    );
  }
};

const SubmissionItemUserImage = ({ creatorProfilePicture }) => {
  if (creatorProfilePicture) return <SubmissionItemSafeImage src={creatorProfilePicture} />;
  return <DefaultUserImage />;
};

const SubmissionItemCreatedAt = ({ createdAt }) => {
  if (!createdAt) return null;
  const formattedDistance = formatDistance(new Date(createdAt), new Date(), {
    addSuffix: true,
  });
  return <SubmissionItemTimeText>{formattedDistance}</SubmissionItemTimeText>;
};

const SubmissionItemLink = ({ links }: { links: [] }) => {
  if (isEmpty(links)) return null;
  return (
    <TaskSubmissionLinkWrapper>
      {links?.map(({ url }, index) => (
        <TaskSubmissionLink key={index} href={url} target="_blank" rel="noopener noreferrer">
          <TaskSubmissionLinkIcon />
          {url}
        </TaskSubmissionLink>
      ))}
    </TaskSubmissionLinkWrapper>
  );
};

const SubmissionEditButton = ({ isCreator, approvedAt, onClick }) => {
  if (isCreator && !approvedAt) return <SubmissionButtonEdit onClick={onClick}>Edit submission</SubmissionButtonEdit>;
  return null;
};

const SubmissionRequestChangeButton = ({ submission, requestChangeTaskSubmission }) => {
  const { changeRequestedAt, approvedAt } = submission;
  if (changeRequestedAt || approvedAt) return null;
  return (
    <SubmissionButtonRequestChange onClick={requestChangeTaskSubmission}>Request changes</SubmissionButtonRequestChange>
  );
};

const SubmissionApproveTaskButton = ({ submission, fetchedTaskType, onClick }) => {
  if (!submission.approvedAt && fetchedTaskType === TASK_TYPE)
    return <SubmissionButtonApprove onClick={onClick}>Approve</SubmissionButtonApprove>;
  return null;
};

const SubmissionApproveBountyButton = ({ submission, fetchedTaskType, onClick }) => {
  if (!submission.approvedAt && fetchedTaskType === BOUNTY_TYPE)
    return <SubmissionButtonApprove onClick={onClick}>Approve</SubmissionButtonApprove>;
  return null;
};

const SubmissionReviewButtons = ({ canReview, fetchedTaskStatus, children }) => {
  if (canReview && fetchedTaskStatus !== TASK_STATUS_DONE)
    return <SubmissionButtonReviewWrapper>{children}</SubmissionButtonReviewWrapper>;
  return null;
};

const SubmissionBountyPaymentButton = ({
  fetchedTask,
  submission,
  fetchedTaskSubmissions,
  handleClose,
  getTaskSubmissionsForTask,
}) => {
  if (isBountyApprovedUnpaid({ fetchedTask, submission })) {
    return (
      <PaymentButton
        fetchedTask={fetchedTask}
        taskSubmissions={fetchedTaskSubmissions}
        handleClose={handleClose}
        getTaskSubmissionsForTask={getTaskSubmissionsForTask}
        submission={submission}
      />
    );
  }
  return null;
};

export const SubmissionItem = ({
  submission,
  setSubmissionToEdit,
  canReview,
  fetchedTask,
  fetchedTaskSubmissions,
  handleClose,
  user,
  getTaskSubmissionsForTask,
}) => {
  const handleEdit = () => {
    setSubmissionToEdit(submission);
  };
  const mediaUploads = submission?.media;
  const isCreator = user?.id === submission?.createdBy;
  const { orgBoard, podBoard, board } = useBoards();
  const boardColumns = useColumns();
  const [isKudosModalOpen, setIsKudosForm] = useState(false);
  const handleNonBountyTypeCompletion = () =>
    nonBountyTypeCompletion({ fetchedTask, completeTask, setIsKudosForm, boardColumns, submission });
  const handleBountyTypeCompletion = () => bountyTypeCompletion({ fetchedTask, orgBoard, podBoard, board, submission });
  const approveSubmission = useApproveSubmission({
    submission,
    handleNonBountyTypeCompletion,
  });
  const approveBountySubmission = useApproveBountySubmission({
    submission,
    handleBountyTypeCompletion,
    handleNonBountyTypeCompletion,
  });
  const requestChangeTaskSubmission = useRequestChangeTaskSubmission({
    submission,
    handleBountyTypeCompletion,
  });
  return (
    <>
      <KudosForm onClose={handleClose} open={isKudosModalOpen} submission={submission} />
      <SubmissionItemWrapper>
        <SubmissionItemHeader>
          <SubmissionItemHeaderContent>
            <SubmissionItemUserImage creatorProfilePicture={submission?.creatorProfilePicture} />
            <SubmissionItemCreator>{submission.creatorUsername}</SubmissionItemCreator>
            <SubmissionItemCreatedAt createdAt={submission.createdAt} />
          </SubmissionItemHeaderContent>
          <SubmissionItemStatus submission={submission} />
        </SubmissionItemHeader>
        <SubmissionDivider />
        <SubmissionItemSection>
          <SubmissionDescription>
            <RichTextViewer text={submission?.description} />
          </SubmissionDescription>
          <SubmissionItemsMedia media={mediaUploads} />
          <SubmissionItemLink links={submission?.links} />
        </SubmissionItemSection>
        <SubmissionDivider />
        <SubmissionItemFooter>
          <SubmissionEditButton isCreator={isCreator} approvedAt={submission.approvedAt} onClick={handleEdit} />
          <SubmissionReviewButtons canReview={canReview} fetchedTaskStatus={fetchedTask?.status}>
            <SubmissionRequestChangeButton
              submission={submission}
              requestChangeTaskSubmission={requestChangeTaskSubmission}
            />
            <SubmissionApproveTaskButton
              submission={submission}
              fetchedTaskType={fetchedTask?.type}
              onClick={approveSubmission}
            />
            <SubmissionApproveBountyButton
              submission={submission}
              fetchedTaskType={fetchedTask?.type}
              onClick={approveBountySubmission}
            />
          </SubmissionReviewButtons>
          <SubmissionBountyPaymentButton
            fetchedTask={fetchedTask}
            submission={submission}
            fetchedTaskSubmissions={fetchedTaskSubmissions}
            handleClose={handleClose}
            getTaskSubmissionsForTask={getTaskSubmissionsForTask}
          />
        </SubmissionItemFooter>
      </SubmissionItemWrapper>
    </>
  );
};
