import { useQuery } from '@apollo/client';
import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import FilterStatusIcon from 'components/Icons/filterStatusIcon.svg';
import { ArchivedIcon } from 'components/Icons/statusIcons';
import { GET_TASKS_FOR_MILESTONE } from 'graphql/queries';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import * as Constants from 'utils/constants';
import MilestoneTaskFilter from './MilestoneTaskFilter';
import MilestoneTaskList from './MilestoneTaskList';
import MilestoneTasksCreate from './MilestoneTasksCreate';
import {
  MilestoneTasksEmptyStateContainer,
  MilestoneTasksEmptyStateIcon,
  MilestoneTasksEmptyStateText,
} from './styles';

export const LoadMore = styled.div`
  height: 10px;
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;

const MilestoneTaskFilterStatusIcon = styled(({ className }) => (
  <div className={className}>
    <FilterStatusIcon />
  </div>
))`
  && {
    background: #0f0f0f;
    height: 26px;
    width: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }
`;

const MilestoneEmpty = styled.div`
  height: 68px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #171717; */
  font-weight: 500;
  color: ${({ theme }) => theme.palette.grey250};
  display: flex;
  font-family: 'Space Grotesk';
`;

export const TASK_ICONS_LABELS = {
  '': { Icon: MilestoneTaskFilterStatusIcon, label: 'All Tasks' },
  [Constants.TASK_STATUS_TODO]: { Icon: ToDo, label: 'To Do' },
  [Constants.TASK_STATUS_IN_PROGRESS]: { Icon: InProgress, label: 'In Progress' },
  [Constants.TASK_STATUS_IN_REVIEW]: { Icon: InReview, label: 'In Review' },
  [Constants.TASK_STATUS_DONE]: { Icon: Done, label: 'Completed' },
  [Constants.TASK_STATUS_ARCHIVED]: { Icon: ArchivedIcon, label: 'Archived' },
};

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

function MilestoneTasksEmptyState() {
  return (
    <MilestoneTasksEmptyStateContainer>
      <MilestoneTasksEmptyStateIcon />
      <MilestoneTasksEmptyStateText>No tasks yet</MilestoneTasksEmptyStateText>
    </MilestoneTasksEmptyStateContainer>
  );
}

function MilestoneTasks({ milestone, canCreate }) {
  const [status, setStatus] = useState('');
  const { data, ref, hasMore } = useGetTasksForMilestone({ milestone, status });
  return (
    <>
      {!!canCreate && <MilestoneTaskFilter status={status} setStatus={setStatus} />}
      <MilestoneTasksCreate canCreate={canCreate} milestone={milestone} />
      {isEmpty(data) ? (
        <MilestoneTasksEmptyState />
      ) : (
        <>
          <MilestoneTaskList data={data} />
          <LoadMore ref={ref} hasMore={hasMore} />
        </>
      )}
    </>
  );
}

export default MilestoneTasks;
