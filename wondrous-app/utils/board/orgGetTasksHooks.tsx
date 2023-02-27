import { useLazyQuery } from '@apollo/client';

import {
  GET_ORG_MILESTONE_BOARD_TASKS,
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_TASKS_RELATED_TO_USER_IN_ORG,
} from 'graphql/queries/taskBoard';
import { useCallback, useEffect } from 'react';
import {
  LIMIT,
  ORG_POD_COLUMNS,
  ORG_POD_PROPOSAL_COLUMNS,
  populateProposalColumns,
  populateTaskColumns,
} from 'services/board';
import { ViewType } from 'types/common';
import { dedupeColumns } from 'utils';
import { extendFiltersByView } from 'utils/board';
import {
  ENTITIES_TYPES,
  PRIVACY_LEVEL,
  PROPOSAL_STATUS_LIST,
  STATUS_APPROVED,
  STATUS_CLOSED,
  STATUS_OPEN,
  STATUSES_ON_ENTITY_TYPES,
} from 'utils/constants';

const useGetOrgMilestoneBoard = ({
  columns,
  setColumns,
  setOrgTaskHasMore,
  orgId,
  userId,
  entityType,
  setIsLoading,
  search,
  filters,
  view,
}) => {
  const [getOrgBoardMilestones, { fetchMore, variables }] = useLazyQuery(GET_ORG_MILESTONE_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getOrgBoardMilestones }) => {
      setColumns(getOrgBoardMilestones);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.log(error);
    },
  });
  const getOrgMilestoneBoardFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: columns.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getOrgBoardMilestones.length >= LIMIT);
        return {
          getOrgBoardMilestones: [...prev.getOrgBoardMilestones, ...fetchMoreResult.getOrgBoardMilestones],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (entityType === ENTITIES_TYPES.MILESTONE && !search && orgId) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : // double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;
      const taskBoardLimit = taskBoardStatuses.length > 0 ? LIMIT : 0;
      getOrgBoardMilestones({
        variables: {
          orgId,
          podIds: filters?.podIds,
          priorities: filters?.priorities,
          offset: 0,
          statuses: taskBoardStatuses,
          limit: taskBoardLimit,
          labelId: filters?.labelId,
          date: filters?.date,
          types: [entityType],
          ...(userId ? { userId } : {}),
          ...extendFiltersByView(view, filters),
          ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      });
      setOrgTaskHasMore(true);
    }
  }, [getOrgBoardMilestones, orgId, filters, setOrgTaskHasMore, userId, entityType]);

  const fetchPerStatus = async (status, limit) => {
    const columnIdx = columns?.findIndex((column) => column.status === status);
    fetchMore({
      variables: {
        ...variables,
        offset: columns[columnIdx]?.tasks?.length,
        statuses: [status],
        ...(limit ? { limit } : {}),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getOrgBoardMilestones.length >= LIMIT);
        return {
          getOrgBoardMilestones: [...prev.getOrgBoardMilestones, ...fetchMoreResult.getOrgBoardMilestones],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  return { fetchMore: getOrgMilestoneBoardFetchMore, fetchPerStatus };
};

const useGetOrgTaskBoardTasks = ({
  columns,
  setColumns,
  setOrgTaskHasMore,
  orgId,
  entityType,
  setIsLoading,
  search,
  filters,
  view,
  userId,
}) => {
  const [getOrgTaskBoardTasks, { fetchMore, variables }] = useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getOrgTaskBoardTasks }) => {
      if (entityType === ENTITIES_TYPES.MILESTONE || entityType === ENTITIES_TYPES.BOUNTY) {
        setColumns(getOrgTaskBoardTasks);
        setIsLoading(false);
        return;
      }
      const newColumns = populateTaskColumns(getOrgTaskBoardTasks, ORG_POD_COLUMNS);
      setColumns(dedupeColumns(newColumns));
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.log(error);
    },
  });
  const getOrgTaskBoardTasksFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset:
          entityType === ENTITIES_TYPES.TASK ? Math.max(...columns.map(({ tasks }) => tasks.length)) : columns.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getOrgTaskBoardTasks.length >= LIMIT);
        return {
          getOrgTaskBoardTasks: [...prev.getOrgTaskBoardTasks, ...fetchMoreResult.getOrgTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (entityType !== ENTITIES_TYPES.PROPOSAL && !search && orgId) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : // double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;
      const taskBoardLimit = taskBoardStatuses.length > 0 ? LIMIT : 0;
      getOrgTaskBoardTasks({
        variables: {
          orgId,
          podIds: filters?.podIds,
          priorities: filters?.priorities,
          offset: 0,
          statuses: taskBoardStatuses,
          limit: taskBoardLimit,
          labelId: filters?.labelId,
          date: filters?.date,
          types: [entityType],
          ...(userId ? { userId } : {}),
          ...extendFiltersByView(view, filters),
          ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      });
      setOrgTaskHasMore(true);
    }
  }, [getOrgTaskBoardTasks, orgId, filters, setOrgTaskHasMore, userId, entityType]);

  const fetchPerStatus = async (status, limit) => {
    const columnIdx = columns?.findIndex((column) => column.status === status);
    fetchMore({
      variables: {
        ...variables,
        offset: columns[columnIdx]?.tasks?.length,
        statuses: [status],
        ...(limit ? { limit } : {}),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getOrgTaskBoardTasks.length >= LIMIT);
        return {
          getOrgTaskBoardTasks: [...prev.getOrgTaskBoardTasks, ...fetchMoreResult.getOrgTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  return { fetchMore: getOrgTaskBoardTasksFetchMore, fetchPerStatus };
};

const useGetOrgTaskBoardProposals = ({
  columns,
  setColumns,
  orgId,
  entityType,
  setIsLoading,
  setOrgTaskHasMore,
  search,
  filters,
}) => {
  const [getOrgTaskProposals, { data, fetchMore }] = useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getOrgTaskBoardProposals }) => {
      const newColumns = populateProposalColumns(getOrgTaskBoardProposals, ORG_POD_PROPOSAL_COLUMNS);
      setColumns(newColumns);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error, 'err=');
      setIsLoading(false);
    },
  });

  const getProposalsFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getOrgTaskBoardProposals.length >= LIMIT);
        const getOrgTaskBoardProposals = [
          ...prev.getOrgTaskBoardProposals,
          ...fetchMoreResult.getOrgTaskBoardProposals,
        ];
        return {
          getOrgTaskBoardProposals,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (entityType === ENTITIES_TYPES.PROPOSAL && !search && orgId) {
      const proposalBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => PROPOSAL_STATUS_LIST.includes(status))
          : [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED];
      getOrgTaskProposals({
        variables: {
          podIds: filters?.podIds,
          priorities: filters?.priorities,
          orgId,
          statuses: proposalBoardStatuses,
          offset: 0,
          labelId: filters?.labelId,
          limit: LIMIT,
        },
      });
    }
  }, [getOrgTaskProposals, orgId, setOrgTaskHasMore, entityType, filters]);
  return { fetchMore: getProposalsFetchMore };
};

const useGetBoardHook = (entityType, userId, args) => {
  const { columns, setColumns, setOrgTaskHasMore, orgId, setIsLoading, search, filters, view } = args;
  if (entityType === ENTITIES_TYPES.PROPOSAL) {
    return useGetOrgTaskBoardProposals({
      columns,
      setColumns,
      setOrgTaskHasMore,
      orgId,
      entityType,
      setIsLoading,
      search,
      filters,
    });
  }
  if (entityType === ENTITIES_TYPES.MILESTONE) {
    return useGetOrgMilestoneBoard({
      columns,
      setColumns,
      setOrgTaskHasMore,
      orgId,
      userId,
      entityType,
      setIsLoading,
      search,
      filters,
      view,
    });
  }
  return useGetOrgTaskBoardTasks({
    columns,
    setColumns,
    setOrgTaskHasMore,
    orgId,
    userId,
    entityType,
    setIsLoading,
    search,
    filters,
    view,
  });
};

export const useGetOrgTaskBoard = ({
  columns,
  setColumns,
  setOrgTaskHasMore,
  orgId,
  userId,
  view,
  entityType,
  setIsLoading,
  search,
  filters,
}) => {
  // TODO: fix double fetching
  const hook = useGetBoardHook(entityType, userId, {
    columns,
    setColumns,
    setOrgTaskHasMore,
    orgId,
    userId,
    entityType,
    setIsLoading,
    search,
    filters,
    view,
  });
  const { fetchMore, fetchPerStatus }: any = hook;
  return { fetchMore, fetchPerStatus };
};
