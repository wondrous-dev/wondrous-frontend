import { useMutation } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import { UPDATE_TASK_STATUS } from 'graphql/mutations';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { delQuery } from 'utils';
import {
  ENTITIES_TYPES,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
} from 'utils/constants';
import { transformTaskSubmissionToTaskSubmissionCard, transformTaskToTaskCard } from 'utils/helpers';

import {
  SubmissionButtonCreate,
  SubmissionButtonTextHelper,
  SubmissionButtonWrapperBackground,
  SubmissionButtonWrapperGradient,
  TaskSubmissionEmptyStateIcon,
  TaskSubmissionEmptyStateText,
  TaskSubmissionEmptyStateContainer,
  TaskSubmissionItemsWrapper,
  TaskSubmissionsFormInactiveWrapper,
} from './styles';
import { TaskSubmissionsFilter } from './submissionFilter';
import { TaskSubmissionForm } from './submissionForm';
import { SubmissionItem } from './submissionItem';
import { SubmissionPayment } from './submissionPayment';

function SubmissionButtonWrapper({ onClick = null, buttonText = null, helperText = '' }) {
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
}

const inProgressMoveCompleted =
  ({ boardColumns, board }) =>
  (data) => {
    const task = data?.updateTaskStatus;
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

function TaskSubmissionsLoading({ loading }) {
  if (!loading) return null;
  return <CircularProgress />;
}

function TaskSubmissionsEmptyState() {
  return (
    <TaskSubmissionEmptyStateContainer>
      <TaskSubmissionEmptyStateIcon />
      <TaskSubmissionEmptyStateText>No submissions yet</TaskSubmissionEmptyStateText>
    </TaskSubmissionEmptyStateContainer>
  );
}

function TaskSubmissionsTaskToDo({ handleTaskProgressStatus, canSubmit, canMoveProgress, taskStatus }) {
  if (taskStatus === TASK_STATUS_TODO) {
    if (canSubmit || canMoveProgress) {
      return (
        <SubmissionButtonWrapper
          onClick={handleTaskProgressStatus}
          buttonText="Set Status to In-Progress"
          helperText="In order to submit, set this task to In-Progress."
        />
      );
    }
  }
  return null;
}

function TaskSubmissionsTaskInProgress({ canSubmit, taskStatus, setMakeSubmission }) {
  if (taskStatus === TASK_STATUS_IN_PROGRESS || taskStatus === TASK_STATUS_IN_REVIEW) {
    if (canSubmit) return <SubmissionButtonWrapper onClick={setMakeSubmission} buttonText="Make a submission" />;
  }
  return null;
}

function TaskSubmissionMakePayment({ taskStatus, fetchedTask, setShowPaymentModal, fetchedTaskSubmissions }) {
  if (taskStatus === TASK_STATUS_DONE && fetchedTask?.type === ENTITIES_TYPES.TASK) {
    return (
      <SubmissionPayment
        fetchedTask={fetchedTask}
        setShowPaymentModal={setShowPaymentModal}
        taskSubmissions={fetchedTaskSubmissions}
      />
    );
  }
  return null;
}

function TaskSubmissionsForm({
  makeSubmission,
  handleCancelSubmission,
  fetchedTaskSubmissions,
  orgId,
  fetchedTask,
  submissionToEdit,
}) {
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
}

function TaskSubmissionList({
  fetchedTaskSubmissions,
  setSubmissionToEdit,
  canReview,
  fetchedTask,
  handleClose,
  loggedInUser,
  getTaskSubmissionsForTask,
}) {
  return (
    <TaskSubmissionItemsWrapper>
      {fetchedTaskSubmissions?.map((taskSubmission) => (
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
      ))}
    </TaskSubmissionItemsWrapper>
  );
}

function TaskSubmissionsFormInactive({ makeSubmission, submissionToEdit, children }) {
  if (makeSubmission || submissionToEdit) return null;
  return <TaskSubmissionsFormInactiveWrapper>{children}</TaskSubmissionsFormInactiveWrapper>;
}

export function TaskSubmissions(props) {
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
    onCompleted: inProgressMoveCompleted({ boardColumns, board }),
  });
  const [makeSubmission, setMakeSubmission] = useState(false);
  const [submissionToEdit, setSubmissionToEdit] = useState(null);
  const [filteredSubmissions, setFilteredSubmissions] = useState();
  const listSubmissions = filteredSubmissions ?? fetchedTaskSubmissions;
  const taskStatus = fetchedTask?.status;
  const loggedInUser = useMe();
  const handleTaskProgressStatus = () => {
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
        <TaskSubmissionsFilter
          fetchedTaskSubmissions={fetchedTaskSubmissions}
          setFilteredSubmissions={setFilteredSubmissions}
        />
        {isBounty && !!loggedInUser && (
          <SubmissionButtonWrapper onClick={setMakeSubmission} buttonText="Make a submission" />
        )}
        {!isBounty && (
          <>
            <TaskSubmissionsTaskToDo
              canMoveProgress={canMoveProgress}
              canSubmit={canSubmit}
              handleTaskProgressStatus={handleTaskProgressStatus}
              taskStatus={taskStatus}
            />
            <TaskSubmissionsTaskInProgress
              canSubmit={canSubmit}
              setMakeSubmission={setMakeSubmission}
              taskStatus={taskStatus}
            />
            <TaskSubmissionMakePayment
              fetchedTask={fetchedTask}
              fetchedTaskSubmissions={fetchedTaskSubmissions}
              setShowPaymentModal={setShowPaymentModal}
              taskStatus={taskStatus}
            />
          </>
        )}
        {isEmpty(fetchedTaskSubmissions) && <TaskSubmissionsEmptyState />}
        <TaskSubmissionList
          fetchedTaskSubmissions={listSubmissions}
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
}
