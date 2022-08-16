import { CompleteModal } from 'components/Common/CompleteModal';
import * as Constants from 'constants';
import React, { useCallback, useContext, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import { DeleteTaskModal } from 'components/Common/DeleteTaskModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { ArchivedTaskUndo } from 'components/Common/Task/styles';
import { CreateEntity } from 'components/CreateEntity';
import { ARCHIVE_TASK, COMPLETE_BOUNTY, COMPLETE_MILESTONE, UNARCHIVE_TASK } from 'graphql/mutations';
import { GET_TASK_REVIEWERS } from 'graphql/queries';
import { BOUNTY_TYPE, MILESTONE_TYPE, TASK_STATUS_REQUESTED } from 'utils/constants';
import useTaskActions from '../../hooks/useTaskActions';

function TaskActionModals() {
  const { isEditAction, isCompleteAction, isDeleteAction, isArchiveAction, taskInAction, resetTaskAction } =
    useTaskActions();
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [getReviewers, { data: reviewerData }] = useLazyQuery(GET_TASK_REVIEWERS);

  const isBounty = taskInAction?.type === BOUNTY_TYPE;
  const isMilestone = taskInAction?.type === MILESTONE_TYPE;
  const taskTypes = {
    TaskProposalCard: 'task proposal',
    TaskSubmissionCard: 'task',
  };
  const taskType = taskTypes[taskInAction?.__typename] ?? taskInAction?.type;

  useEffect(() => {
    if (isEditAction && !reviewerData?.getTaskReviewers?.length) {
      getReviewers({
        variables: {
          taskId: taskInAction?.id,
        },
      });
    }
  }, [isEditAction, getReviewers, reviewerData?.getTaskReviewers?.length, taskInAction?.id]);

  const [completeMilestone] = useMutation(COMPLETE_MILESTONE, {
    refetchQueries: () => [
      'getTaskById',
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
    ],
  });

  const [completeBounty] = useMutation(COMPLETE_BOUNTY, {
    refetchQueries: () => [
      'getTaskById',
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
    ],
  });

  const completeCallback = useCallback(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (isMilestone) {
      completeMilestone({
        variables: {
          milestoneId: taskInAction?.id,
          timezone,
        },
      }).then(() => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage(<>Milestone marked as complete :)</>);
      });
    } else if (isBounty) {
      completeBounty({
        variables: {
          bountyId: taskInAction?.id,
          timezone,
        },
      }).then(() => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage(<>Bounty marked as complete :)</>);
      });
    }
  }, [taskInAction, isMilestone, isBounty, setSnackbarAlertOpen, setSnackbarAlertMessage]);

  const [archiveTaskMutation, { data: archiveTaskData }] = useMutation(ARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
    ],
    onError: () => {
      console.error('Something went wrong with archiving tasks');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });

  const [unarchiveTaskMutation, { data: unarchiveTaskData }] = useMutation(UNARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
    ],
    onError: () => {
      console.error('Something went wrong unarchiving tasks');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });

  const handleOnArchive = useCallback(() => {
    archiveTaskMutation({
      variables: {
        taskId: taskInAction?.id,
      },
    }).then((result) => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(
        <>
          Task archived successfully!{' '}
          <ArchivedTaskUndo
            onClick={() => {
              setSnackbarAlertOpen(false);
              unarchiveTaskMutation({
                variables: {
                  taskId: taskInAction?.id,
                },
              });
            }}
          >
            Undo
          </ArchivedTaskUndo>
        </>
      );
    });
  }, [taskInAction?.id, archiveTaskMutation, setSnackbarAlertMessage, setSnackbarAlertOpen, unarchiveTaskMutation]);

  return (
    <>
      <CompleteModal
        open={isCompleteAction}
        onClose={resetTaskAction}
        taskType={taskType}
        taskId={taskInAction?.id}
        onComplete={completeCallback}
      />
      <CreateEntity
        open={isEditAction}
        handleCloseModal={resetTaskAction}
        entityType={taskType}
        handleClose={resetTaskAction}
        cancel={resetTaskAction}
        existingTask={
          {
            ...taskInAction,
            reviewers: reviewerData?.getTaskReviewers || [],
          } as any
        }
        isTaskProposal={taskInAction?.type === TASK_STATUS_REQUESTED}
      />
      <ArchiveTaskModal
        open={isArchiveAction}
        onClose={resetTaskAction}
        onArchive={handleOnArchive}
        taskType={taskType}
        taskId={taskInAction?.id}
      />
      <DeleteTaskModal
        open={isDeleteAction}
        onClose={resetTaskAction}
        taskType={taskType}
        taskId={taskInAction?.id}
        onDelete={() => {
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage('Deleted successfully!');
        }}
      />
    </>
  );
}

export default TaskActionModals;
