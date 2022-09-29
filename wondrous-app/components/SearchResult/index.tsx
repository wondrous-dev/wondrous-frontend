import { useQuery } from '@apollo/client';
import ListView from 'components/ListView';
import { GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK, SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import groupBy from 'lodash/groupBy';
import { useMemo, useState } from 'react';
import { generateColumns } from 'services/board';
import { COLUMNS_CONFIGURATION, ENTITIES_TYPES } from 'utils/constants';
import { UserBoardContext } from 'utils/contexts';

import { Title, Wrapper } from './styles';

const ORG_POD_COLUMNS = generateColumns(false, COLUMNS_CONFIGURATION.ORG);

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
  const [columns, setColumns] = useState(ORG_POD_COLUMNS);
  useQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK, {
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
      statuses: ['created', 'in_progress', 'in_review', 'completed'],
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

const SearchResult = () => {
  const { columns, setColumns, fetchPerStatus } = useSearchUserCreatedTasks();
  const value = useMemo(
    () => ({
      entityType: ENTITIES_TYPES.TASK,
      setColumns,
      fetchPerStatus,
    }),
    [setColumns, fetchPerStatus]
  );
  return (
    <UserBoardContext.Provider value={value}>
      <Wrapper>
        <Title>Tasks I've Created</Title>
        <ListView columns={columns} onLoadMore={() => null} hasMore={false} />
      </Wrapper>
    </UserBoardContext.Provider>
  );
};

export default SearchResult;
