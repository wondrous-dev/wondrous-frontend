import React, { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { ViewType } from 'types/common';
import { useBoards } from 'utils/hooks';

// const TaskViewModal = dynamic(() => import('components/Common/TaskViewModal'), { suspense: true });
// const TaskViewModal = dynamic(() => import('components/Common/TaskViewModal'), { suspense: true });
import TaskViewModal from 'components/Common/TaskViewModal';
// Use this component to open task view modal automatically and without any handlers
const TaskViewModalWatcher = () => {
  const { board } = useBoards();
  const router = useRouter();
  // const { query } = router;
  // const taskIdFromQuery = (query.task || query.taskProposal) as string | null;
  // // Queue has task ids that should be opened in modal
  // const [taskQueue, setTaskQueue] = useState<string[]>([]);
  //
  // useEffect(() => {
  //   // not include task id in the queue if it's already there
  //   if (taskIdFromQuery) {
  //     if (taskQueue.includes(taskIdFromQuery)) {
  //       // remove last task from the queue
  //       setTaskQueue([...taskQueue].slice(0, -1));
  //     } else {
  //       setTaskQueue([...taskQueue, taskIdFromQuery]);
  //     }
  //   } else if (taskQueue.length) {
  //     // This is for case when you click browser's back button
  //     setTaskQueue([]);
  //   }
  // }, [taskIdFromQuery]);
  //
  // const handleClose = () => {
  //   const newUrlQuery = { ...query };
  //
  //   // this is for milestone, to not replace the milestone page when you open a task
  //   if (taskQueue.length > 1) {
  //     // milestone page can't have taskProposal query param, so pass only task
  //     newUrlQuery.task = taskQueue[taskQueue.length - 2];
  //   } else {
  //     delete newUrlQuery.task;
  //     delete newUrlQuery.taskProposal;
  //   }
  //
  //   router.push({ query: newUrlQuery }, undefined, { scroll: false, shallow: true });
  // };

  console.log(router.query, '<<< router.query');
  console.log(board.taskViewQueue, '<<< router.query');

  return (
    <>
      {board.taskViewQueue.map((taskViewItem) => (
        <TaskViewModal
          key={taskViewItem.taskId}
          handleClose={board.closeTaskViewModal}
          taskId={taskViewItem.taskId}
          back={router.query.view === ViewType.List}
          isTaskProposal={!!taskViewItem.isProposal}
          open
        />
      ))}
    </>
  );
};

export default TaskViewModalWatcher;
