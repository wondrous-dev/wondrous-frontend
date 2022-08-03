import { useLazyQuery } from '@apollo/client';
import { GET_PROPOSALS_USER_CAN_REVIEW, GET_SUBMISSIONS_USER_CAN_REVIEW } from 'graphql/queries/workflowBoards';
import { useCallback, useEffect, useState } from 'react';
import { LIMIT } from 'services/board';
import { TASK_STATUS_PROPOSAL_REQUEST, TASK_STATUS_SUBMISSION_REQUEST, MEMBERSHIP_REQUESTS } from 'utils/constants';
import { GET_JOIN_ORG_REQUESTS, GET_JOIN_POD_REQUESTS } from 'graphql/queries';

const useGetProposalsUserCanReview = ({ adminColumns, isAdmin, podIds, filters }) => {
  const [hasMore, setHasMore] = useState(true);
  const [getProposalsUserCanReview, { data, fetchMore: getProposalsUserCanReviewFetchMore }] =
    useLazyQuery(GET_PROPOSALS_USER_CAN_REVIEW);

  useEffect(() => {
    if (isAdmin) {
      getProposalsUserCanReview({
        variables: {
          limit: LIMIT,
          offset: 0,
          orgId: filters?.orgId,
          podIds: filters?.podIds,
        },
      }).then(({ data }) => {
        setHasMore(data?.getProposalsUserCanReview?.length >= LIMIT);
      });
    }
  }, [getProposalsUserCanReview, isAdmin, podIds, filters]);

  const handleFetchMore = useCallback(() => {
    if (hasMore) {
      getProposalsUserCanReviewFetchMore({
        variables: {
          offset: data?.getProposalsUserCanReview.length,
          orgId: filters?.orgId,
          podIds: filters?.podIds,
        },
      }).then(({ data }) => {
        setHasMore(data?.getProposalsUserCanReview?.length >= LIMIT);
      });
    }
  }, [getProposalsUserCanReviewFetchMore, hasMore, data, filters]);

  return {
    getProposalsUserCanReviewData: data?.getProposalsUserCanReview,
    getProposalsUserCanReviewFetchMore: handleFetchMore,
    hasMoreProposalsToReview: hasMore,
  };
};

const useGetSubmissionsUserCanReview = ({ isAdmin, statuses, podIds, adminColumns, filters }) => {
  const [hasMore, setHasMore] = useState(true);
  const [getSubmissionsUserCanReview, { data, fetchMore: getSubmissionsUserCanReviewFetchMore }] = useLazyQuery(
    GET_SUBMISSIONS_USER_CAN_REVIEW,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    if (isAdmin) {
      getSubmissionsUserCanReview({
        variables: {
          podIds: filters?.podIds,
          limit: LIMIT,
          offset: 0,
          orgId: filters?.orgId,
          date: filters?.date,
        },
      }).then(({ data }) => {
        setHasMore(data?.getSubmissionsUserCanReview?.length >= LIMIT);
      });
    }
  }, [getSubmissionsUserCanReview, isAdmin, filters]);

  const handleFetchMore = useCallback(() => {
    if (hasMore) {
      getSubmissionsUserCanReviewFetchMore({
        variables: {
          offset: data?.getSubmissionsUserCanReview?.length,
          limit: LIMIT,
          orgId: filters?.orgId,
          podIds: filters?.podIds,
        },
      }).then(({ data }) => {
        setHasMore(data?.getSubmissionsUserCanReview?.length >= LIMIT);
      });
    }
  }, [data, hasMore, getSubmissionsUserCanReviewFetchMore]);

  return {
    getSubmissionsUserCanReviewData: data?.getSubmissionsUserCanReview,
    getSubmissionsUserCanReviewFetchMore: handleFetchMore,
    hasMoreSubmissionsToReview: hasMore,
  };
};

const useGetMembershipRequests = ({ adminColumns, isAdmin }) => {
  const [hasMoreOrgRequests, setHasMoreOrgRequests] = useState(true);
  const [hasMorePodRequests, setHasMorePodRequests] = useState(true);

  const [
    getJoinOrgRequests,
    { data: getJoinOrgRequestsData = { getJoinOrgRequests: [] }, fetchMore: fetchMoreJoinOrgRequests },
  ] = useLazyQuery(GET_JOIN_ORG_REQUESTS);
  const [
    getJoinPodRequests,
    { data: getJoinPodRequestsData = { getJoinPodRequests: [] }, fetchMore: fetchMoreJoinPodRequests },
  ] = useLazyQuery(GET_JOIN_POD_REQUESTS);

  useEffect(() => {
    if (isAdmin) {
      getJoinOrgRequests().then(({ data }) => setHasMoreOrgRequests(data?.getJoinOrgRequestsData >= LIMIT));
      getJoinPodRequests().then(({ data }) => setHasMorePodRequests(data?.getJoinPodRequestsData >= LIMIT));
    }
  }, [getJoinOrgRequests, getJoinPodRequests, isAdmin]);

  const handleFetchMore = useCallback(() => {
    if (hasMoreOrgRequests) {
      fetchMoreJoinOrgRequests({
        variables: {
          offset: getJoinOrgRequestsData?.getJoinOrgRequests?.length,
          limit: LIMIT,
        },
      }).then(({ data }) => setHasMoreOrgRequests(data?.getJoinOrgRequestsData >= LIMIT));
    }

    if (hasMorePodRequests) {
      fetchMoreJoinPodRequests({
        variables: {
          offset: getJoinPodRequestsData?.getJoinPodRequests?.length,
          limit: LIMIT,
        },
      }).then(({ data }) => setHasMorePodRequests(data?.getJoinPodRequestsData >= LIMIT));
    }
  }, [adminColumns, fetchMoreJoinOrgRequests, fetchMoreJoinPodRequests]);

  const memberShipRequests = [
    ...getJoinOrgRequestsData?.getJoinOrgRequests,
    ...getJoinPodRequestsData?.getJoinPodRequests,
  ];
  return {
    memberShipRequests,
    getMembershipRequestsFetchMore: handleFetchMore,
    hasMoreMembershipRequests: hasMoreOrgRequests || hasMorePodRequests,
  };
};

export const useAdminColumns = (args) => {
  const { isAdmin } = args;
  const [adminColumns, setAdminColumns] = useState([]);
  const { getProposalsUserCanReviewData, getProposalsUserCanReviewFetchMore, hasMoreProposalsToReview } =
    useGetProposalsUserCanReview({
      adminColumns,
      ...args,
    });

  const { getSubmissionsUserCanReviewData, getSubmissionsUserCanReviewFetchMore, hasMoreSubmissionsToReview } =
    useGetSubmissionsUserCanReview({
      adminColumns,
      ...args,
    });

  const { memberShipRequests, getMembershipRequestsFetchMore, hasMoreMembershipRequests } = useGetMembershipRequests({
    adminColumns,
    isAdmin,
  });

  const handleLoadMore = (type) => {
    if (type === MEMBERSHIP_REQUESTS) return getMembershipRequestsFetchMore();
    if (type === TASK_STATUS_PROPOSAL_REQUEST) return getProposalsUserCanReviewFetchMore();
    if (type === TASK_STATUS_SUBMISSION_REQUEST) return getSubmissionsUserCanReviewFetchMore();
  };
  useEffect(() => {
    setAdminColumns([
      {
        type: MEMBERSHIP_REQUESTS,
        items: memberShipRequests,
        hasMore: hasMoreMembershipRequests,
      },
      {
        type: TASK_STATUS_PROPOSAL_REQUEST,
        items: getProposalsUserCanReviewData,
        hasMore: hasMoreProposalsToReview,
      },
      {
        type: TASK_STATUS_SUBMISSION_REQUEST,
        items: getSubmissionsUserCanReviewData,
        hasMore: hasMoreSubmissionsToReview,
      },
    ]);
  }, [getProposalsUserCanReviewData, getSubmissionsUserCanReviewData]);

  return { adminColumns, handleAdminColumnsLoadMore: handleLoadMore };
};
