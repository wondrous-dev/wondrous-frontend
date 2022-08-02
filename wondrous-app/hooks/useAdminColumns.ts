import { useLazyQuery } from '@apollo/client';
import { GET_PROPOSALS_USER_CAN_REVIEW, GET_SUBMISSIONS_USER_CAN_REVIEW } from 'graphql/queries/workflowBoards';
import uniqBy from 'lodash/uniqBy';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { LIMIT } from 'services/board';
import {
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_SUBMISSION_REQUEST,
  MEMBERSHIP_REQUESTS,
} from 'utils/constants';
import { GET_JOIN_ORG_REQUESTS, GET_JOIN_POD_REQUESTS } from 'graphql/queries';

const proposal = {
  status: TASK_STATUS_PROPOSAL_REQUEST,
  tasks: [],
};

const submissions = {
  status: TASK_STATUS_SUBMISSION_REQUEST,
  tasks: [],
};

const memberships = {
  status: MEMBERSHIP_REQUESTS,
  tasks: [],
};

const baseColumnsAdmin = [memberships, proposal, submissions];

const statusIncludedOrEmpty = ({ status, statuses }) => {
  return statuses.includes(status) || isEmpty(statuses);
};

const setStatus = ({ statuses, setSelectedStatus }) => {
  if (statuses.length > 0) {
    const status =
      statuses[0] === TASK_STATUS_REQUESTED ? TASK_STATUS_PROPOSAL_REQUEST : TASK_STATUS_SUBMISSION_REQUEST;
    setSelectedStatus(status);
  } else {
    setSelectedStatus(null);
  }
};

const status = {
  [TASK_STATUS_PROPOSAL_REQUEST]: TASK_STATUS_REQUESTED,
  [TASK_STATUS_SUBMISSION_REQUEST]: TASK_STATUS_IN_REVIEW,
};

const useUpdateAdminStatus = ({ isAdmin, selectedStatus, setStatuses }) => {
  useEffect(() => {
    if (isAdmin) {
      if (selectedStatus) {
        const selected = status[selectedStatus];
        setStatuses([selected]);
      } else {
        setStatuses([]);
      }
    }
  }, [setStatuses, selectedStatus, isAdmin]);
};

const useGetProposalsUserCanReview = ({ adminColumns, isAdmin, podIds, statuses }) => {
  const [hasMore, setHasMore] = useState(true);
  const [getProposalsUserCanReview, { data, fetchMore: getProposalsUserCanReviewFetchMore, previousData }] =
    useLazyQuery(GET_PROPOSALS_USER_CAN_REVIEW);

  useEffect(() => {
    if (isAdmin) {
      getProposalsUserCanReview({
        variables: {
          podIds,
          limit: LIMIT,
          offset: 0,
        },
      }).then(({ data }) => {
        setHasMore(data?.getProposalsUserCanReview?.length >= LIMIT);
      });
    }
  }, [getProposalsUserCanReview, isAdmin, podIds, statuses]);

  const handleFetchMore = useCallback(() => {
    if (statusIncludedOrEmpty({ status: TASK_STATUS_REQUESTED, statuses }) && hasMore) {
      getProposalsUserCanReviewFetchMore({
        variables: {
          offset: data?.getProposalsUserCanReview.length,
        },
      }).then(({ data }) => {
        setHasMore(data?.getProposalsUserCanReview?.length >= LIMIT);
      });
    }
  }, [getProposalsUserCanReviewFetchMore, statuses, hasMore, data]);

  return {
    getProposalsUserCanReviewData: data?.getProposalsUserCanReview,
    getProposalsUserCanReviewFetchMore: handleFetchMore,
    hasMoreProposalsToReview: hasMore,
  };
};

const useGetSubmissionsUserCanReview = ({ isAdmin, statuses, podIds, adminColumns }) => {
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
          podIds,
          limit: LIMIT,
          offset: 0,
        },
      }).then(({ data }) => {
        setHasMore(data?.getSubmissionsUserCanReview?.length >= LIMIT);
      });
    }
  }, [getSubmissionsUserCanReview, isAdmin, podIds, statuses]);

  const handleFetchMore = useCallback(() => {
    if (statusIncludedOrEmpty({ status: TASK_STATUS_IN_REVIEW, statuses }) && hasMore) {
      getSubmissionsUserCanReviewFetchMore({
        variables: {
          offset: data?.getSubmissionsUserCanReview?.length,
          limit: LIMIT,
        },
      }).then(({ data }) => {
        setHasMore(data?.getSubmissionsUserCanReview?.length >= LIMIT);
      });
    }
  }, [data, hasMore, getSubmissionsUserCanReviewFetchMore, statuses]);

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
  const { statuses, setSelectedStatus, isAdmin } = args;
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
        items: memberShipRequests || [],
        hasMore: hasMoreMembershipRequests,
      },
      {
        type: TASK_STATUS_PROPOSAL_REQUEST,
        items: getProposalsUserCanReviewData || [],
        hasMore: hasMoreProposalsToReview,
      },
      {
        type: TASK_STATUS_SUBMISSION_REQUEST,
        items: getSubmissionsUserCanReviewData || [],
        hasMore: hasMoreSubmissionsToReview,
      },
    ]);
    setStatus({ statuses, setSelectedStatus });
  }, [getProposalsUserCanReviewData, getSubmissionsUserCanReviewData, setSelectedStatus, statuses]);

  useUpdateAdminStatus(args);
  return { adminColumns, handleAdminColumnsLoadMore: handleLoadMore };
};
