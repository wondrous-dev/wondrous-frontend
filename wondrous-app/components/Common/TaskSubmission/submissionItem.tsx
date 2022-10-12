import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { CommentList } from 'components/Comment';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { RichTextViewer } from 'components/RichText';
import SubmissionStatus from 'components/Common/SubmissionStatus';
import Tooltip from 'components/Tooltip';
import { formatDistance } from 'date-fns';
import {
  APPROVE_BOUNTY_SUBMISSION,
  APPROVE_SUBMISSION,
  REQUEST_CHANGE_SUBMISSION,
  REJECT_SUBMISSION,
} from 'graphql/mutations/taskSubmission';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { BOUNTY_TYPE, PAYMENT_STATUS, SUBMISSION_STATUS, TASK_STATUS_DONE, TASK_TYPE } from 'utils/constants';
import { transformTaskToTaskCard } from 'utils/helpers';
import { useBoards, useColumns, useScrollIntoView } from 'utils/hooks';
import { useLocation } from 'utils/useLocation';

import DefaultUserImage from '../Image/DefaultUserImage';
import KudosForm from '../KudosForm';
import { PaymentButton } from '../Task/paymentButton';
import { TaskAction, TaskActionAmount } from '../Task/styles';
import {
  SubmissionButtonApprove,
  SubmissionButtonEdit,
  SubmissionButtonRequestChange,
  SubmissionButtonReject,
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
  SubmissionItemTimeText,
  SubmissionItemUserLink,
  SubmissionItemWrapper,
  TaskSubmissionLink,
  TaskSubmissionLinkIcon,
  TaskSubmissionLinkWrapper,
  TaskSubmissionLinkText,
} from './styles';
import GR15DEIModal from '../IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from '../IntiativesModal/GR15DEIModal/GR15DEILogo';
import { hasGR15DEIIntiative } from '../TaskViewModal/utils';

const isBountyApprovedUnpaid = ({ fetchedTask, submission }) => {
  const { approvedAt, paymentStatus } = submission;
  return (
    fetchedTask?.type === BOUNTY_TYPE &&
    approvedAt &&
    (paymentStatus !== PAYMENT_STATUS.PAID || paymentStatus !== PAYMENT_STATUS.PROCESSING)
  );
};

const isBountyTypeOnBoard = ({ fetchedTask, orgBoard, podBoard }) =>
  fetchedTask?.type === BOUNTY_TYPE && (orgBoard || podBoard);

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
  // TODO refactor this
  const columns = [...boardColumns?.columns];
  const newInProgress = columns[1].tasks.filter((task) => task.id !== fetchedTask.id);
  const newDone = [transformedTask, ...columns[2].tasks];
  const newColumns = updateColumns({ columns, submission, newInProgress, newDone });
  boardColumns?.setColumns(newColumns);
  // TODO: add pod board and user board
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

const useRejectTaskSubmission = ({ submission, handleBountyTypeCompletion }) => {
  const [rejectTaskSubmission] = useMutation(REJECT_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      handleBountyTypeCompletion();
    },
    refetchQueries: ['getTaskSubmissionsForTask'],
  });
  return rejectTaskSubmission;
};

const selectSubmissionStatus = (submission) => {
  if (!submission?.approvedAt && !submission?.changeRequestedAt && !submission.rejectedAt)
    return SUBMISSION_STATUS.AWAITING_REVIEW;
  if (submission?.changeRequestedAt) return SUBMISSION_STATUS.CHANGES_REQUESTED;
  if (submission?.rejectedAt) return SUBMISSION_STATUS.REJECTED;
  if (submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PAID)
    return SUBMISSION_STATUS.APPROVED_AND_PAID;
  if (submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PROCESSING)
    return SUBMISSION_STATUS.APPROVED_AND_PROCESSING_PAYMENT;
  if (submission?.approvedAt) return SUBMISSION_STATUS.APPROVED;
  return null;
};

export const SubmissionItemStatus = (props) => {
  const { submission } = props;
  const submissionStatus = selectSubmissionStatus(submission);
  return <SubmissionStatus status={submissionStatus} variation="rounded" />;
};

function SubmissionItemUserImage({ creatorProfilePicture }) {
  if (creatorProfilePicture) return <SubmissionItemSafeImage src={creatorProfilePicture} />;
  return <DefaultUserImage />;
}

function SubmissionItemUserWrapper({ creatorUsername, creatorProfilePicture, isGr15Contributor }) {
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  return (
    <Link href={`/profile/${creatorUsername}/about`} passHref>
      <SubmissionItemUserLink>
        <SubmissionItemUserImage creatorProfilePicture={creatorProfilePicture} />
        {isGr15Contributor && (
          <>
            <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
            <GR15DEILogo width="28" height="28" onClick={() => setOpenGR15Modal(true)} />
          </>
        )}
        <SubmissionItemCreator>{creatorUsername}</SubmissionItemCreator>
      </SubmissionItemUserLink>
    </Link>
  );
}

function SubmissionItemCreatedAt({ createdAt }) {
  if (!createdAt) return null;
  const formattedDistance = formatDistance(new Date(createdAt), new Date(), {
    addSuffix: true,
  });
  return <SubmissionItemTimeText>{formattedDistance}</SubmissionItemTimeText>;
}

function SubmissionItemLink({ links }: { links: [] }) {
  if (isEmpty(links)) return null;
  return (
    <TaskSubmissionLinkWrapper>
      {links?.map(({ url }, index) => (
        <TaskSubmissionLink key={index} href={url} target="_blank" rel="noopener noreferrer">
          <TaskSubmissionLinkIcon />
          <TaskSubmissionLinkText data-cy="submission-link-url">{url}</TaskSubmissionLinkText>
        </TaskSubmissionLink>
      ))}
    </TaskSubmissionLinkWrapper>
  );
}

function SubmissionShowComments({ setShowComments, commentCount, showComments }) {
  return (
    <Tooltip title="Submission comments" placement="top">
      <TaskAction onClick={() => setShowComments(!showComments)}>
        <TaskCommentIcon />
        {commentCount > 0 && <TaskActionAmount>{commentCount}</TaskActionAmount>}
      </TaskAction>
    </Tooltip>
  );
}

function SubmissionEditButton({ isCreator, approvedAt, onClick }) {
  if (isCreator && !approvedAt) return <SubmissionButtonEdit onClick={onClick}>Edit submission</SubmissionButtonEdit>;
  return null;
}

function SubmissionRejectButton({ submission, rejectTaskSubmission }) {
  const { rejectedAt, paymentStatus } = submission;
  const hasBeenPaidOrIsBeingProcessed =
    paymentStatus === PAYMENT_STATUS.PAID || paymentStatus === PAYMENT_STATUS.PROCESSING;
  if (rejectedAt || hasBeenPaidOrIsBeingProcessed) return null;
  return <SubmissionButtonReject onClick={rejectTaskSubmission}>Reject</SubmissionButtonReject>;
}

function SubmissionRequestChangeButton({ submission, requestChangeTaskSubmission }) {
  const { changeRequestedAt, approvedAt, rejectedAt } = submission;
  if (changeRequestedAt || approvedAt || rejectedAt) return null;
  return (
    <SubmissionButtonRequestChange onClick={requestChangeTaskSubmission}>Request changes</SubmissionButtonRequestChange>
  );
}

function SubmissionApproveTaskButton({ submission, fetchedTaskType, onClick }) {
  if (!submission.approvedAt && fetchedTaskType === TASK_TYPE)
    return (
      <SubmissionButtonApprove data-cy="button-approve" onClick={onClick}>
        Approve
      </SubmissionButtonApprove>
    );
  return null;
}

function SubmissionApproveBountyButton({ submission, fetchedTaskType, onClick }) {
  if (!submission.approvedAt && fetchedTaskType === BOUNTY_TYPE)
    return <SubmissionButtonApprove onClick={onClick}>Approve</SubmissionButtonApprove>;
  return null;
}

function SubmissionReviewButtons({ canReview, fetchedTaskStatus, children }) {
  if (canReview && fetchedTaskStatus !== TASK_STATUS_DONE)
    return <SubmissionButtonReviewWrapper>{children}</SubmissionButtonReviewWrapper>;
  return null;
}

function SubmissionBountyPaymentButton({
  fetchedTask,
  submission,
  fetchedTaskSubmissions,
  handleClose,
  getTaskSubmissionsForTask,
}) {
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
}

export function SubmissionItem({
  submission,
  setSubmissionToEdit,
  canReview,
  fetchedTask,
  fetchedTaskSubmissions,
  handleClose,
  user,
  getTaskSubmissionsForTask,
}) {
  const handleEdit = () => {
    setSubmissionToEdit(submission);
  };
  const location = useLocation();
  const mediaUploads = submission?.media;
  const isCreator = user?.id === submission?.createdBy;
  const canComment = user?.id === submission?.createdBy || canReview;
  const { orgBoard, podBoard, board } = useBoards();
  const boardColumns = useColumns();
  const [isKudosModalOpen, setIsKudosForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const handleNonBountyTypeCompletion = () =>
    nonBountyTypeCompletion({ fetchedTask, completeTask, setIsKudosForm, boardColumns, submission });
  const handleBountyTypeCompletion = () => bountyTypeCompletion({ fetchedTask, orgBoard, podBoard, board, submission });
  const isFocused = location?.params?.taskSubmissionId === submission.id;
  const submissionRef = useScrollIntoView(isFocused);

  useEffect(
    () => () => {
      if (isFocused) {
        const { taskSubmissionId, ...rest } = location?.params;
        const params = new URLSearchParams(rest);
        const newUrl = `${location.pathname}&${params.toString()}`;
        location.replace(newUrl);
      }
    },
    []
  );

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
  const rejectTaskSubmission = useRejectTaskSubmission({
    submission,
    handleBountyTypeCompletion,
  });

  return (
    <>
      <KudosForm onClose={handleClose} open={isKudosModalOpen} submission={submission} />
      <SubmissionItemWrapper ref={submissionRef} highlight={isFocused}>
        <SubmissionItemHeader>
          <SubmissionItemHeaderContent>
            <SubmissionItemUserWrapper
              creatorUsername={submission?.creatorUsername}
              creatorProfilePicture={submission?.creatorProfilePicture}
              isGr15Contributor={
                hasGR15DEIIntiative(fetchedTask?.categories) &&
                submission?.creator?.checkIsGr15Contributor?.isGr15Contributor
              }
            />
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
          <SubmissionShowComments
            setShowComments={setShowComments}
            commentCount={submission?.commentCount}
            showComments={showComments}
          />
          <div
            style={{
              flex: 1,
            }}
          />
          <SubmissionEditButton isCreator={isCreator} approvedAt={submission.approvedAt} onClick={handleEdit} />
          <SubmissionReviewButtons canReview={canReview} fetchedTaskStatus={fetchedTask?.status}>
            <SubmissionRejectButton submission={submission} rejectTaskSubmission={rejectTaskSubmission} />
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
        {showComments && <CommentList submission={submission} />}
      </SubmissionItemWrapper>
    </>
  );
}
