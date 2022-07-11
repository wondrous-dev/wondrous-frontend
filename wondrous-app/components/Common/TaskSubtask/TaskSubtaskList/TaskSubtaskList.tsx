import { useQuery } from '@apollo/client';
import { GET_SUBTASKS_FOR_TASK } from 'graphql/queries';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { TASK_STATUS_ARCHIVED } from 'utils/constants';
import { SubtaskTaskItem, SubtaskTaskListHasMore } from './styles';

const LIMIT = 5;
const useGetSubtasksForTask = ({ taskId, inView }) => {
  const [hasMore, setHasMore] = useState(true);
  const { data, fetchMore, loading } = useQuery(GET_SUBTASKS_FOR_TASK, {
    fetchPolicy: 'cache-and-network',
    variables: {
      taskId,
      limit: LIMIT,
      offset: 0,
    },
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMore({
        variables: {
          offset: data?.getSubtasksForTask.length,
        },
      }).then(({ data }) => setHasMore(data?.getSubtasksForTask.length >= LIMIT));
    }
  }, [inView, fetchMore, data?.getSubtasksForTask, hasMore, loading]);
  return {
    data: data?.getSubtasksForTask.filter((i) => i.status !== TASK_STATUS_ARCHIVED),
    loading,
    hasMore,
  };
};

export const TaskSubtaskList = ({ taskId }) => {
  const [ref, inView] = useInView({});
  const { hasMore, data, loading } = useGetSubtasksForTask({ taskId, inView });
  if (!data) return null;
  return (
    <>
      {data.map((subtask) => (
        <SubtaskTaskItem key={subtask.id} task={subtask} />
      ))}
      {hasMore && !loading && <SubtaskTaskListHasMore ref={ref} />}
    </>
  );
};
