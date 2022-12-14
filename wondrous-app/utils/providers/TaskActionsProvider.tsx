import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { TaskInterface } from 'types/task';
import { TaskActionsContext } from 'utils/contexts';
import TaskViewModal from 'components/Common/TaskViewModal';
import { ViewType } from 'types/common';

/**
 * You have to use this hook in the board provider, so TaskViewModalWatcher could subscribe to it
 * We need the task id to be in the state and after in url to optimize performance
 */
const TaskActionsProvider = ({ children }) => {
  const router = useRouter();
  const { query } = router;
  // Queue has task ids that should be opened in modal
  const [taskViewQueue, setTaskViewQueue] = useState<TaskInterface[]>([]);

  useEffect(() => {
    const taskId = query.task || query.taskProposal;

    if (taskId && !taskViewQueue.length) {
      const isInQueue = taskViewQueue.some((item) => item.id === taskId);

      if (!isInQueue) {
        const newQueue = [...taskViewQueue, { id: taskId, isProposal: !!query.taskProposal } as TaskInterface];
        setTaskViewQueue(newQueue);
      }
    }
  }, [query]);

  const openTaskViewModal = (task: TaskInterface) => {
    const isInQueue = taskViewQueue.some((item) => item.id === task.id);

    if (!isInQueue) {
      const newQueue = [...taskViewQueue, task];
      setTaskViewQueue(newQueue);

      const query = {
        ...router.query,
        [task.isProposal ? 'taskProposal' : 'task']: task.id,
      };

      router.push({ query }, undefined, { scroll: false, shallow: true });
    }
  };

  const closeTaskViewModal = (goBack = true) => {
    setTaskViewQueue([...taskViewQueue].slice(0, -1));

    if (goBack) {
      const query = { ...router.query };

      // this is for milestone, to not replace the milestone page when you open a task
      if (taskViewQueue.length > 1) {
        const taskViewItem = taskViewQueue[taskViewQueue.length - 1];

        query[taskViewItem.isProposal ? 'taskProposal' : 'task'] = taskViewItem.id;
      } else {
        delete query.task;
        delete query.taskProposal;
      }

      router.push({ query }, undefined, { scroll: false, shallow: true });
    }
  };

  console.log(taskViewQueue, '<<< taskViewQueue');

  return (
    <TaskActionsContext.Provider
      value={{
        taskViewQueue,
        openTaskViewModal,
        closeTaskViewModal,
      }}
    >
      {taskViewQueue.map((task) => (
        <TaskViewModal
          key={task.id}
          handleClose={closeTaskViewModal}
          taskId={task.id}
          task={task.__typename ? task : null}
          back={router.query.view === ViewType.List}
          isTaskProposal={!!task.isProposal}
          open
        />
      ))}

      {children}
    </TaskActionsContext.Provider>
  );
};

export default TaskActionsProvider;
