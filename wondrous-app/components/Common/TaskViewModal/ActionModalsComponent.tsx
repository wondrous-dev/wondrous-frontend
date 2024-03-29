import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import { CompleteModal } from 'components/Common/CompleteModal';
import DeleteEntityModal from 'components/Common/DeleteEntityModal';
import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { COMPLETE_MILESTONE, COMPLETE_BOUNTY, UNARCHIVE_TASK, UNARCHIVE_MILESTONE } from 'graphql/mutations';
import { BOUNTY_TYPE, ENTITIES_TYPES, MILESTONE_TYPE } from 'utils/constants';
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
  handleClose = null,
  setSnackbarAlertOpen,
  setSnackbarAlertMessage,
  archiveTaskMutation,
  isMilestone = false,
}) {
  const isBounty = fetchedTask?.type === BOUNTY_TYPE;

  const type = isMilestone ? ENTITIES_TYPES.MILESTONE : taskType;

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

  const [unarchiveMilestoneMutation, { data: unarchiveMilestoneData }] = useMutation(UNARCHIVE_MILESTONE, {
    refetchQueries: [
      'getMilestoneById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getOrgBoardMilestones',
      'getPodBoardMilestones',
    ],
  });

  const [completeMilestone] = useMutation(COMPLETE_MILESTONE, {
    refetchQueries: () => [
      'getMilestoneById',
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

  const handleUnarchive = () => {
    setSnackbarAlertOpen(false);

    if (isMilestone) {
      return unarchiveMilestoneMutation({
        variables: {
          milestoneId: fetchedTask?.id,
        },
      });
    }
    return unarchiveTaskMutation({
      variables: {
        taskId: fetchedTask?.id,
      },
    });
  };
  const handleOnArchive = useCallback(() => {
    archiveTaskMutation({
      variables: {
        taskId: fetchedTask?.id,
      },
    }).then((result) => {
      if (handleClose) {
        handleClose();
      }
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(
        <>
          Task archived successfully! <ArchivedTaskUndo onClick={handleUnarchive}>Undo</ArchivedTaskUndo>
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
    handleUnarchive,
    unarchiveMilestoneMutation,
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
        taskType={type}
        taskId={fetchedTask?.id}
        onComplete={completeCallback}
      />
      <ArchiveTaskModal
        open={archiveTask}
        onClose={handleOnCloseArchiveTaskModal}
        onArchive={handleOnArchive}
        taskType={type}
        taskId={fetchedTask?.id}
      />
      <DeleteEntityModal
        open={deleteTask}
        onClose={() => setDeleteTask(false)}
        entityType={type}
        taskId={fetchedTask?.id}
        onDelete={() => {
          if (handleClose) {
            handleClose();
          }
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(`Deleted successfully!`);
        }}
      />
    </>
  );
}
