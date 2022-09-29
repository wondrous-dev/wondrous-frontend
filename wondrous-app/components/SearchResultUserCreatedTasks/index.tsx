import { useQuery } from '@apollo/client';
import ListView from 'components/ListView';
import { GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK, SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import groupBy from 'lodash/groupBy';
import { useMemo, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { UserBoardContext } from 'utils/contexts';

import { Title, TitleWrapper, TotalTaskCount, Wrapper } from './styles';

const COLUMNS = [
  { status: 'created', tasks: [], count: 0 },
  { status: 'in_progress', tasks: [], count: 0 },
];

const handleSetColumns = (columns, { key, newVal }) =>
  columns.map(({ status, ...column }) => ({
    ...column,
    status,
    [key]: newVal(status) || column?.[key],
  }));

const COLUMNS_SNAKE_TO_CAMEL_CASE = {
  created: 'created',
  in_progress: 'inProgress',
  in_review: 'inReview',
  completed: 'completed',
};

const useSearchUserCreatedTasks = () => {
  const [columns, setColumns] = useState(COLUMNS);
  useQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK, {
    fetchPolicy: 'cache-and-network',
    onCompleted: ({ getPerStatusTaskCountForUserCreatedTask }) => {
      setColumns(
        handleSetColumns(columns, {
          key: 'count',
          newVal: (i) => getPerStatusTaskCountForUserCreatedTask?.[COLUMNS_SNAKE_TO_CAMEL_CASE?.[i]] || 0,
        })
      );
    },
  });
  const { fetchMore } = useQuery(SEARCH_USER_CREATED_TASKS, {
    variables: {
      statuses: ['created', 'in_progress'],
      offset: 0,
      limit: 10,
    },
    onCompleted: ({ searchUserCreatedTask }) => {
      const taskByStatus = groupBy(searchUserCreatedTask, 'status');
      setColumns(handleSetColumns(columns, { key: 'tasks', newVal: (i) => taskByStatus[i] }));
    },
  });
  const fetchPerStatus = (status) => {
    fetchMore({
      variables: {
        statuses: [status],
        limit: null,
      },
    }).then(({ data }) => {
      const taskByStatus = groupBy(data?.searchUserCreatedTask, 'status');
      setColumns(handleSetColumns(columns, { key: 'tasks', newVal: (i) => (status === i ? taskByStatus[i] : false) }));
    });
  };
  return { columns, setColumns, fetchPerStatus };
};

const SearchResultUserCreatedTasks = () => {
  const { columns, setColumns, fetchPerStatus } = useSearchUserCreatedTasks();
  const totalTaskCount = columns.reduce((prev, current) => (current.count || 0) + prev, 0);
  const value = useMemo(
    () => ({
      entityType: ENTITIES_TYPES.TASK,
      setColumns,
      fetchPerStatus,
      columns,
    }),
    [setColumns, fetchPerStatus, columns]
  );
  return (
    <UserBoardContext.Provider value={value}>
      <Wrapper>
        <TitleWrapper>
          <Title>Tasks I've Created</Title>
          <TotalTaskCount>{totalTaskCount} tasks</TotalTaskCount>
        </TitleWrapper>
        <ListView columns={columns} onLoadMore={() => null} hasMore={false} />
      </Wrapper>
    </UserBoardContext.Provider>
  );
};

export default SearchResultUserCreatedTasks;
