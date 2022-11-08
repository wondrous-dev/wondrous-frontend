import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import { CompleteModal } from 'components/Common/CompleteModal';
import DeleteTaskModal from 'components/Common/DeleteTaskModal';
import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { COMPLETE_MILESTONE, COMPLETE_BOUNTY, UNARCHIVE_TASK } from 'graphql/mutations';
import { BOUNTY_TYPE, MILESTONE_TYPE } from 'utils/constants';
import { ArchivedTaskUndo } from './styles';

export default function ActionModals({
  completeModal,
  setCompleteModal,
  taskType,
  fetchedTask,
  archiveTask,
  handleOnCloseArchiveTaskModal,
  deleteTask = false,
  setDeleteTask = null,
  handleClose = () => null,
  setSnackbarAlertOpen,
  setSnackbarAlertMessage,
  archiveTaskMutation,
}) {
  const isBounty = fetchedTask?.type === BOUNTY_TYPE;
  const isMilestone = fetchedTask?.type === MILESTONE_TYPE;

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

  const handleOnArchive = useCallback(() => {
    archiveTaskMutation({
      variables: {
        taskId: fetchedTask?.id,
      },
    }).then((result) => {
      handleClose();
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(
        <>
          Task archived successfully!{' '}
          <ArchivedTaskUndo
            onClick={() => {
              setSnackbarAlertOpen(false);
              unarchiveTaskMutation({
                variables: {
                  taskId: fetchedTask?.id,
                },
              });
            }}
          >
            Undo
          </ArchivedTaskUndo>
        </>
      );
    });
  }, [
    fetchedTask?.id,
    archiveTaskMutation,
    handleClose,
    setSnackbarAlertOpen,
    unarchiveTaskMutation,
    setSnackbarAlertMessage,
  ]);

  const completeCallback = useCallback(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (isMilestone) {
      completeMilestone({
        variables: {
          milestoneId: fetchedTask?.id,
          timezone,
        },
      }).then(() => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage(<>Milestone marked as complete :)</>);
      });
    } else if (isBounty) {
      completeBounty({
        variables: {
          bountyId: fetchedTask?.id,
          timezone,
        },
      }).then(() => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage(<>Bounty marked as complete :)</>);
      });
    }
  }, [fetchedTask, isMilestone, isBounty, setSnackbarAlertOpen, setSnackbarAlertMessage]);

  return (
    <>
      <CompleteModal
        open={completeModal}
        onClose={() => {
          setCompleteModal(false);
        }}
        taskType={taskType}
        taskId={fetchedTask?.id}
        onComplete={completeCallback}
      />
      <ArchiveTaskModal
        open={archiveTask}
        onClose={handleOnCloseArchiveTaskModal}
        onArchive={handleOnArchive}
        taskType={taskType}
        taskId={fetchedTask?.id}
      />
      <DeleteTaskModal
        open={deleteTask}
        onClose={() => setDeleteTask(false)}
        taskType={taskType}
        taskId={fetchedTask?.id}
        onDelete={() => {
          handleClose();
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(`Deleted successfully!`);
        }}
      />
    </>
  );
}
