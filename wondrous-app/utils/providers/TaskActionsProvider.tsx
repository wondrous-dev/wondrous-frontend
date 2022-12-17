import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { TaskInterface } from 'types/task';
import { TaskActionsContext } from 'utils/contexts';
import TaskViewModal from 'components/Common/TaskViewModal';
import { ViewType } from 'types/common';

const TaskActionsProvider = ({ children }) => {
  const router = useRouter();
  const { query } = router;
  // Queue has task ids that should be opened in modal
  const [taskViewQueue, setTaskViewQueue] = useState<TaskInterface[]>([]);

  // handle browser's back button to hide task view modal
  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        // Will run when leaving the current page; on back/forward actions
        if (taskViewQueue.length) {
          const prevTask = taskViewQueue[taskViewQueue.length - 2];

          if ((prevTask && as.includes(prevTask.id)) || taskViewQueue.length === 1) {
            // close previous or last task if you click browser's back button
            setTaskViewQueue([...taskViewQueue].slice(0, -1));
          }
        }
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]); // Add any state variables to dependencies array if needed.

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

  /**
   * Opens task in modal. You can pass { id: string, isProposal: boolean } if you don't have entire task object
   * @param task
   */
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
          isTaskProposal={!!(task ? task.isProposal : query.taskProposal)}
          open
        />
      ))}

      {children}
    </TaskActionsContext.Provider>
  );
};

export default TaskActionsProvider;
