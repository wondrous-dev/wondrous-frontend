import { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { UserBoardContext } from 'utils/contexts';
import { GET_USER_BOARD_BOUNTIES, SEARCH_TASKS_FOR_USER_BOARD_VIEW } from 'graphql/queries';
import { LIMIT } from 'services/board';
import BoardWrapper from 'components/Dashboard/boards/BoardWrapper';
import BountyBoard from 'components/Common/BountyBoard';
import withCardsLayout from 'components/Common/Boards/withCardsLayout';
import { ViewType } from 'types/common';
import { Spinner } from './styles';
import { generateUserDashboardFilters } from 'services/board';
import { useMe } from 'components/Auth/withAuth';
import { useCreateEntityContext } from 'utils/hooks';
import { ENTITIES_TYPES, PRIVACY_LEVEL, TASKS_DEFAULT_STATUSES } from 'utils/constants';
import apollo from 'services/apollo';

const Board = withCardsLayout(BountyBoard, 3);
const BountiesDashboard = ({ isAdmin }) => {
  const loggedInUser = useMe();
  const { userOrgs } = useCreateEntityContext();
  const [hasMore, setHasMore] = useState(true);
  const { data, error, loading, fetchMore, variables, previousData, refetch } = useQuery(GET_USER_BOARD_BOUNTIES, {
    variables: {
      input: {
        limit: LIMIT,
        offset: 0,
      },
    },
    onCompleted: ({ getUserTaskBoardBounties }) => {
      if (!previousData) {
        const hasMoreData = getUserTaskBoardBounties?.length >= LIMIT;
        if (hasMoreData !== hasMore) setHasMore(hasMoreData);
      }
    },
  });

  const filterSchema = generateUserDashboardFilters({
    userId: loggedInUser?.id,
    orgs: userOrgs?.getUserOrgs,
    type: ENTITIES_TYPES.BOUNTY,
  });

  const onLoadMore = useCallback(() => {
    if (hasMore)
      fetchMore({
        variables: {
          input: {
            ...variables.input,
            offset: data?.getUserTaskBoardBounties.length,
          },
        },
      }).then(({ data }) => {
        const hasMoreData = data?.getUserTaskBoardBounties?.length >= LIMIT;
        if (hasMoreData !== hasMore) setHasMore(hasMoreData);
      });
  }, [hasMore, fetchMore, data, variables, setHasMore]);

  const onFilterChange = (filtersToApply) => {
    let { privacyLevel, ...rest } = filtersToApply;
    const filters = {
      input: {
        ...rest,
        limit: variables.input.limit,
        offset: variables.input.offset,
        ...(privacyLevel === PRIVACY_LEVEL.public && { onlyPublic: true }),
      },
    };
    refetch({ ...filters }).then(({ data }) => setHasMore(data?.getUserTaskBoardBounties?.length >= LIMIT));
  };

  function handleSearch(searchString: string) {
    const searchTasksArgs = {
      variables: {
        userId: loggedInUser?.id,
        podIds: [],
        limit: LIMIT,
        types: [ENTITIES_TYPES.BOUNTY],
        offset: 0,
        // Needed to exclude proposals
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
            columns={data?.getUserTaskBoardBounties}
            hasMore={hasMore}
            activeView={ViewType.Grid}
          />
        )}
      </BoardWrapper>
    </UserBoardContext.Provider>
  );
};

export default BountiesDashboard;
