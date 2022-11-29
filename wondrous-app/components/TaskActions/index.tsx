import React, { memo, Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import * as Constants from 'utils/constants';
import { delQuery } from 'utils/index';
const TaskViewModal = dynamic(() => import('components/Common/TaskViewModal'), { suspense: true });

type Props = {
  queryParams: object;
};

const TaskActions = ({}: Props) => {
  // const [taskId, setTaskId] = useState(null);
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (query.task) {
      const windowOffset = window.scrollY;
      document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
      // setTaskId(taskId);
    }
  }, [query.task, query.taskProposal]);

  const taskId = (query.task || query.taskProposal) as string | null;

  return taskId ? (
    <Suspense>
      <TaskViewModal
        open
        handleClose={() => {
          const query = {
            ...router.query
          }

          delete query.task;
          delete query.taskProposal;

          router.push({ query });
          // setViewDetails(false);
          // const newUrl = `${delQuery(router.asPath)}?view=${router?.query?.view || 'grid'}&entity=${
          //   location?.params?.entity || Constants.ENTITIES_TYPES.TASK
          // }`;
          // location.push(newUrl);
        }}
        taskId={taskId}
        back
      />
    </Suspense>
  ) : null;
};

export default TaskActions;
