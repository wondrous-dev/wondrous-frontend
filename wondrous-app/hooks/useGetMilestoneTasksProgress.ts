import { useQuery } from '@apollo/client';
import { GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE } from 'graphql/queries';
import { useMemo } from 'react';

const calculateProgress = (completed, total) => {
  if (!completed || completed === 0) return 0;
  return Math.floor((parseInt(completed, 10) / parseInt(total, 10)) * 100);
};

const useGetMilestoneTasksProgress = ({ milestoneId }) => {
  const { data } = useQuery(GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE, {
    skip: !milestoneId,
    variables: {
      milestoneId,
    },
  });

  const tasksTotal = useMemo(
    () =>
      data?.getPerStatusTaskCountForMilestone
        ? Object.values(data?.getPerStatusTaskCountForMilestone)
            ?.filter((i) => typeof i === 'number')
            ?.reduce((a: number, b: number) => a + b, 0) ?? 0
        : 0,
    [data?.getPerStatusTaskCountForMilestone]
  );

  const tasksCompleted = useMemo(
    () =>
      data?.getPerStatusTaskCountForMilestone
        ? data?.getPerStatusTaskCountForMilestone?.completed + data?.getPerStatusTaskCountForMilestone?.archived
        : 0,
    [data?.getPerStatusTaskCountForMilestone]
  );

  const progress = useMemo(
    () => calculateProgress(tasksCompleted, tasksTotal),
    [tasksCompleted, tasksTotal, calculateProgress]
  );

  console.log(tasksTotal, tasksCompleted, progress);
  return { tasksTotal, tasksCompleted, progress };
};

export default useGetMilestoneTasksProgress;
