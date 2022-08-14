import TaskModals from 'components/TaskModals';
import { useState } from 'react';
import { TaskFragment } from 'types/task';
import { TaskActionsContext } from 'utils/contexts';

// eslint-disable-next-line no-shadow,no-unused-vars
enum TaskActionType {
  Edit = 'edit,',
  Archive = 'archive,',
  Delete = 'delete,',
}

function TaskActionsProvider({ children }) {
  const [taskInAction, setTaskInAction] = useState<TaskFragment>(null);
  const [actionType, setActionType] = useState<TaskActionType>(null);

  return (
    <TaskActionsContext.Provider
      value={{
        taskInAction,
        isEditAction: actionType === TaskActionType.Edit,
        isDeleteAction: actionType === TaskActionType.Delete,
        isArchiveAction: actionType === TaskActionType.Archive,

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
      <TaskModals />
      {children}
    </TaskActionsContext.Provider>
  );
}

export default TaskActionsProvider;
