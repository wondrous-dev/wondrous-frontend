import { useQuery } from '@apollo/client';
import ListView from 'components/ListView';
import { GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK, SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import groupBy from 'lodash/groupBy';
import { generateColumns } from 'services/board';
import { COLUMNS_CONFIGURATION } from 'utils/constants';

import { Title, Wrapper } from './styles';

const COLUMNS_SNAKE_TO_CAMEL_CASE = {
  created: 'created',
  in_progress: 'inProgress',
  in_review: 'inReview',
  completed: 'completed',
};

const ORG_POD_COLUMNS = generateColumns(false, COLUMNS_CONFIGURATION.ORG);

const SearchResult = () => {
  const { data: userCreatedtasksData } = useQuery(SEARCH_USER_CREATED_TASKS, {
    variables: {
      statuses: ['created', 'in_progress', 'in_review', 'completed'],
    },
  });
  const userCreatedtasks = userCreatedtasksData?.searchUserCreatedTask;
  const { data: perStatusCountData } = useQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK);
  const perStatusCount = perStatusCountData?.getPerStatusTaskCountForUserCreatedTask;
  const taskByStatus = groupBy(userCreatedtasks, 'status');
  const columns = ORG_POD_COLUMNS.map(({ status }) => ({
    status,
    tasks: taskByStatus[status],
    count: perStatusCount[COLUMNS_SNAKE_TO_CAMEL_CASE[status]] || 0,
  }));
  return (
    <Wrapper>
      <Title>Tasks I've Created</Title>
      <ListView columns={columns} onLoadMore={() => null} hasMore={false} />
    </Wrapper>
  );
};

export default SearchResult;
