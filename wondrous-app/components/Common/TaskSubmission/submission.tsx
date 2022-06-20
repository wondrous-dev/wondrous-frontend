import { useMutation } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import { UPDATE_TASK_STATUS } from 'graphql/mutations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { delQuery } from 'utils';
import { ENTITIES_TYPES, TASK_STATUS_DONE, TASK_STATUS_IN_PROGRESS, TASK_STATUS_TODO } from 'utils/constants';
import { transformTaskSubmissionToTaskSubmissionCard, transformTaskToTaskCard } from 'utils/helpers';
import {
  SubmissionButtonCreate,
  SubmissionButtonTextHelper,
  SubmissionButtonWrapperBackground,
  SubmissionButtonWrapperGradient,
  TaskSubmissionItemsWrapper,
} from './styles';
import { TaskSubmissionForm } from './submissionForm';
import { SubmissionItem } from './submissionItem';
import { SubmissionPayment } from './submissionPayment';

const SubmissionButtonWrapper = ({ onClick = null, buttonText = null, helperText = '' }) => {
  return (
    <SubmissionButtonWrapperGradient>
      <SubmissionButtonWrapperBackground>
        {buttonText && (
          <SubmissionButtonCreate onClick={onClick} show={buttonText}>
            {buttonText}
          </SubmissionButtonCreate>
        )}
        {helperText && <SubmissionButtonTextHelper>{helperText}</SubmissionButtonTextHelper>}
      </SubmissionButtonWrapperBackground>
    </SubmissionButtonWrapperGradient>
  );
};

const inProgressMoveCompleted = ({ handleClose, boardColumns, board }) => {
  return (data) => {
    const task = data?.updateTaskStatus;
    handleClose();
    if (boardColumns?.setColumns) {
      const transformedTask = transformTaskToTaskCard(task, {});
      if (board?.entityType && board?.entityType === ENTITIES_TYPES.BOUNTY) {
        const newColumns = boardColumns?.columns.map((col) => (col.id === transformedTask.id ? transformedTask : col));
        boardColumns?.setColumns(newColumns);
        return;
      }
      const columns = [...boardColumns?.columns];
      columns[0].tasks = columns[0].tasks.filter((existingTask) => {
        if (transformedTask?.id !== existingTask?.id) {
          return true;
        }
        return false;
      });
      columns[1].tasks = [transformedTask, ...columns[1].tasks];
      boardColumns?.setColumns(columns);
    }
  };
};

const TaskSubmissionsLoading = ({ loading }) => {
  if (!loading) return null;
  return <CircularProgress />;
};

const TaskSubmissionsMoveToProgress = ({
  handleTaskProgressStatus,
  canSubmit,
  canMoveProgress,
  taskStatus,
  isBounty,
}) => {
  if ((canSubmit || canMoveProgress) && taskStatus === TASK_STATUS_TODO && !isBounty)
    return (
      <SubmissionButtonWrapper
        onClick={handleTaskProgressStatus}
        buttonText="Set Status to In-Progress"
        helperText="In order to submit, set this task to In-Progress."
      />
    );
  return null;
};

const TaskSubmissionsNotAssigned = ({ canSubmit, fetchedTaskSubmissionsLength, taskStatus }) => {
  if (!canSubmit && fetchedTaskSubmissionsLength === 0 && taskStatus === TASK_STATUS_IN_PROGRESS)
    return (
      <SubmissionButtonWrapper helperText={`No submissions yet. Only the assignee can make the first submission.`} />
    );
  return null;
};

const TaskSubmissionsMakeSubmissions = ({ canSubmit, taskStatus, setMakeSubmission, isBounty }) => {
  if (canSubmit && (isBounty || taskStatus === TASK_STATUS_IN_PROGRESS))
    return <SubmissionButtonWrapper onClick={setMakeSubmission} buttonText="Make a submission" />;
  return null;
};

const TaskSubmissionsForm = ({
  makeSubmission,
  handleCancelSubmission,
  fetchedTaskSubmissions,
  orgId,
  fetchedTask,
  submissionToEdit,
}) => {
  if (makeSubmission)
    return (
      <TaskSubmissionForm
        cancelSubmissionForm={handleCancelSubmission}
        fetchedTaskSubmissions={fetchedTaskSubmissions}
        orgId={orgId}
        taskId={fetchedTask?.id}
      />
    );
  if (submissionToEdit)
    return (
      <TaskSubmissionForm
        cancelSubmissionForm={handleCancelSubmission}
        orgId={orgId}
        submissionToEdit={submissionToEdit}
        taskId={fetchedTask?.id}
      />
    );
  return null;
};

const TaskSubmissionList = ({
  fetchedTaskSubmissions,
  setSubmissionToEdit,
  canReview,
  fetchedTask,
  handleClose,
  loggedInUser,
  getTaskSubmissionsForTask,
}) => {
  return (
    <TaskSubmissionItemsWrapper>
      {fetchedTaskSubmissions?.map((taskSubmission) => {
        return (
          <SubmissionItem
            setSubmissionToEdit={setSubmissionToEdit}
            key={taskSubmission?.id}
            canReview={canReview}
            fetchedTask={fetchedTask}
            handleClose={handleClose}
            fetchedTaskSubmissions={fetchedTaskSubmissions}
            submission={transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {})}
            user={loggedInUser}
            getTaskSubmissionsForTask={getTaskSubmissionsForTask}
          />
        );
      })}
    </TaskSubmissionItemsWrapper>
  );
};

const TaskSubmissionMakePayment = ({ taskStatus, fetchedTask, setShowPaymentModal, fetchedTaskSubmissions }) => {
  if (taskStatus === TASK_STATUS_DONE && fetchedTask?.type === ENTITIES_TYPES.TASK)
    return (
      <SubmissionPayment
        fetchedTask={fetchedTask}
        setShowPaymentModal={setShowPaymentModal}
        taskSubmissions={fetchedTaskSubmissions}
      />
    );
  return null;
};

const TaskSubmissionsFormInactive = ({ makeSubmission, submissionToEdit, children }) => {
  if (makeSubmission || submissionToEdit) return null;
  return children;
};

export const TaskSubmissions = (props) => {
  const {
    board,
    boardColumns,
    canMoveProgress,
    canReview,
    canSubmit,
    fetchedTask,
    fetchedTaskSubmissions,
    getTaskSubmissionsForTask,
    handleClose,
    isBounty,
    orgId,
    setShowPaymentModal,
    taskSubmissionLoading,
  } = props;
  const router = useRouter();
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS, {
    onCompleted: inProgressMoveCompleted({ handleClose, boardColumns, board }),
  });
  const [makeSubmission, setMakeSubmission] = useState(false);
  const [submissionToEdit, setSubmissionToEdit] = useState(null);
  const taskStatus = fetchedTask?.status;
  const fetchedTaskSubmissionsLength = fetchedTaskSubmissions?.length;
  const loggedInUser = useMe();

  const handleTaskProgressStatus = () => {
    router.push(`${delQuery(router.asPath)}`, undefined, {
      shallow: true,
    });
    handleClose();
    updateTaskStatus({
      variables: {
        taskId: fetchedTask?.id,
        input: {
          newStatus: TASK_STATUS_IN_PROGRESS,
        },
      },
    });
  };

  const handleCancelSubmission = () => {
    setMakeSubmission(false);
    setSubmissionToEdit(null);
  };

  return (
    <>
      <TaskSubmissionsLoading loading={taskSubmissionLoading} />
      <TaskSubmissionsForm
        makeSubmission={makeSubmission}
        handleCancelSubmission={handleCancelSubmission}
        fetchedTaskSubmissions={fetchedTaskSubmissions}
        orgId={orgId}
        fetchedTask={fetchedTask}
        submissionToEdit={submissionToEdit}
      />
      <TaskSubmissionsFormInactive submissionToEdit={submissionToEdit} makeSubmission={makeSubmission}>
        <TaskSubmissionsMoveToProgress
          handleTaskProgressStatus={handleTaskProgressStatus}
          canSubmit={canSubmit}
          canMoveProgress={canMoveProgress}
          taskStatus={taskStatus}
          isBounty={isBounty}
        />
        <TaskSubmissionsNotAssigned
          canSubmit={canSubmit}
          taskStatus={taskStatus}
          fetchedTaskSubmissionsLength={fetchedTaskSubmissionsLength}
        />
        <TaskSubmissionsMakeSubmissions
          canSubmit={canSubmit}
          taskStatus={taskStatus}
          setMakeSubmission={setMakeSubmission}
          isBounty={isBounty}
        />
        <TaskSubmissionMakePayment
          taskStatus={taskStatus}
          fetchedTask={fetchedTask}
          setShowPaymentModal={setShowPaymentModal}
          fetchedTaskSubmissions={fetchedTaskSubmissions}
        />
        <TaskSubmissionList
          fetchedTaskSubmissions={fetchedTaskSubmissions}
          setSubmissionToEdit={setSubmissionToEdit}
          canReview={canReview}
          fetchedTask={fetchedTask}
          handleClose={handleClose}
          loggedInUser={loggedInUser}
          getTaskSubmissionsForTask={getTaskSubmissionsForTask}
        />
      </TaskSubmissionsFormInactive>
    </>
  );
};
