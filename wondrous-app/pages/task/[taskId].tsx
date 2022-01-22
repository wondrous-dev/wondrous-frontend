import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_TASK_BY_ID } from '../../graphql/queries';
import AppLayout from '../../components/Common/Layout/App';
import { CircularProgress } from '@material-ui/core';
const TaskRedirect = () => {
  const router = useRouter();
  const { taskId } = router.query;
  const [getTaskById, { data: taskData }] = useLazyQuery(GET_TASK_BY_ID);
  useEffect(() => {
    getTaskById({
      variables: {
        taskId,
      },
    });
  }, [taskId]);

  const task = taskData?.getTaskById;
  if (task?.org?.username) {
    router.push(`/organization/${task?.org?.username}/boards?task=${taskId}`);
  }
  return (
    <AppLayout banner={null}>
      <CircularProgress />
    </AppLayout>
  );
};

export default TaskRedirect;
