import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { ViewType } from 'types/common';

const TaskViewModal = dynamic(() => import('components/Common/TaskViewModal'), { suspense: true });
// Use this component to open task view modal automatically and without any handlers
const TaskViewModalWatcher = () => {
  const router = useRouter();
  const { query } = router;

  const taskId = (query.task || query.taskProposal || query.milestone) as string | null;
  const handleClose = () => {
    delete query.task;
    delete query.taskProposal;
    delete query.milestone;
    router.push({ query }, undefined, { scroll: false, shallow: true });
  };

  return taskId ? (
    <Suspense>
      <TaskViewModal
        open
        handleClose={handleClose}
        taskId={taskId}
        back={query.view === ViewType.List}
        isMilestone={!!query.milestone}
        isTaskProposal={!!query.taskProposal}
      />
    </Suspense>
  ) : null;
};

export default TaskViewModalWatcher;
