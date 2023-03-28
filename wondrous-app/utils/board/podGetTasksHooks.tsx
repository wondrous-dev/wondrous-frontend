import { useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import { ViewType } from 'types/common';
import { extendFiltersByView } from 'utils/board';

import {
  GET_ORG_MILESTONE_BOARD_TASKS,
  GET_POD_MILESTONE_BOARD_TASKS,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_TASKS,
  GET_TASKS_RELATED_TO_USER_IN_POD,
} from 'graphql/queries/taskBoard';
import {
  ORG_POD_COLUMNS,
  LIMIT,
  populateTaskColumns,
  ORG_POD_PROPOSAL_COLUMNS,
  populateProposalColumns,
} from 'services/board';
import { dedupeColumns } from 'utils';
import {
  PRIVACY_LEVEL,
  STATUS_OPEN,
  ENTITIES_TYPES,
  STATUSES_ON_ENTITY_TYPES,
  STATUS_APPROVED,
  PROPOSAL_STATUS_LIST,
  STATUS_CLOSED,
} from 'utils/constants';
import uniqBy from 'lodash/uniqBy';

const useGetPodMilestoneBoard = ({
  columns,
  setColumns,
  setPodTaskHasMore,
  podId,
  entityType,
  setIsLoading,
  search,
  userId,
  filters,
  view,
}) => {
  const [getPodBoardMilestones, { fetchMore, variables }] = useLazyQuery(GET_POD_MILESTONE_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getPodBoardMilestones }) => {
      setColumns(getPodBoardMilestones);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.log(error);
    },
  });
  const getPodMilestoneBoardFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        input: {
          ...variables.input,
          offset: columns.length,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setPodTaskHasMore(fetchMoreResult?.getPodBoardMilestones.length >= LIMIT);
        return {
          getPodBoardMilestones: [...prev.getPodBoardMilestones, ...fetchMoreResult.getPodBoardMilestones],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setPodTaskHasMore]);

  useEffect(() => {
    if (entityType === ENTITIES_TYPES.MILESTONE && !search && podId) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : // double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;
      const taskBoardLimit = taskBoardStatuses.length > 0 ? LIMIT : 0;
      getPodBoardMilestones({
        variables: {
          input: {
            podId,
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
        },
      });
      setPodTaskHasMore(true);
    }
  }, [getPodBoardMilestones, podId, filters, setPodTaskHasMore, userId, entityType]);

  const fetchPerStatus = async (status, limit) => {
    const columnIdx = columns?.findIndex((column) => column.status === status);
    fetchMore({
      variables: {
        input: {
          ...variables.input,
          offset: columns[columnIdx]?.tasks?.length,
          statuses: [status],
          ...(limit ? { limit } : {}),
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setPodTaskHasMore(fetchMoreResult?.getPodBoardMilestones.length >= LIMIT);
        return {
          getPodBoardMilestones: [...prev.getPodBoardMilestones, ...fetchMoreResult.getPodBoardMilestones],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  return { fetchMore: getPodMilestoneBoardFetchMore, fetchPerStatus };
};

const useGetPodTaskBoardTasks = ({
  columns,
  setColumns,
  setPodTaskHasMore,
  podId,
  userId,
  entityType,
  setIsLoading,
  search,
  filters,
  view,
}) => {
  const [getPodTaskBoardTasks, { variables, fetchMore }] = useLazyQuery(GET_POD_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getPodTaskBoardTasks }) => {
      if (userId) return;
      if (entityType === ENTITIES_TYPES.MILESTONE || entityType === ENTITIES_TYPES.BOUNTY) {
        setColumns(getPodTaskBoardTasks);
        setIsLoading(false);
        return;
      }
      const newColumns = populateTaskColumns(getPodTaskBoardTasks, ORG_POD_COLUMNS);
      setColumns(dedupeColumns(newColumns));
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const getPodTaskBoardTasksFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        input: {
          ...variables?.input,
          offset:
            entityType === ENTITIES_TYPES.TASK ? Math.max(...columns.map(({ tasks }) => tasks.length)) : columns.length,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setPodTaskHasMore(fetchMoreResult?.getPodTaskBoardTasks.length >= LIMIT);
        return {
          getPodTaskBoardTasks: [...prev.getPodTaskBoardTasks, ...fetchMoreResult.getPodTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setPodTaskHasMore, variables]);

  useEffect(() => {
    if (![ENTITIES_TYPES.MILESTONE, ENTITIES_TYPES.PROPOSAL].includes(entityType) && podId && !search && podId) {
      const taskBoardStatuses =
        filters?.statuses?.length > 0
          ? filters?.statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES[entityType].includes(status))
          : // double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;

      const taskBoardStatusesIsNotEmpty = taskBoardStatuses?.length > 0;
      getPodTaskBoardTasks({
        variables: {
          input: {
            podId,
            statuses: taskBoardStatuses,
            priorities: filters?.priorities,
            limit: taskBoardStatusesIsNotEmpty ? LIMIT : 0,
            offset: 0,
            labelId: filters?.labelId,
            date: filters?.date,
            category: filters?.category,
            types: [entityType],
            ...(userId ? { userId } : {}),
            ...extendFiltersByView(view, filters),
            ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
              onlyPublic: true,
            }),
          },
        },
      });
      setPodTaskHasMore(true);
    }
  }, [getPodTaskBoardTasks, podId, filters, setPodTaskHasMore, entityType, userId]);

  const fetchPerStatus = async (status, limit) => {
    const columnIdx = columns?.findIndex((column) => column.status === status);
    fetchMore({
      variables: {
        input: {
          ...variables?.input,
          podId,
          offset: columns[columnIdx]?.tasks?.length,
          statuses: [status],
          ...(limit ? { limit } : {}),
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setPodTaskHasMore(fetchMoreResult?.getPodTaskBoardTasks.length >= LIMIT);
        return {
          getPodTaskBoardTasks: [...prev.getPodTaskBoardTasks, ...fetchMoreResult.getPodTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  return { fetchMore: getPodTaskBoardTasksFetchMore, fetchPerStatus };
};

const useGetPodTaskProposals = ({
  listView,
  section,
  setColumns,
  columns,
  podId,
  entityType,
  setIsLoading,
  setPodTaskHasMore,
  search,
  filters,
}) => {
  const [getPodTaskProposals, { data, fetchMore }] = useLazyQuery(GET_POD_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const newColumns = populateProposalColumns(data?.getPodTaskBoardProposals, ORG_POD_PROPOSAL_COLUMNS);
      setColumns(newColumns);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const getProposalsFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setPodTaskHasMore(fetchMoreResult?.getPodTaskBoardProposals.length >= LIMIT);
        const getPodTaskBoardProposals = uniqBy(
          [...prev.getPodTaskBoardProposals, ...fetchMoreResult.getPodTaskBoardProposals],
          'id'
        );
        return {
          getPodTaskBoardProposals,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setPodTaskHasMore]);

  useEffect(() => {
    const proposalBoardStatuses =
      filters?.statuses?.length > 0
        ? filters?.statuses?.filter((status) => PROPOSAL_STATUS_LIST.includes(status))
        : [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED];
    if (entityType === ENTITIES_TYPES.PROPOSAL && !search && podId) {
      getPodTaskProposals({
        variables: {
          input: {
            podId,
            priorities: filters?.priorities,
            statuses: proposalBoardStatuses,
            offset: 0,
            labelId: filters?.labelId,
            limit: LIMIT,
          },
        },
      });
    }
  }, [getPodTaskProposals, podId, setPodTaskHasMore, entityType, filters]);
  return { fetchMore: getProposalsFetchMore };
};

const useGetBoardHook = (userId, args) => {
  const {
    listView,
    columns,
    setColumns,
    setPodTaskHasMore,
    podId,
    entityType,
    setIsLoading,
    search,
    filters,
    view,
    section,
  } = args;
  const hooks = {
    [ENTITIES_TYPES.PROPOSAL]: useGetPodTaskProposals({
      listView,
      section,
      setColumns,
      columns,
      podId,
      entityType,
      setIsLoading,
      setPodTaskHasMore,
      search,
      filters,
    }),
    [ENTITIES_TYPES.MILESTONE]: useGetPodMilestoneBoard({
      columns,
      setColumns,
      setPodTaskHasMore,
      podId,
      entityType,
      setIsLoading,
      search,
      userId,
      filters,
      view,
    }),
    default: useGetPodTaskBoardTasks({
      columns,
      setColumns,
      setPodTaskHasMore,
      podId,
      entityType,
      setIsLoading,
      search,
      userId,
      filters,
      view,
    }),
  };
  return hooks[entityType] || hooks.default;
};

export const useGetPodTaskBoard = ({
  view,
  section,
  columns,
  setColumns,
  setPodTaskHasMore,
  podId,
  entityType,
  setIsLoading,
  search,
  userId,
  filters,
}) => {
  const hook = useGetBoardHook(userId, {
    view,
    section,
    columns,
    setColumns,
    setPodTaskHasMore,
    podId,
    entityType,
    setIsLoading,
    search,
    userId,
    filters,
  });
  const { fetchMore, fetchPerStatus }: any = hook;
  return { fetchMore, fetchPerStatus };
};
