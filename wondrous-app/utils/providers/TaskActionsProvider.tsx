import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { TaskInterface } from 'types/task';
import { TaskActionsContext } from 'utils/contexts';
import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';

/**
 * You have to use this hook in the board provider, so TaskViewModalWatcher could subscribe to it
 * We need the task id to be in the state and after in url to optimize performance
 * TODO: Handle router on initial page load
 */
const TaskActionsProvider = ({ children }) => {
  const router = useRouter();
  // Queue has task ids that should be opened in modal
  const [taskViewQueue, setTaskViewQueue] = useState<TaskInterface[]>([]);

  const openTaskViewModal = (task: TaskInterface) => {
    const isInQueue = taskViewQueue.some((item) => item.id === task.id);

    if (!isInQueue) {
      const newQueue = [...taskViewQueue, task];
      setTaskViewQueue(newQueue);

      const query = {
        ...router.query,
        [task.isProposal ? 'task' : 'taskProposal']: task.id,
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

        query[taskViewItem.isProposal ? 'task' : 'taskProposal'] = taskViewItem.id;
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
      <TaskViewModalWatcher taskViewQueue={taskViewQueue} handleClose={closeTaskViewModal} />

      {children}
    </TaskActionsContext.Provider>
  );
};

export default TaskActionsProvider;
