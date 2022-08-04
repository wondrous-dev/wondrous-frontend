import { useLazyQuery } from '@apollo/client';
import { GET_PROPOSALS_USER_CAN_REVIEW, GET_SUBMISSIONS_USER_CAN_REVIEW } from 'graphql/queries/workflowBoards';
import { useCallback, useEffect, useState } from 'react';
import { LIMIT } from 'services/board';
import { TASK_STATUS_PROPOSAL_REQUEST, TASK_STATUS_SUBMISSION_REQUEST, MEMBERSHIP_REQUESTS } from 'utils/constants';
import { GET_JOIN_ORG_REQUESTS, GET_JOIN_POD_REQUESTS } from 'graphql/queries';

const useGetProposalsUserCanReview = ({ isAdmin, filters }) => {
  const [hasMore, setHasMore] = useState(true);
  const [getProposalsUserCanReview, { data, fetchMore: getProposalsUserCanReviewFetchMore, loading }] = useLazyQuery(
    GET_PROPOSALS_USER_CAN_REVIEW,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (isAdmin) {
      getProposalsUserCanReview({
        variables: {
          limit: LIMIT,
          offset: 0,
          orgId: filters?.orgId,
          podIds: filters?.podIds,
          date: filters?.date,
        },
      }).then(({ data }) => {
        setHasMore(data?.getProposalsUserCanReview?.length >= LIMIT);
      });
    }
  }, [getProposalsUserCanReview, isAdmin, filters]);

  const handleFetchMore = () => {
    if (hasMore) {
      getProposalsUserCanReviewFetchMore({
        variables: {
          offset: data?.getProposalsUserCanReview.length,
          orgId: filters?.orgId,
          podIds: filters?.podIds,
          date: filters?.date,
        },
      }).then(({ data }) => {
        setHasMore(data?.getProposalsUserCanReview?.length >= LIMIT);
      });
    }
  };
  return {
    getProposalsUserCanReviewData: data?.getProposalsUserCanReview,
    getProposalsUserCanReviewFetchMore: handleFetchMore,
    hasMoreProposalsToReview: hasMore,
    proposalsLoading: loading,
  };
};

const useGetSubmissionsUserCanReview = ({ isAdmin, filters }) => {
  const [hasMore, setHasMore] = useState(true);
  const [getSubmissionsUserCanReview, { data, fetchMore: getSubmissionsUserCanReviewFetchMore, loading }] =
    useLazyQuery(GET_SUBMISSIONS_USER_CAN_REVIEW, {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    });

  useEffect(() => {
    if (isAdmin) {
      getSubmissionsUserCanReview({
        variables: {
          limit: LIMIT,
          offset: 0,
          orgId: filters?.orgId,
          podIds: filters?.podIds,
          date: filters?.date,
        },
      }).then(({ data }) => {
        setHasMore(data?.getSubmissionsUserCanReview?.length >= LIMIT);
      });
    }
  }, [getSubmissionsUserCanReview, isAdmin, filters]);

  const handleFetchMore = () => {
    if (hasMore) {
      getSubmissionsUserCanReviewFetchMore({
        variables: {
          offset: data?.getSubmissionsUserCanReview?.length,
          orgId: filters?.orgId,
          podIds: filters?.podIds,
          date: filters?.date,
        },
      }).then(({ data }) => {
        setHasMore(data?.getSubmissionsUserCanReview?.length >= LIMIT);
      });
    }
  };

  return {
    getSubmissionsUserCanReviewData: data?.getSubmissionsUserCanReview,
    getSubmissionsUserCanReviewFetchMore: handleFetchMore,
    hasMoreSubmissionsToReview: hasMore,
    submissionsLoading: loading,
  };
};

const useGetMembershipRequests = ({ isAdmin, filters }) => {
  const [hasMoreOrgRequests, setHasMoreOrgRequests] = useState(true);
  const [hasMorePodRequests, setHasMorePodRequests] = useState(true);

  const [
    getJoinOrgRequests,
    {
      data: getJoinOrgRequestsData = { getJoinOrgRequests: [] },
      fetchMore: fetchMoreJoinOrgRequests,
      loading: orgRequestsLoading,
    },
  ] = useLazyQuery(GET_JOIN_ORG_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });
  const [
    getJoinPodRequests,
    {
      data: getJoinPodRequestsData = { getJoinPodRequests: [] },
      fetchMore: fetchMoreJoinPodRequests,
      loading: podRequestsLoading,
    },
  ] = useLazyQuery(GET_JOIN_POD_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (isAdmin) {
      getJoinOrgRequests({
        variables: { limit: LIMIT, offset: 0, podIds: filters?.podIds, orgId: filters?.orgId, date: filters?.date },
      }).then(({ data }) => setHasMoreOrgRequests(data?.getJoinOrgRequestsData >= LIMIT));
      getJoinPodRequests({
        variables: { limit: LIMIT, offset: 0, podIds: filters?.podIds, orgId: filters?.orgId, date: filters?.date },
      }).then(({ data }) => setHasMorePodRequests(data?.getJoinPodRequestsData >= LIMIT));
    }
  }, [getJoinOrgRequests, getJoinPodRequests, isAdmin, filters]);

  const handleFetchMore = () => {
    if (hasMoreOrgRequests) {
      fetchMoreJoinOrgRequests({
        variables: {
          offset: getJoinOrgRequestsData?.getJoinOrgRequests?.length,
          limit: LIMIT,
          podIds: filters?.podIds,
          orgId: filters?.orgId,
          date: filters?.date,
        },
      }).then(({ data }) => setHasMoreOrgRequests(data?.getJoinOrgRequestsData >= LIMIT));
    }

    if (hasMorePodRequests) {
      fetchMoreJoinPodRequests({
        variables: {
          offset: getJoinPodRequestsData?.getJoinPodRequests?.length,
          limit: LIMIT,
          podIds: filters?.podIds,
          orgId: filters?.orgId,
          date: filters?.date,
        },
      }).then(({ data }) => setHasMorePodRequests(data?.getJoinPodRequestsData >= LIMIT));
    }
  };

  const memberShipRequests = [
    ...getJoinOrgRequestsData?.getJoinOrgRequests,
    ...getJoinPodRequestsData?.getJoinPodRequests,
  ];
  return {
    memberShipRequests,
    getMembershipRequestsFetchMore: handleFetchMore,
    hasMoreMembershipRequests: hasMoreOrgRequests || hasMorePodRequests,
    membershipsLoading: orgRequestsLoading || podRequestsLoading,
  };
};

export const useAdminColumns = (args) => {
  const {
    getProposalsUserCanReviewData,
    getProposalsUserCanReviewFetchMore,
    hasMoreProposalsToReview,
    proposalsLoading,
  } = useGetProposalsUserCanReview({
    ...args,
  });

  const {
    getSubmissionsUserCanReviewData,
    getSubmissionsUserCanReviewFetchMore,
    hasMoreSubmissionsToReview,
    submissionsLoading,
  } = useGetSubmissionsUserCanReview({
    ...args,
  });

  const { memberShipRequests, getMembershipRequestsFetchMore, hasMoreMembershipRequests, membershipsLoading } =
    useGetMembershipRequests({
      ...args,
    });

  const handleLoadMore = (type) => {
    if (type === MEMBERSHIP_REQUESTS) return getMembershipRequestsFetchMore();
    if (type === TASK_STATUS_PROPOSAL_REQUEST) return getProposalsUserCanReviewFetchMore();
    if (type === TASK_STATUS_SUBMISSION_REQUEST) return getSubmissionsUserCanReviewFetchMore();
  };

  const adminColumns = [
    {
      type: MEMBERSHIP_REQUESTS,
      items: memberShipRequests,
      hasMore: hasMoreMembershipRequests,
      loading: membershipsLoading,
    },
    {
      type: TASK_STATUS_PROPOSAL_REQUEST,
      items: getProposalsUserCanReviewData,
      hasMore: hasMoreProposalsToReview,
      loading: proposalsLoading,
    },
    {
      type: TASK_STATUS_SUBMISSION_REQUEST,
      items: getSubmissionsUserCanReviewData,
      hasMore: hasMoreSubmissionsToReview,
      loading: submissionsLoading,
    },
  ];
  return { adminColumns, handleAdminColumnsLoadMore: handleLoadMore };
};
