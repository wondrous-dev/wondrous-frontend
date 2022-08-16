import { useContext } from 'react';
import { TaskActionsContext } from 'utils/contexts';

function useTaskActions() {
  const {
    taskInAction,
    isEditAction,
    isDeleteAction,
    isCompleteAction,
    isArchiveAction,
    editTask,
    deleteTask,
    archiveTask,
    completeTask,
    resetTaskAction,
  } = useContext(TaskActionsContext);

  return {
    taskInAction,
    isEditAction,
    isDeleteAction,
    isCompleteAction,
    isArchiveAction,
    editTask,
    deleteTask,
    archiveTask,
    completeTask,
    resetTaskAction,
  };
}

export default useTaskActions;
