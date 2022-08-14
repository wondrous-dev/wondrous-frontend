import { useContext } from 'react';
import { TaskActionsContext } from 'utils/contexts';

function useTaskActions() {
  const {
    taskInAction,
    isEditAction,
    isDeleteAction,
    isArchiveAction,
    editTask,
    deleteTask,
    archiveTask,
    resetTaskAction,
  } = useContext(TaskActionsContext);

  return {
    taskInAction,
    isEditAction,
    isDeleteAction,
    isArchiveAction,
    editTask,
    deleteTask,
    archiveTask,
    resetTaskAction,
  };
}

export default useTaskActions;
