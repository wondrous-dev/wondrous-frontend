import { useQuery } from '@apollo/client';
import { GET_TASKS_FOR_MILESTONE } from 'graphql/queries';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import MilestoneTaskFilter from './MilestoneTaskFilter';
import MilestoneTaskList from './MilestoneTaskList';
import MilestoneTasksCreate from './MilestoneTasksCreate';

export const LoadMore = styled.div`
  height: 10px;
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;

const getDataLength = (data) => data?.getTasksForMilestone?.length;

const useGetTasksForMilestone = ({ milestone, status }) => {
  const { id } = milestone;
  const limit = 10;
  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(true);
  const { fetchMore, data } = useQuery(GET_TASKS_FOR_MILESTONE, {
    fetchPolicy: 'cache-and-network',
    variables: {
      milestoneId: id,
      limit,
      offset: 0,
      status: status ?? '',
    },
    onCompleted: (tasksForMilestoneData) => setHasMore(getDataLength(tasksForMilestoneData) >= limit),
    onError: (err) => console.error(err),
  });
  useEffect(() => {
    if (inView && hasMore) {
      fetchMore({
        variables: {
          offset: getDataLength(data),
        },
      }).then(({ data: tasksForMilestoneData }) => setHasMore(getDataLength(tasksForMilestoneData) >= limit));
    }
  }, [inView, fetchMore, hasMore, data]);
  return { data: data?.getTasksForMilestone, ref, hasMore };
};

function MilestoneTasks({ milestone, canCreate }) {
  const [status, setStatus] = useState('');
  const { data, ref, hasMore } = useGetTasksForMilestone({ milestone, status });
  return (
    <>
      <MilestoneTaskFilter status={status} setStatus={setStatus} />
      <MilestoneTasksCreate canCreate={canCreate} milestone={milestone} />
      <MilestoneTaskList data={data} />
      <LoadMore ref={ref} hasMore={hasMore} />
    </>
  );
}

export default MilestoneTasks;
