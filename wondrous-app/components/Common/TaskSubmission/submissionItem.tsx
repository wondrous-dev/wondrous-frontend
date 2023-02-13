import { useMutation } from '@apollo/client';
import { Grid } from '@mui/material';
import CommentList from 'components/Comment';
import SubmissionStatus from 'components/Common/SubmissionStatus';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { RichTextViewer } from 'components/RichText';
import Tooltip from 'components/Tooltip';
import {
  APPROVE_BOUNTY_SUBMISSION,
  APPROVE_SUBMISSION,
  REJECT_SUBMISSION,
  REOPEN_SUBMISSION,
  REQUEST_CHANGE_SUBMISSION,
  RESUBMIT_SUBMISSION,
} from 'graphql/mutations/taskSubmission';
import isEmpty from 'lodash/isEmpty';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  BOUNTY_TYPE,
  PAYMENT_STATUS,
  SUBMISSION_COMMENT_TYPE,
  SUBMISSION_STATUS,
  TASK_STATUS_DONE,
  TASK_STATUS_PAID,
  TASK_TYPE,
} from 'utils/constants';
import { transformTaskToTaskCard } from 'utils/helpers';
import { useBoards, useColumns, useScrollIntoView } from 'utils/hooks';
import { formatDateDisplay } from 'utils/board';

import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import SubmittableCommentType from 'components/Common/SubmittableCommentType';
import SubmissionPaymentButton from 'components/Common/Task/SubmissionPaymentButton';
import { TaskAction, TaskActionAmount } from 'components/Common/Task/styles';
import { hasGR15DEIIntiative } from 'components/Common/TaskViewModal/utils';
import PlusIcon from 'components/Icons/plus';
import { GET_ORG_TASK_BOARD_TASKS } from 'graphql/queries';
import {
  GiveKudosButton,
  SubmissionButtonApprove,
  SubmissionButtonEdit,
  SubmissionButtonReject,
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
  SubmissionItemTimeText,
  SubmissionItemUserLink,
  SubmissionItemWrapper,
  TaskSubmissionLink,
  TaskSubmissionLinkIcon,
  TaskSubmissionLinkText,
  TaskSubmissionLinkWrapper,
} from './styles';
import { NoUnderlineLink } from '../Link/links';

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

const nonBountyTypeCompletion = ({ fetchedTask, completeTask, boardColumns, submission }) => {
  if (fetchedTask?.type !== BOUNTY_TYPE) completeTask({ fetchedTask, boardColumns, submission });
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

const useResubmitTaskSubmission = ({ submission }) => {
  const [resubmitSubmission] = useMutation(RESUBMIT_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    refetchQueries: ['getTaskSubmissionsForTask'],
  });
  return resubmitSubmission;
};

const useReopenTaskSubmission = ({ submission }) => {
  const [resubmitSubmission] = useMutation(REOPEN_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    refetchQueries: ['getTaskSubmissionsForTask', GET_ORG_TASK_BOARD_TASKS],
  });
  return resubmitSubmission;
};

export const selectSubmissionStatus = (submission) => {
  if (!submission?.approvedAt && !submission?.changeRequestedAt && !submission.rejectedAt)
    return SUBMISSION_STATUS.AWAITING_REVIEW;
  if (submission?.changeRequestedAt) return SUBMISSION_STATUS.CHANGE_REQUESTED;
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
  return <SubmissionStatus status={submissionStatus} />;
};

function SubmissionItemUserImage({ creatorProfilePicture }) {
  if (creatorProfilePicture) return <SubmissionItemSafeImage src={creatorProfilePicture} />;
  return <DefaultUserImage />;
}

export function SubmissionItemUserWrapper({ creatorUsername, creatorProfilePicture, isGr15Contributor = false }) {
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  return (
    <NoUnderlineLink href={`/profile/${creatorUsername}/about`} passHref>
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
    </NoUnderlineLink>
  );
}

function SubmissionItemCreatedAt({ createdAt }) {
  if (!createdAt) return null;
  const formattedDistance = formatDateDisplay(createdAt);
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

export function SubmissionShowComments({
  setShowComments,
  setShowCommentBox,
  commentCount,
  showComments,
  setCommentType,
  title = 'Submission comments',
}) {
  return (
    <Tooltip title={title} placement="top">
      <TaskAction
        onClick={() => {
          setShowComments(!showComments);
          setCommentType(null);
          setShowCommentBox(!showComments);
        }}
      >
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

function SubmissionRejectButton({ submission, rejectTaskSubmission, commentType }) {
  const { approvedAt, rejectedAt, paymentStatus } = submission;
  const hasBeenPaidOrIsBeingProcessed =
    paymentStatus === PAYMENT_STATUS.PAID || paymentStatus === PAYMENT_STATUS.PROCESSING;
  if (approvedAt || rejectedAt || hasBeenPaidOrIsBeingProcessed) return null;
  return (
    <SubmissionButtonReject onClick={rejectTaskSubmission} selected={!commentType}>
      Reject
    </SubmissionButtonReject>
  );
}

function SubmissionRequestChangeButton({
  submission,
  setShowComments,
  setShowCommentBox,
  setCommentType,
  commentType,
}) {
  const selected = commentType ? commentType === SUBMISSION_COMMENT_TYPE.CHANGE_REQUESTED : true;
  const { changeRequestedAt, approvedAt, rejectedAt } = submission;
  if (changeRequestedAt || approvedAt || rejectedAt) return null;
  const handleOnClick = () => {
    setCommentType(SUBMISSION_COMMENT_TYPE.CHANGE_REQUESTED);
    setShowComments(false);
    setShowCommentBox(true);
  };
  return (
    <SubmissionButtonRequestChange onClick={handleOnClick} selected={selected}>
      Request changes
    </SubmissionButtonRequestChange>
  );
}

function ResubmitTaskSubmissionButton({
  submission,
  setShowComments,
  setShowCommentBox,
  setCommentType,
  commentType,
  isCreator,
  onClick,
}) {
  const selected = commentType ? commentType === SUBMISSION_COMMENT_TYPE.RESUBMIT : true;
  const { changeRequestedAt, approvedAt, rejectedAt } = submission;
  if (!isCreator || !changeRequestedAt || approvedAt || rejectedAt) return null;
  const handleOnClick = () => {
    setCommentType(null);
    setShowComments(true);
    setShowCommentBox(true);
    onClick();
  };
  return (
    <SubmissionButtonRequestChange onClick={handleOnClick} selected={selected}>
      Resubmit Task Submission
    </SubmissionButtonRequestChange>
  );
}

function ReopenTaskSubmission({ submission, setCommentType, onClick }) {
  const { approvedAt, rejectedAt, paymentStatus } = submission;
  if (!(approvedAt || rejectedAt) || paymentStatus === TASK_STATUS_PAID) return null;
  const text = approvedAt ? 'Undo approval' : 'Undo rejection';
  const handleOnClick = () => {
    setCommentType(null);
    onClick();
  };
  return (
    <SubmissionButtonRequestChange onClick={handleOnClick} selected>
      {text}
    </SubmissionButtonRequestChange>
  );
}

function SubmissionApproveTaskButton({
  submission,
  fetchedTaskType,
  setCommentType,
  setShowComments,
  setShowCommentBox,
  approveSubmission,
  commentType,
}) {
  const selected = commentType ? commentType === SUBMISSION_COMMENT_TYPE.APPROVED : true;
  const { approvedAt, rejectedAt } = submission;
  const handleOnClick = () => {
    setCommentType(SUBMISSION_COMMENT_TYPE.APPROVED);
    approveSubmission();
    setShowComments(false);
    setShowCommentBox(false);
  };
  if (!(approvedAt || rejectedAt) && fetchedTaskType === TASK_TYPE)
    return (
      <SubmissionButtonApprove data-cy="button-approve" onClick={handleOnClick} selected={selected}>
        Approve
      </SubmissionButtonApprove>
    );
  return null;
}

function SubmissionApproveBountyButton({ submission, fetchedTaskType, onClick, commentType }) {
  const selected = commentType ? commentType === SUBMISSION_COMMENT_TYPE.APPROVED : true;
  if (!submission.approvedAt && fetchedTaskType === BOUNTY_TYPE)
    return (
      <SubmissionButtonApprove onClick={onClick} selected={selected}>
        Approve
      </SubmissionButtonApprove>
    );
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
  const mediaUploads = submission?.media;
  const router = useRouter();
  const isCreator = user?.id === submission?.createdBy;
  const { orgBoard, podBoard, board } = useBoards();
  const boardColumns = useColumns();
  const [showComments, setShowComments] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentType, setCommentType] = useState(null);
  const handleNonBountyTypeCompletion = () =>
    nonBountyTypeCompletion({ fetchedTask, completeTask, boardColumns, submission });
  const handleBountyTypeCompletion = () => bountyTypeCompletion({ fetchedTask, orgBoard, podBoard, board, submission });
  const isFocused = router?.query?.taskSubmissionId === submission.id;
  const submissionRef = useScrollIntoView(isFocused);

  useEffect(
    () => () => {
      if (isFocused) {
        const query = { ...router.query };
        delete query.taskSubmissionId;

        router.push({ query }, undefined, { scroll: false, shallow: true });
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

  const resubmitTaskSubmission = useResubmitTaskSubmission({
    submission,
  });

  const reopenTask = useReopenTaskSubmission({
    submission,
  });

  const commentCallback = {
    [SUBMISSION_COMMENT_TYPE.CHANGE_REQUESTED]: () => {
      requestChangeTaskSubmission();
      setShowComments(true);
      setCommentType(null);
    },
    [SUBMISSION_COMMENT_TYPE.APPROVED]: () => {
      setShowComments(true);
      setCommentType(null);
    },
  };

  const showKudosOption = !showComments && !showCommentBox && commentType === SUBMISSION_COMMENT_TYPE.APPROVED;

  const isSubmissionStatusUpdated = submission?.approvedAt || submission?.rejectedAt;
  const hasBeenPaidOrIsBeingProcessed =
    submission?.paymentStatus === PAYMENT_STATUS.PAID || submission?.paymentStatus === PAYMENT_STATUS.PROCESSING;

  const showRequestChangeButton = !(submission?.changeRequestedAt || isSubmissionStatusUpdated);
  const showRejectButton = !(isSubmissionStatusUpdated || hasBeenPaidOrIsBeingProcessed);
  const showApproveButton = !isSubmissionStatusUpdated && fetchedTask?.type === TASK_TYPE;
  const showApproveBountyButton = !submission.approvedAt && fetchedTask?.type === BOUNTY_TYPE;

  const showSubmissionReviewButtons =
    showRequestChangeButton || showRejectButton || showApproveButton || showApproveBountyButton;

  const showReopenTaskAndBountyButtons =
    isSubmissionStatusUpdated || isBountyApprovedUnpaid({ fetchedTask, submission });

  return (
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
        <SubmissionDescription as="div">
          <RichTextViewer text={submission?.description} />
        </SubmissionDescription>
        <SubmissionItemsMedia media={mediaUploads} />
        <SubmissionItemLink links={submission?.links} />
      </SubmissionItemSection>
      <SubmissionDivider />
      <SubmissionItemFooter>
        <Grid
          flex={1}
          width="100%"
          display="flex"
          justifyContent="space-between"
          container
          alignItems="center"
          paddingBottom={{ sm: '0px', xs: isSubmissionStatusUpdated ? '10px' : '0px' }}
        >
          <Grid
            item
            lg={4}
            md={12}
            sm={4}
            xs={12}
            width="100%"
            justifyContent={{ lg: 'flex-start', md: 'space-between', sm: 'flex-start', xs: 'space-between' }}
            paddingY={{ ld: '10px', md: '10px', sm: '0px', xs: '10px' }}
          >
            <Grid container>
              <SubmissionShowComments
                setShowComments={setShowComments}
                setShowCommentBox={setShowCommentBox}
                commentCount={submission?.commentCount}
                showComments={showComments}
                setCommentType={setCommentType}
              />
              <SubmissionEditButton isCreator={isCreator} approvedAt={submission.approvedAt} onClick={handleEdit} />
            </Grid>
          </Grid>
          <Grid
            lg={8}
            md={12}
            sm={8}
            xs={12}
            flexWrap="wrap"
            item
            display="flex"
            flexDirection={{ sm: 'row', xs: 'column' }}
            paddingY={{ lg: '0px', md: '10px', sm: '0px', xs: '10px' }}
            justifyContent={{ lg: 'flex-end', md: 'flex-start', sm: 'flex-end', xs: 'flex-start' }}
            borderTop={{ lg: 'none', md: '1px solid #343434', sm: 'none', xs: '1px solid #343434' }}
            gap="10px"
          >
            <ResubmitTaskSubmissionButton
              submission={submission}
              setShowComments={setShowComments}
              setShowCommentBox={setShowCommentBox}
              setCommentType={setCommentType}
              commentType={commentType}
              isCreator={isCreator}
              onClick={resubmitTaskSubmission}
            />
            {showSubmissionReviewButtons && canReview && fetchedTask?.status !== TASK_STATUS_DONE && (
              <SubmissionButtonReviewWrapper>
                <SubmissionRejectButton
                  submission={submission}
                  rejectTaskSubmission={rejectTaskSubmission}
                  commentType={commentType}
                />
                <SubmissionRequestChangeButton
                  submission={submission}
                  setShowComments={setShowComments}
                  setShowCommentBox={setShowCommentBox}
                  setCommentType={setCommentType}
                  commentType={commentType}
                />
                <SubmissionApproveTaskButton
                  submission={submission}
                  fetchedTaskType={fetchedTask?.type}
                  setCommentType={setCommentType}
                  setShowComments={setShowComments}
                  setShowCommentBox={setShowCommentBox}
                  approveSubmission={approveSubmission}
                  commentType={commentType}
                />
                <SubmissionApproveBountyButton
                  submission={submission}
                  fetchedTaskType={fetchedTask?.type}
                  onClick={approveBountySubmission}
                  commentType={commentType}
                />
              </SubmissionButtonReviewWrapper>
            )}
            {showReopenTaskAndBountyButtons && (
              <SubmissionButtonReviewWrapper>
                {canReview && (
                  <ReopenTaskSubmission submission={submission} setCommentType={setCommentType} onClick={reopenTask} />
                )}
                {isBountyApprovedUnpaid({ fetchedTask, submission }) && (
                  <SubmissionPaymentButton
                    fetchedTask={fetchedTask}
                    taskSubmissions={fetchedTaskSubmissions}
                    handleClose={handleClose}
                    getTaskSubmissionsForTask={getTaskSubmissionsForTask}
                    submission={submission}
                  />
                )}
              </SubmissionButtonReviewWrapper>
            )}
          </Grid>
        </Grid>
      </SubmissionItemFooter>
      {showKudosOption && (
        <div>
          <SubmittableCommentType status={commentType} text="Submission Approved!" />
          <GiveKudosButton
            onClick={() => {
              setCommentType(SUBMISSION_COMMENT_TYPE.APPROVED);
              setShowCommentBox(true);
            }}
          >
            <PlusIcon /> Give {submission?.creator?.username} kudos
          </GiveKudosButton>
        </div>
      )}
      <CommentList
        submission={submission}
        task={fetchedTask}
        type={commentType}
        onCommentCallback={commentCallback[commentType]}
        showCommentBox={showCommentBox}
        showComments={showComments}
      />
    </SubmissionItemWrapper>
  );
}
