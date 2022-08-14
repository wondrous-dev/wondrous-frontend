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
} from 'utils/constants';

const proposal = {
  status: TASK_STATUS_PROPOSAL_REQUEST,
  tasks: [],
};

const submissions = {
  status: TASK_STATUS_SUBMISSION_REQUEST,
  tasks: [],
};

const baseColumnsAdmin = [proposal, submissions];

const statusIncludedOrEmpty = ({ status, statuses }) => statuses.includes(status) || isEmpty(statuses);

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
  const [dataLength, setDataLength] = useState(LIMIT);
  const [getProposalsUserCanReview, { data, fetchMore: getProposalsUserCanReviewFetchMore }] = useLazyQuery(
    GET_PROPOSALS_USER_CAN_REVIEW,
    {
      fetchPolicy: 'cache-and-network',
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
    if (statusIncludedOrEmpty({ status: TASK_STATUS_REQUESTED, statuses }) && dataLength >= LIMIT) {
      getProposalsUserCanReviewFetchMore({
        variables: {
          offset: adminColumns?.[0]?.tasks?.length,
        },
      }).then(({ data }) => setDataLength(data.getProposalsUserCanReview.length));
    }
  }, [adminColumns, dataLength, getProposalsUserCanReviewFetchMore, statuses]);

  return {
    getProposalsUserCanReviewData: data?.getProposalsUserCanReview,
    getProposalsUserCanReviewFetchMore: handleFetchMore,
  };
};

const useGetSubmissionsUserCanReview = ({ isAdmin, statuses, podIds, adminColumns }) => {
  const [dataLength, setDataLength] = useState(LIMIT);
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
      });
    }
  }, [getSubmissionsUserCanReview, isAdmin, podIds, statuses]);

  const handleFetchMore = useCallback(() => {
    if (statusIncludedOrEmpty({ status: TASK_STATUS_IN_REVIEW, statuses }) && dataLength >= LIMIT) {
      getSubmissionsUserCanReviewFetchMore({
        variables: {
          offset: adminColumns?.[1]?.tasks?.length,
          limit: LIMIT,
        },
      }).then(({ data }) => setDataLength(data.getSubmissionsUserCanReview.length));
    }
  }, [adminColumns, dataLength, getSubmissionsUserCanReviewFetchMore, statuses]);

  return {
    getSubmissionsUserCanReviewData: data?.getSubmissionsUserCanReview,
    getSubmissionsUserCanReviewFetchMore: handleFetchMore,
  };
};

const updateAdminColumns = (adminColumns, { tasks = [], column, included }) => {
  const copyAdminColumns = cloneDeep(isEmpty(adminColumns) ? baseColumnsAdmin : adminColumns);
  const newColumns = copyAdminColumns.map((col, index) =>
    index === column ? { ...col, tasks: included ? uniqBy([...col.tasks, ...tasks], (i) => i.id) : [] } : col
  );
  return newColumns;
};

export const useAdminColumns = (args) => {
  const { statuses, setSelectedStatus } = args;
  const [adminColumns, setAdminColumns] = useReducer(updateAdminColumns, []);
  const { getProposalsUserCanReviewData, getProposalsUserCanReviewFetchMore } = useGetProposalsUserCanReview({
    adminColumns,
    ...args,
  });

  const { getSubmissionsUserCanReviewData, getSubmissionsUserCanReviewFetchMore } = useGetSubmissionsUserCanReview({
    adminColumns,
    ...args,
  });

  const handleLoadMore = useCallback(() => {
    getProposalsUserCanReviewFetchMore();
    getSubmissionsUserCanReviewFetchMore();
  }, [getProposalsUserCanReviewFetchMore, getSubmissionsUserCanReviewFetchMore]);

  useEffect(() => {
    setAdminColumns({
      tasks: getProposalsUserCanReviewData,
      column: 0,
      included: statusIncludedOrEmpty({ status: TASK_STATUS_REQUESTED, statuses }),
    });
    setAdminColumns({
      tasks: getSubmissionsUserCanReviewData,
      column: 1,
      included: statusIncludedOrEmpty({ status: TASK_STATUS_IN_REVIEW, statuses }),
    });
    setStatus({ statuses, setSelectedStatus });
  }, [getProposalsUserCanReviewData, getSubmissionsUserCanReviewData, setSelectedStatus, statuses]);
  useUpdateAdminStatus(args);
  return { adminColumns, handleAdminColumnsLoadMore: handleLoadMore };
};
