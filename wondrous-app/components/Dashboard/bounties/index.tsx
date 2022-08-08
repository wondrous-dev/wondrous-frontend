import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { TaskFilter } from 'types/task';
import { UserBoardContext } from 'utils/contexts';
import { GET_USER_BOARD_BOUNTIES } from 'graphql/queries';
// import { LIMIT } from 'services/board';
import BoardWrapper from 'components/Dashboard/boards/BoardWrapper';
import BountyBoard from 'components/Common/BountyBoard';
import withCardsLayout from 'components/Common/Boards/withCardsLayout';
import { ViewType } from 'types/common';
import { Spinner } from './styles';

const LIMIT = 1;
const Board = withCardsLayout(BountyBoard, 3);
const BountiesDashboard = ({ isAdmin }) => {
  const [hasMore, setHasMore] = useState(true);
  const { data, error, loading, fetchMore, variables } = useQuery(GET_USER_BOARD_BOUNTIES, {
    variables: {
      input: {
        limit: LIMIT,
        offset: 0,
      },
    },
    onCompleted: ({ getUserTaskBoardBounties }) => {
      const hasMoreData = getUserTaskBoardBounties?.length >= LIMIT;
      if (hasMoreData !== hasMore) setHasMore(hasMoreData);
    },
  });

  const onLoadMore = useCallback(() => {
    fetchMore({
      variables: {
        input: {
          ...variables.input,
          offset: data?.getUserTaskBoardBounties.length,
        },
      },
    });
  }, [hasMore, fetchMore, data]);

  const [filters, setFilters] = useState<TaskFilter>({
    podIds: [],
    statuses: [],
    date: null,
    privacyLevel: null,
    orgId: null,
  });

  return (
    <UserBoardContext.Provider value={{}}>
      <BoardWrapper
        isAdmin={isAdmin}
        onSearch={() => {}}
        filterSchema={[]}
        onFilterChange={() => {}}
        statuses={[]}
        podIds={() => {}}
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
