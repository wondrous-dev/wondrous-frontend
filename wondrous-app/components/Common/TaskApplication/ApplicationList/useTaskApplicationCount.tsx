import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_TASK_APPLICATIONS_COUNT } from 'graphql/queries/taskApplication';

interface Props {
  taskId: string;
}

export default function useTaskApplicationCount(taskId: Props) {
  const [getTaskApplicationsCount, { loading, error, data }] = useLazyQuery(GET_TASK_APPLICATIONS_COUNT);
  useEffect(() => {
    if (taskId) getTaskApplicationsCount({ variables: { input: { taskId } } });
  }, [taskId]);
  return { loading, error, data };
}
