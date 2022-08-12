import { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { UserBoardContext } from 'utils/contexts';
import { GET_USER_TASK_BOARD_SUBMISSIONS, SEARCH_TASKS_FOR_USER_BOARD_VIEW } from 'graphql/queries';
import { LIMIT, ENTITY_TO_STATUS_MAP } from 'services/board';
import BoardWrapper from 'components/Dashboard/boards/BoardWrapper';
import SubmissionBoard from 'components/SubmissionBoard';
import withCardsLayout from 'components/Common/Boards/withCardsLayout';
import { ViewType } from 'types/common';
import { useMe } from 'components/Auth/withAuth';
import { ENTITIES_TYPES, TASKS_DEFAULT_STATUSES, STATUS_OPEN, STATUS_CHANGE_REQUESTED } from 'utils/constants';
import apollo from 'services/apollo';
import { Spinner } from './styles';

const DEFAULT_SUBMISSION_STATUSES = [STATUS_OPEN, STATUS_CHANGE_REQUESTED];

const Board = withCardsLayout(SubmissionBoard, 4);
const BountiesDashboard = ({ isAdmin }) => {
  const loggedInUser = useMe();
  const [hasMore, setHasMore] = useState(true);
  const { data, loading, fetchMore, previousData, refetch } = useQuery(GET_USER_TASK_BOARD_SUBMISSIONS, {
    skip: !loggedInUser?.id,
    variables: {
      limit: LIMIT,
      offset: 0,
      userId: loggedInUser?.id,
      statuses: DEFAULT_SUBMISSION_STATUSES,
    },
    onCompleted: ({ getUserTaskBoardSubmissions }) => {
      if (!previousData) {
        const hasMoreData = getUserTaskBoardSubmissions?.length >= LIMIT;
        if (hasMoreData !== hasMore) setHasMore(hasMoreData);
      }
    },
  });

  const filterSchema = ENTITY_TO_STATUS_MAP[ENTITIES_TYPES.SUBMISSION];

  const onLoadMore = useCallback(() => {
    if (hasMore)
      fetchMore({
        variables: {
          offset: data?.getUserTaskBoardSubmissions.length,
        },
      }).then(({ data }) => {
        const hasMoreData = data?.getUserTaskBoardSubmissions?.length >= LIMIT;
        if (hasMoreData !== hasMore) setHasMore(hasMoreData);
      });
  }, [hasMore, fetchMore, data, setHasMore]);

  const onFilterChange = (filtersToApply) => {
    const { statuses, ...rest } = filtersToApply;
    const statusesToApply = filtersToApply?.statuses?.length ? filtersToApply.statuses : DEFAULT_SUBMISSION_STATUSES;
    refetch({ ...rest, statuses: statusesToApply }).then(({ data }) =>
      setHasMore(data?.getUserTaskBoardSubmissions?.length >= LIMIT)
    );
  };

  function handleSearch(searchString: string) {
    const searchTasksArgs = {
      variables: {
        userId: loggedInUser?.id,
        podIds: [],
        limit: LIMIT,
        offset: 0,
        statuses: TASKS_DEFAULT_STATUSES,
        searchString,
      },
    };

    const promises: any = [
      apollo.query({
        ...searchTasksArgs,
        query: SEARCH_TASKS_FOR_USER_BOARD_VIEW,
      }),
    ];

    return Promise.all(promises).then(([tasks]: any) => ({
      tasks: tasks.data.searchTasksForUserBoardView,
    }));
  }

  return (
    <UserBoardContext.Provider
      value={{
        searchLabel: 'Search bounties...',
        enableViewSwitcher: false,
        displaySingleViewFilter: true,
      }}
    >
      <BoardWrapper
        isAdmin={isAdmin}
        onSearch={handleSearch}
        filterSchema={filterSchema}
        onFilterChange={onFilterChange}
        statuses={[]}
        podIds={[]}
      >
        {loading ? (
          <Spinner />
        ) : (
          <Board
            onLoadMore={onLoadMore}
            columns={data?.getUserTaskBoardSubmissions}
            hasMore={hasMore}
            activeView={ViewType.Grid}
          />
        )}
      </BoardWrapper>
    </UserBoardContext.Provider>
  );
};

export default BountiesDashboard;
