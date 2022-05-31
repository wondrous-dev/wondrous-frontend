import React, { useState } from 'react';
import { TaskTabText } from './styles';
import { transformTaskSubmissionToTaskSubmissionCard, transformTaskToTaskCard } from 'utils/helpers';
import {
  ENTITIES_TYPES,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
  TASK_STATUS_ARCHIVED,
} from 'utils/constants';
import { useMe } from '../../Auth/withAuth';
import { CreateFormPreviewButton } from '../../CreateEntity/styles';
import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import { delQuery } from 'utils';
import { MakePaymentBlock } from './payment';
import TaskSubmissionForm from './TaskSubmissionForm';
import MakeSubmissionBlock from './MakeSubmissionBlock';
import SubmissionItem from './SubmissionItem';

export const TaskSubmissionContent = (props) => {
  const {
    taskSubmissionLoading,
    canSubmit,
    fetchedTask,
    setFetchedTask,
    updateTaskStatus,
    fetchedTaskSubmissions,
    board,
    boardColumns,
    canMoveProgress,
    canReview,
    setMakeSubmission,
    makeSubmission,
    orgId,
    setFetchedTaskSubmissions,
    handleClose,
    setShowPaymentModal,
    getTaskSubmissionsForTask,
    isBounty,
  } = props;

  const router = useRouter();
  const [submissionToEdit, setSubmissionToEdit] = useState(null);
  const [requestChanges, setRequestChanges] = useState(null);
  const [moveProgressButton, setMoveProgressButton] = useState(true);
  const taskStatus = fetchedTask?.status;
  const fetchedTaskSubmissionsLength = fetchedTaskSubmissions?.length;
  const loggedInUser = useMe();

  const handleTaskProgressStatus = () => {
    setMoveProgressButton(false);
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
      onCompleted: (data) => {
        const task = data?.updateTaskStatus;
        handleClose();
        if (boardColumns?.setColumns) {
          const transformedTask = transformTaskToTaskCard(task, {});
          if (board?.entityType && board?.entityType === ENTITIES_TYPES.BOUNTY) {
            const newColumns = boardColumns?.columns.map((col) =>
              col.id === transformedTask.id ? transformedTask : col
            );
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
      },
    });
  };

  if (taskSubmissionLoading) {
    return <CircularProgress />;
  }
  if ((canSubmit || canMoveProgress) && fetchedTask?.status === TASK_STATUS_TODO && moveProgressButton && !isBounty) {
    return (
      <div
      // style={{
      //   display: 'flex',
      //   alignItems: 'center',
      // }}
      >
        <TaskTabText>To submit tasask submissions please first move this to in progress</TaskTabText>
        <CreateFormPreviewButton
          style={{
            marginTop: '16px',
          }}
          onClick={handleTaskProgressStatus}
        >
          Set to in progress
        </CreateFormPreviewButton>
      </div>
    );
  }
  if (!canSubmit && fetchedTaskSubmissionsLength === 0 && fetchedTask?.assigneeUsername) {
    return (
      <TaskTabText>None at the moment. Only @{fetchedTask?.assigneeUsername} can create a submission </TaskTabText>
    );
  }
  if (canSubmit && fetchedTaskSubmissionsLength === 0) {
    return (
      <>
        {makeSubmission ? (
          <TaskSubmissionForm
            setFetchedTaskSubmissions={setFetchedTaskSubmissions}
            cancelSubmissionForm={() => setMakeSubmission(false)}
            fetchedTaskSubmissions={fetchedTaskSubmissions}
            orgId={orgId}
            taskId={fetchedTask?.id}
          />
        ) : (
          <MakeSubmissionBlock
            fetchedTask={fetchedTask}
            prompt={'Submit deliverables'}
            setMakeSubmission={setMakeSubmission}
            canSubmit={canSubmit}
            loggedInUser={loggedInUser}
          />
        )}
      </>
    );
  }
  if (makeSubmission && submissionToEdit) {
    return (
      <TaskSubmissionForm
        setFetchedTaskSubmissions={setFetchedTaskSubmissions}
        isEdit={true}
        cancelSubmissionForm={() => {
          setMakeSubmission(false);
          setSubmissionToEdit(null);
        }}
        fetchedTaskSubmissions={fetchedTaskSubmissions}
        orgId={orgId}
        taskId={fetchedTask?.id}
        submissionToEdit={submissionToEdit}
      />
    );
  }
  if (requestChanges) {
    return (
      <TaskSubmissionForm
        setFetchedTaskSubmissions={setFetchedTaskSubmissions}
        cancelSubmissionForm={() => {
          setMakeSubmission(false);
          setRequestChanges(null);
        }}
        fetchedTaskSubmissions={fetchedTaskSubmissions}
        orgId={orgId}
        fetchedTask={fetchedTask}
        taskId={fetchedTask?.id}
        submission={requestChanges}
        requestChanges
      />
    );
  }

  if (fetchedTaskSubmissionsLength > 0) {
    // display list of submissions
    return (
      <>
        {makeSubmission ? (
          <TaskSubmissionForm
            setFetchedTaskSubmissions={setFetchedTaskSubmissions}
            cancelSubmissionForm={() => setMakeSubmission(false)}
            fetchedTaskSubmissions={fetchedTaskSubmissions}
            orgId={orgId}
            taskId={fetchedTask?.id}
          />
        ) : (
          <>
            {taskStatus !== TASK_STATUS_DONE && taskStatus !== TASK_STATUS_ARCHIVED && (
              <MakeSubmissionBlock
                fetchedTask={fetchedTask}
                setMakeSubmission={setMakeSubmission}
                prompt={'Make another submission'}
                canSubmit={canSubmit}
                loggedInUser={loggedInUser}
              />
            )}
            {taskStatus === TASK_STATUS_DONE && fetchedTask?.type === ENTITIES_TYPES.TASK && (
              <MakePaymentBlock
                fetchedTask={fetchedTask}
                setShowPaymentModal={setShowPaymentModal}
                taskSubmissions={fetchedTaskSubmissions}
              />
            )}
            {fetchedTaskSubmissions?.map((taskSubmission) => {
              return (
                <SubmissionItem
                  setRequestChanges={setRequestChanges}
                  setMakeSubmission={setMakeSubmission}
                  setSubmissionToEdit={setSubmissionToEdit}
                  key={taskSubmission?.id}
                  canReview={canReview}
                  fetchedTask={fetchedTask}
                  setFetchedTask={setFetchedTask}
                  handleClose={handleClose}
                  setFetchedTaskSubmissions={setFetchedTaskSubmissions}
                  fetchedTaskSubmissions={fetchedTaskSubmissions}
                  submission={transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {})}
                  user={loggedInUser}
                  setShowPaymentModal={setShowPaymentModal}
                  getTaskSubmissionsForTask={getTaskSubmissionsForTask}
                />
              );
            })}
          </>
        )}
      </>
    );
  }
  return null;
};
