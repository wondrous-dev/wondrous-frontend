import { useQuery } from '@apollo/client';
import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import { ArchivedIcon } from 'components/Icons/statusIcons';
import { GET_TASKS_FOR_MILESTONE } from 'graphql/queries';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import * as Constants from 'utils/constants';
import MilestoneTaskFilter from './MilestoneTaskFilter';
import MilestoneTaskList from './MilestoneTaskList';
import MilestoneTasksCreate from './MilestoneTasksCreate';

export const TASK_ICONS_LABELS = {
  [Constants.TASK_STATUS_TODO]: { Icon: ToDo, label: 'To Do' },
  [Constants.TASK_STATUS_IN_PROGRESS]: { Icon: InProgress, label: 'In Progress' },
  [Constants.TASK_STATUS_IN_REVIEW]: { Icon: InReview, label: 'In Review' },
  [Constants.TASK_STATUS_DONE]: { Icon: Done, label: 'Completed' },
  [Constants.TASK_STATUS_ARCHIVED]: { Icon: ArchivedIcon, label: 'Archived' },
};

export const LoadMore = styled.div`
  height: 10px;
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;

const MilestoneEmpty = styled.div`
  height: 68px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #171717;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.grey250};
  display: flex;
  font-family: 'Space Grotesk';
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
  const [status, setStatus] = useState('');
  const { data, ref, hasMore } = useGetTasksForMilestone({ milestone, status });
  if (!canCreate && isEmpty(data)) return <MilestoneEmpty>No tasks yet.</MilestoneEmpty>;
  return (
    <>
      <MilestoneTaskFilter status={status} setStatus={setStatus} />
      <MilestoneTasksCreate canCreate={canCreate} milestone={milestone} />
      <MilestoneTaskList data={data} />
      <LoadMore ref={ref} hasMore={hasMore} />
    </>
  );
};

export default MilestoneTasks;
