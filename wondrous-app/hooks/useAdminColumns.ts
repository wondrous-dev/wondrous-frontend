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
  const [getProposalsUserCanReview, { data, fetchMore: getProposalsUserCanReviewFetchMore }] = useLazyQuery(
    GET_PROPOSALS_USER_CAN_REVIEW,
    {
      fetchPolicy: 'cache-and-network',
      onCompleted: ({ getProposalsUserCanReview }) => {
        setHasMore(getProposalsUserCanReview?.length >= LIMIT);
      },
    }
  );

  useEffect(() => {
    if (isAdmin) {
      getProposalsUserCanReview({
        variables: {
          podIds,
          limit: LIMIT,
          offset: 0,
        },
      });
    }
  }, [getProposalsUserCanReview, isAdmin, podIds, statuses]);

  const handleFetchMore = useCallback(() => {
    if (statusIncludedOrEmpty({ status: TASK_STATUS_REQUESTED, statuses }) && hasMore) {
      getProposalsUserCanReviewFetchMore({
        variables: {
          offset: adminColumns?.[0]?.tasks?.length,
        },
      });
    }
  }, [adminColumns, getProposalsUserCanReviewFetchMore, statuses, hasMore]);

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
      onCompleted: ({ getSubmissionsUserCanReview }) => setHasMore(getSubmissionsUserCanReview?.length >= LIMIT),
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
      });
    }
  }, [getSubmissionsUserCanReview, isAdmin, podIds, statuses]);

  const handleFetchMore = useCallback(() => {
    if (statusIncludedOrEmpty({ status: TASK_STATUS_IN_REVIEW, statuses }) && hasMore) {
      getSubmissionsUserCanReviewFetchMore({
        variables: {
          offset: adminColumns?.[1]?.tasks?.length,
          limit: LIMIT,
        },
      });
    }
  }, [adminColumns, hasMore, getSubmissionsUserCanReviewFetchMore, statuses]);

  return {
    getSubmissionsUserCanReviewData: data?.getSubmissionsUserCanReview,
    getSubmissionsUserCanReviewFetchMore: handleFetchMore,
    hasMoreSubmissionsToReview: hasMore,
  };
};

const updateAdminColumns = (adminColumns, { tasks = [], column, included }) => {
  const copyAdminColumns = cloneDeep(isEmpty(adminColumns) ? baseColumnsAdmin : adminColumns);
  const newColumns = copyAdminColumns.map((col, index) =>
    index === column ? { ...col, tasks: included ? uniqBy([...col.tasks, ...tasks], (i) => i.id) : [] } : col
  );
  return newColumns;
};

const useGetMembershipRequests = ({ adminColumns, isAdmin }) => {
  const [hasMoreOrgRequests, setHasMoreOrgRequests] = useState(true);
  const [hasMorePodRequests, setHasMorePodRequests] = useState(true);

  const [
    getJoinOrgRequests,
    { data: getJoinOrgRequestsData = { getJoinOrgRequests: [] }, fetchMore: fetchMoreJoinOrgRequests },
  ] = useLazyQuery(GET_JOIN_ORG_REQUESTS, {
    onCompleted: ({ getJoinOrgRequests }) => {
      setHasMoreOrgRequests(getJoinOrgRequests?.length >= LIMIT);
    },
  });
  const [
    getJoinPodRequests,
    { data: getJoinPodRequestsData = { getJoinPodRequests: [] }, fetchMore: fetchMoreJoinPodRequests },
  ] = useLazyQuery(GET_JOIN_POD_REQUESTS, {
    onCompleted: ({ getJoinPodRequests }) => {
      setHasMorePodRequests(getJoinPodRequests?.length >= LIMIT);
    },
  });

  useEffect(() => {
    if (isAdmin) {
      getJoinOrgRequests();
      getJoinPodRequests();
    }
  }, [getJoinOrgRequests, getJoinPodRequests, isAdmin]);

  const handleFetchMore = useCallback(() => {
    if (hasMoreOrgRequests) {
      fetchMoreJoinOrgRequests({
        variables: {
          offset: getJoinOrgRequestsData?.getJoinOrgRequests?.length,
          limit: LIMIT,
        },
        updateQuery: (prev, { fetchMoreResult }) => ({
          getJoinOrgRequests: [...prev.getJoinOrgRequests, ...fetchMoreResult.getJoinOrgRequests],
        }),
      });
    }

    if (hasMorePodRequests) {
      fetchMoreJoinPodRequests({
        variables: {
          offset: getJoinPodRequestsData?.getJoinPodRequests?.length,
          limit: LIMIT,
        },
        updateQuery: (prev, { fetchMoreResult }) => ({
          getJoinPodRequestsData: [...prev.getJoinPodRequests, ...fetchMoreResult.getJoinPodRequests],
        }),
      });
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

  const handleLoadMore = useCallback(() => {
    getProposalsUserCanReviewFetchMore();
    getSubmissionsUserCanReviewFetchMore();
    getMembershipRequestsFetchMore();
  }, [getProposalsUserCanReviewFetchMore, getSubmissionsUserCanReviewFetchMore, getMembershipRequestsFetchMore]);

  useEffect(() => {
    setAdminColumns([
      {
        // title: 'Membership requests',
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
