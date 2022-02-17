import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { GET_SUBTASKS_FOR_TASK } from '../../../graphql/queries';
import { TASK_STATUS_ARCHIVED } from '../../../utils/constants';
import { SubtaskTaskItem, SubtaskTaskListHasMore } from './styles';

export const TaskSubtaskList = ({ taskId }) => {
  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(true);
  const {
    data: getSubtasksForTaskData,
    fetchMore,
    loading,
  } = useQuery(GET_SUBTASKS_FOR_TASK, {
    variables: {
      taskId,
      limit: 5,
      offset: 0,
    },
  });

  useEffect(() => {
    console.log('In view: ', inView);
    if (inView) {
      fetchMore({
        variables: {
          offset: getSubtasksForTaskData?.getSubtasksForTask.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult?.getSubtasksForTask.length === 0) {
            setHasMore(false);
            return prev;
          }
          return {
            getSubtasksForTask: [...prev?.getSubtasksForTask, ...fetchMoreResult?.getSubtasksForTask],
          };
        },
      });
    }
  }, [inView, fetchMore, getSubtasksForTaskData]);

  return (
    <>
      {getSubtasksForTaskData?.getSubtasksForTask
        .filter((i) => i.status !== TASK_STATUS_ARCHIVED)
        .map((subtask) => (
          <SubtaskTaskItem key={subtask.id} task={subtask} />
        ))}
      {hasMore && !loading && <SubtaskTaskListHasMore ref={ref} />}
    </>
  );
};
