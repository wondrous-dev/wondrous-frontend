import { useQuery } from '@apollo/client';
import ListView from 'components/ListView';
import { GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK, SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import groupBy from 'lodash/groupBy';
import { useMemo, useReducer } from 'react';
import { generateColumns } from 'services/board';
import { COLUMNS_CONFIGURATION, ENTITIES_TYPES } from 'utils/constants';
import { UserBoardContext } from 'utils/contexts';

import { Title, Wrapper } from './styles';

const useSearchUserCreatedTasks = () => {
  const ORG_POD_COLUMNS = generateColumns(false, COLUMNS_CONFIGURATION.ORG);
  const handleSetColumns = (columns, { key, val }) =>
    columns.map(({ status, ...column }) => ({
      ...column,
      status,
      [key]: val(status),
    }));
  const [columns, setColumns] = useReducer(handleSetColumns, ORG_POD_COLUMNS);
  useQuery(SEARCH_USER_CREATED_TASKS, {
    variables: {
      statuses: ['created', 'in_progress', 'in_review', 'completed'],
    },
    onCompleted: ({ searchUserCreatedTask }) => {
      const taskByStatus = groupBy(searchUserCreatedTask, 'status');
      setColumns({ key: 'tasks', val: (i) => taskByStatus[i] });
    },
  });
  useQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK, {
    onCompleted: ({ getPerStatusTaskCountForUserCreatedTask }) => {
      const COLUMNS_SNAKE_TO_CAMEL_CASE = {
        created: 'created',
        in_progress: 'inProgress',
        in_review: 'inReview',
        completed: 'completed',
      };
      setColumns({
        key: 'count',
        val: (i) => getPerStatusTaskCountForUserCreatedTask?.[COLUMNS_SNAKE_TO_CAMEL_CASE?.[i]] || 0,
      });
    },
  });
  return { columns, setColumns };
};

const SearchResult = () => {
  const { columns, setColumns } = useSearchUserCreatedTasks();
  const value = useMemo(
    () => ({
      entityType: ENTITIES_TYPES.TASK,
      setColumns,
    }),
    [setColumns]
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
