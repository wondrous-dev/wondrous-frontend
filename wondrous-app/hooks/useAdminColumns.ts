import { useQuery } from '@apollo/client';
import { GET_PROPOSALS_USER_CAN_REVIEW, GET_SUBMISSIONS_USER_CAN_REVIEW } from 'graphql/queries/workflowBoards';
import { useState } from 'react';
import { LIMIT } from 'services/board';
import { GET_JOIN_ORG_REQUESTS, GET_JOIN_POD_REQUESTS } from 'graphql/queries';

export const useGetProposalsUserCanReview = () => {
  const [hasMore, setHasMore] = useState(true);
  const {
    data,
    fetchMore: getProposalsUserCanReviewFetchMore,
    loading,
    refetch,
    variables,
  } = useQuery(GET_PROPOSALS_USER_CAN_REVIEW, {
    variables: {
      limit: LIMIT,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

  const onFilterChange = (filtersToApply) => {
    const filters = {
      ...variables,
      podIds: filtersToApply?.podIds,
      orgId: filtersToApply?.orgId,
      sortOrder: filtersToApply?.sortOrder,
    };
    refetch(filters).then(({ data }) => setHasMore(data?.getProposalsUserCanReview?.length >= LIMIT));
  };

  const handleFetchMore = () => {
    if (hasMore) {
      getProposalsUserCanReviewFetchMore({
        variables: {
          offset: data?.getProposalsUserCanReview.length,
        },
      }).then(({ data }) => {
        setHasMore(data?.getProposalsUserCanReview?.length >= LIMIT);
      });
    }
  };
  return {
    items: data?.getProposalsUserCanReview,
    handleFetchMore,
    hasMore,
    loading,
    onFilterChange,
  };
};

export const useGetSubmissionsUserCanReview = () => {
  const [hasMore, setHasMore] = useState(true);
  const {
    data,
    fetchMore: getSubmissionsUserCanReviewFetchMore,
    refetch,
    loading,
    variables,
  } = useQuery(GET_SUBMISSIONS_USER_CAN_REVIEW, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: LIMIT,
      offset: 0,
    },
  });

  const onFilterChange = (filtersToApply) => {
    const filters = {
      ...variables,
      orgId: filtersToApply?.orgId,
      podIds: filtersToApply?.podIds,
      sortOrder: filtersToApply?.sortOrder,
    };
    refetch(filters).then(({ data }) => setHasMore(data?.getSubmissionsUserCanReview?.length >= LIMIT));
  };

  const handleFetchMore = () => {
    if (hasMore) {
      getSubmissionsUserCanReviewFetchMore({
        variables: {
          offset: data?.getSubmissionsUserCanReview?.length,
        },
      }).then(({ data }) => {
        setHasMore(data?.getSubmissionsUserCanReview?.length >= LIMIT);
      });
    }
  };

  return {
    items: data?.getSubmissionsUserCanReview,
    handleFetchMore,
    hasMore,
    loading,
    onFilterChange,
  };
};

export const useGetMembershipRequests = () => {
  const [hasMoreOrgRequests, setHasMoreOrgRequests] = useState(true);
  const [hasMorePodRequests, setHasMorePodRequests] = useState(true);

  const {
    data: getJoinOrgRequestsData = { getJoinOrgRequests: [] },
    fetchMore: fetchMoreJoinOrgRequests,
    loading: orgRequestsLoading,
    refetch: refetchJoinOrgRequests,
    variables: orgRequestsVariables,
  } = useQuery(GET_JOIN_ORG_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: LIMIT,
      offset: 0,
    },
  });
  const {
    data: getJoinPodRequestsData = { getJoinPodRequests: [] },
    fetchMore: fetchMoreJoinPodRequests,
    loading: podRequestsLoading,
    refetch: refetchJoinPodRequests,
    variables: podRequestsVariables,
  } = useQuery(GET_JOIN_POD_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: LIMIT,
      offset: 0,
    },
  });

  const onFilterChange = (filtersToApply) => {
    const filters = {
      orgId: filtersToApply?.orgId,
      podIds: filtersToApply?.podIds,
      sortOrder: filtersToApply?.sortOrder,
    };
    refetchJoinOrgRequests({ ...orgRequestsVariables, ...filters }).then(({ data }) =>
      setHasMoreOrgRequests(data?.getJoinOrgRequestsData?.length >= LIMIT)
    );
    refetchJoinPodRequests({ ...podRequestsVariables, ...filters }).then(({ data }) =>
      setHasMorePodRequests(data?.getJoinPodRequestsData?.length >= LIMIT)
    );
  };

  const handleFetchMore = () => {
    if (hasMoreOrgRequests) {
      fetchMoreJoinOrgRequests({
        variables: {
          offset: getJoinOrgRequestsData?.getJoinOrgRequests?.length,
          limit: LIMIT,
        },
      }).then(({ data }) => {
        setHasMoreOrgRequests(data?.getJoinOrgRequests?.length >= LIMIT);
      });
    }

    if (hasMorePodRequests) {
      fetchMoreJoinPodRequests({
        variables: {
          offset: getJoinPodRequestsData?.getJoinPodRequests?.length,
          limit: LIMIT,
        },
      }).then(({ data }) => {
        setHasMorePodRequests(data?.getJoinPodRequests?.length >= LIMIT);
      });
    }
  };

  const memberShipRequests = [
    ...getJoinOrgRequestsData?.getJoinOrgRequests,
    ...getJoinPodRequestsData?.getJoinPodRequests,
  ];
  return {
    items: memberShipRequests,
    handleFetchMore,
    hasMore: hasMoreOrgRequests || hasMorePodRequests,
    loading: orgRequestsLoading || podRequestsLoading,
    onFilterChange,
  };
};
