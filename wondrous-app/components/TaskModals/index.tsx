import React, { useCallback, useContext, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import { DeleteTaskModal } from 'components/Common/DeleteTaskModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { ArchivedTaskUndo } from 'components/Common/Task/styles';
import { CreateEntity } from 'components/CreateEntity';
import { ARCHIVE_TASK, UNARCHIVE_TASK } from 'graphql/mutations';
import { GET_TASK_REVIEWERS } from 'graphql/queries';
import useTaskActions from '../../hooks/useTaskActions';

function TaskModals() {
  const { isEditAction, isDeleteAction, isArchiveAction, taskInAction, resetTaskAction } = useTaskActions();
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [getReviewers, { data: reviewerData }] = useLazyQuery(GET_TASK_REVIEWERS);

  useEffect(() => {
    if (isEditAction && !reviewerData?.getTaskReviewers?.length) {
      getReviewers({
        variables: {
          taskId: taskInAction?.id,
        },
      });
    }
  }, [isEditAction, getReviewers, reviewerData?.getTaskReviewers?.length, taskInAction?.id]);

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
      <CreateEntity
        open={isEditAction}
        handleCloseModal={resetTaskAction}
        entityType={taskInAction?.type}
        handleClose={resetTaskAction}
        cancel={resetTaskAction}
        existingTask={
          {
            ...taskInAction,
            reviewers: reviewerData?.getTaskReviewers || [],
          } as any
        }
        isTaskProposal={false}
      />
      <ArchiveTaskModal
        open={isArchiveAction}
        onClose={resetTaskAction}
        onArchive={handleOnArchive}
        taskType={taskInAction?.type}
        taskId={taskInAction?.id}
      />
      <DeleteTaskModal
        open={isDeleteAction}
        onClose={resetTaskAction}
        taskType={taskInAction?.type}
        taskId={taskInAction?.id}
        onDelete={() => {
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage('Deleted successfully!');
        }}
      />
    </>
  );
}

export default TaskModals;
