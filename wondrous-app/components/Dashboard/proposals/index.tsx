import { useCallback, useState } from 'react';
import { UserBoardContext } from 'utils/contexts';
import BoardWrapper from 'components/Dashboard/boards/BoardWrapper';
import { useGlobalContext } from 'utils/hooks';
import { useMe } from 'components/Auth/withAuth';
import { useQuery } from '@apollo/client';
import {
  GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD,
  GET_USER_TASK_BOARD_PROPOSALS,
  SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
} from 'graphql/queries';
import { generateUserDashboardFilters, ORG_POD_PROPOSAL_COLUMNS, populateProposalColumns, LIMIT } from 'services/board';
import { ENTITIES_TYPES, PRIVACY_LEVEL, STATUS_APPROVED, STATUS_CLOSED, STATUS_OPEN } from 'utils/constants';
import { Spinner } from 'components/Dashboard/bounties/styles';
import Boards from 'components/Common/Boards';
import apollo from 'services/apollo';

const ProposalsBoard = () => {
  const loggedInUser = useMe();
  const { userOrgs } = useGlobalContext();
  const [hasMore, setHasMore] = useState(true);
  const { data: getPerStatusTaskCountData } = useQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD, {
    variables: {
      userId: loggedInUser?.id,
    },
    skip: !loggedInUser?.id,
  });

  const { data, loading, fetchMore, variables, previousData, refetch } = useQuery(GET_USER_TASK_BOARD_PROPOSALS, {
    variables: {
      limit: LIMIT,
      offset: 0,
      userId: loggedInUser?.id,
      statuses: [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED],
    },
    onCompleted: ({ getUserTaskBoardProposals }) => {
      if (!previousData) {
        const hasMoreData = getUserTaskBoardProposals?.length >= LIMIT;
        setHasMore(hasMoreData);
      }
    },
  });

  const filterSchema = generateUserDashboardFilters({
    userId: loggedInUser?.id,
    orgs: userOrgs?.getUserOrgs,
    type: ENTITIES_TYPES.PROPOSAL,
  });

  const onLoadMore = useCallback(() => {
    if (hasMore)
      fetchMore({
        variables: {
          offset: data?.getUserTaskBoardProposals.length,
        },
      }).then(({ data }) => {
        const hasMoreData = data?.getUserTaskBoardProposals?.length >= LIMIT;
        setHasMore(hasMoreData);
      });
  }, [hasMore, fetchMore, data, variables, setHasMore]);

  const onFilterChange = (filtersToApply) => {
    const { privacyLevel, statuses, podIds, ...rest } = filtersToApply;
    const filters = {
      ...rest,
      limit: variables.limit,
      offset: variables.offset,
      podIds: podIds?.length ? podIds : null,
      statuses: [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED].some((status) => statuses?.includes(status))
        ? statuses
        : [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED],
      ...(privacyLevel === PRIVACY_LEVEL.public && { onlyPublic: true }),
    };
    refetch({ ...filters }).then(({ data }) => setHasMore(data?.getUserTaskBoardProposals?.length >= LIMIT));
  };

  function handleSearch(searchString: string) {
    const searchTaskProposalsArgs = {
      variables: {
        userId: loggedInUser?.id,
        podIds: [],
        statuses: [STATUS_OPEN],
        offset: 0,
        limit: LIMIT,
        searchString,
      },
    };

    const promises: any = [
      apollo.query({
        ...searchTaskProposalsArgs,
        query: SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
      }),
    ];

    return Promise.all(promises).then(([proposals]: any) => ({
      proposals: proposals.data.searchProposalsForUserBoardView,
    }));
  }

  const columns = populateProposalColumns(data?.getUserTaskBoardProposals, ORG_POD_PROPOSAL_COLUMNS);

  return (
    <UserBoardContext.Provider
      value={{
        hasMore,
        columns,
        loggedInUserId: loggedInUser?.id,
        onLoadMore,
        taskCount: getPerStatusTaskCountData?.getPerStatusTaskCountForUserBoard,
        enableViewSwitcher: false,
        setColumns: () => {},
        entityType: ENTITIES_TYPES.PROPOSAL,
        isDragDisabled: true,
      }}
    >
      <BoardWrapper
        isAdmin={false}
        onSearch={handleSearch}
        filterSchema={filterSchema}
        onFilterChange={onFilterChange}
        statuses={[]}
        podIds={[]}
      >
        {loading ? <Spinner /> : <Boards columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />}
      </BoardWrapper>
    </UserBoardContext.Provider>
  );
};

export default ProposalsBoard;
