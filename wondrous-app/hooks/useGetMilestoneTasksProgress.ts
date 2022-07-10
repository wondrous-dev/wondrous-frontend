import { useLazyQuery } from '@apollo/client';
import { GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE } from 'graphql/queries';
import { useEffect, useState } from 'react';

const calculateProgress = (completed, total) => {
  if (!completed || completed === 0) return 0;
  return Math.floor((parseInt(completed, 10) / parseInt(total, 10)) * 100);
};

const useGetMilestoneTasksProgress = ({ milestoneId }) => {
  const [tasksTotal, setTaskTotal] = useState(null);
  const [tasksCompleted, setTaskCompleted] = useState(null);
  const progress = calculateProgress(tasksCompleted, tasksTotal);
  const [getPerStatusTaskCountForMilestone, { data }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE);
  useEffect(() => {
    if (milestoneId) {
      getPerStatusTaskCountForMilestone({
        variables: {
          milestoneId: milestoneId,
        },
      });

      if (data?.getPerStatusTaskCountForMilestone) {
        const { getPerStatusTaskCountForMilestone: getPerStatusTaskCountForMilestoneData } = data;
        setTaskTotal(
          Object.values(getPerStatusTaskCountForMilestoneData)
            ?.filter((i) => typeof i === 'number')
            ?.reduce((a: number, b: number) => a + b, 0) ?? 0
        );
        setTaskCompleted(
          getPerStatusTaskCountForMilestoneData?.completed + getPerStatusTaskCountForMilestoneData?.archived
        );
      }

      if (!data?.getPerStatusTaskCountForMilestone) {
        setTaskTotal(0);
        setTaskCompleted(0);
      }
    }
  }, [getPerStatusTaskCountForMilestone, milestoneId, data]);
  return { tasksTotal, tasksCompleted, progress };
};

export default useGetMilestoneTasksProgress;
