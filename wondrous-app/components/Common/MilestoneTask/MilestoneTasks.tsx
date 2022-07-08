import { useQuery } from '@apollo/client';
import { GET_TASKS_FOR_MILESTONE } from 'graphql/queries';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import MilestoneTaskList from './MilestoneTaskList';
import MilestoneTasksCreate from './MilestoneTasksCreate';
import { LoadMore } from './styles';

const getDataLength = (data) => data?.getTasksForMilestone?.length;

const useGetTasksForMilestone = ({ milestone }) => {
  const { id } = milestone;
  const limit = 5;
  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(true);
  const { fetchMore, data } = useQuery(GET_TASKS_FOR_MILESTONE, {
    fetchPolicy: 'cache-and-network',
    variables: {
      milestoneId: id,
      limit,
      offset: 0,
    },
    onCompleted: (data) => setHasMore(getDataLength(data) >= limit),
    onError: (err) => console.error(err),
  });
  useEffect(() => {
    if (inView && hasMore) {
      fetchMore({
        variables: {
          offset: getDataLength(data),
        },
      }).then(({ data }) => setHasMore(getDataLength(data) >= limit));
    }
  }, [inView, fetchMore, hasMore, data]);
  return { data: data?.getTasksForMilestone, ref, hasMore };
};

const MilestoneTasks = ({ milestone, canCreate }) => {
  const { data, ref, hasMore } = useGetTasksForMilestone({ milestone });
  return (
    <>
      <MilestoneTasksCreate canCreate={canCreate} milestone={milestone} />
      <MilestoneTaskList data={data} />
      <LoadMore ref={ref} hasMore={hasMore} />
    </>
  );
};

export default MilestoneTasks;
