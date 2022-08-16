import TaskActionModals from 'components/TaskActionModals';
import { useState } from 'react';
import { TaskFragment } from 'types/task';
import { TaskActionsContext } from 'utils/contexts';

// eslint-disable-next-line no-shadow,no-unused-vars
enum TaskActionType {
  Archive = 'archive',
  Complete = 'complete',
  Delete = 'delete',
  Edit = 'edit',
}

function TaskActionsProvider({ children }) {
  const [taskInAction, setTaskInAction] = useState<TaskFragment>(null);
  const [actionType, setActionType] = useState<TaskActionType>(null);

  return (
    <TaskActionsContext.Provider
      value={{
        taskInAction,
        isEditAction: actionType === TaskActionType.Edit,
        isCompleteAction: actionType === TaskActionType.Complete,
        isDeleteAction: actionType === TaskActionType.Delete,
        isArchiveAction: actionType === TaskActionType.Archive,

        completeTask: (task: TaskFragment) => {
          setTaskInAction(task);
          setActionType(TaskActionType.Complete);
        },
        editTask: (task: TaskFragment) => {
          setTaskInAction(task);
          setActionType(TaskActionType.Edit);
        },
        archiveTask: (task: TaskFragment) => {
          setTaskInAction(task);
          setActionType(TaskActionType.Archive);
        },
        deleteTask: (task: TaskFragment) => {
          setTaskInAction(task);
          setActionType(TaskActionType.Delete);
        },
        resetTaskAction: () => {
          setActionType(null);
        },
      }}
    >
      <TaskActionModals />
      {children}
    </TaskActionsContext.Provider>
  );
}

export default TaskActionsProvider;
