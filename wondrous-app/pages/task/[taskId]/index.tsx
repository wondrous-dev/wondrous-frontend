import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_MINIMAL_TASK_BY_ID } from 'graphql/queries/task';
import AppLayout from 'components/Common/Layout/App';
import { CircularProgress } from '@mui/material';

function TaskRedirect() {
  const router = useRouter();
  const { taskId } = router.query;
  const [getTaskById, { data: taskData }] = useLazyQuery(GET_MINIMAL_TASK_BY_ID);
  useEffect(() => {
    getTaskById({
      variables: {
        taskId,
      },
    });
  }, [taskId]);

  const task = taskData?.getTaskById;
  if (task?.org?.username) {
    router.push(`/organization/${task?.org?.username}/boards?task=${taskId}`, undefined, {
      shallow: true,
    });
  }
  return (
    <AppLayout banner={null}>
      <CircularProgress />
    </AppLayout>
  );
}

export default TaskRedirect;
