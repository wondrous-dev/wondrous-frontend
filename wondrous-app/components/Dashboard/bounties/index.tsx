import { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { UserBoardContext } from 'utils/contexts';
import { GET_USER_TASK_BOARD_SUBMISSIONS, SEARCH_TASKS_FOR_USER_BOARD_VIEW } from 'graphql/queries';
import { LIMIT, generateUserDashboardFilters } from 'services/board';
import BoardWrapper from 'components/Dashboard/boards/BoardWrapper';
import SubmissionBoard from 'components/SubmissionBoard';
import withCardsLayout from 'components/Common/Boards/withCardsLayout';
import { ViewType } from 'types/common';
import { useMe } from 'components/Auth/withAuth';
import { useCreateEntityContext } from 'utils/hooks';
import { ENTITIES_TYPES, PRIVACY_LEVEL, TASKS_DEFAULT_STATUSES, STATUS_OPEN } from 'utils/constants';
import apollo from 'services/apollo';
import { Spinner } from './styles';

const Board = withCardsLayout(SubmissionBoard, 4);
const BountiesDashboard = ({ isAdmin }) => {
  const loggedInUser = useMe();
  const { userOrgs } = useCreateEntityContext();
  const [hasMore, setHasMore] = useState(true);
  const { data, error, loading, fetchMore, variables, previousData, refetch } = useQuery(
    GET_USER_TASK_BOARD_SUBMISSIONS,
    {
      variables: {
        limit: LIMIT,
        offset: 0,
        userId: loggedInUser?.id,
        statuses: [STATUS_OPEN],
      },
      onCompleted: ({ getUserTaskBoardSubmissions }) => {
        if (!previousData) {
          const hasMoreData = getUserTaskBoardSubmissions?.length >= LIMIT;
          if (hasMoreData !== hasMore) setHasMore(hasMoreData);
        }
      },
    }
  );

  const filterSchema = generateUserDashboardFilters({
    userId: loggedInUser?.id,
    orgs: userOrgs?.getUserOrgs,
    type: ENTITIES_TYPES.BOUNTY,
  });

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
  }, [hasMore, fetchMore, data, variables, setHasMore]);

  const onFilterChange = (filtersToApply) => {
    const { privacyLevel, ...rest } = filtersToApply;
    const filters = {
      ...rest,
      limit: variables.limit,
      offset: variables.offset,
      ...(privacyLevel === PRIVACY_LEVEL.public && { onlyPublic: true }),
    };
    refetch({ ...filters }).then(({ data }) => setHasMore(data?.getUserTaskBoardSubmissions?.length >= LIMIT));
  };

  function handleSearch(searchString: string) {
    const searchTasksArgs = {
      variables: {
        userId: loggedInUser?.id,
        podIds: [],
        limit: LIMIT,
        types: [ENTITIES_TYPES.BOUNTY],
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
