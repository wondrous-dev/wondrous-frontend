import { useLazyQuery } from '@apollo/client';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_TASKS,
  GET_USER_TASK_BOARD_PROPOSALS,
  GET_USER_TASK_BOARD_TASKS,
} from 'graphql/queries';
import Accordion from 'components/Common/ListViewAccordion';
import { Title, TitleWrapper, Wrapper } from 'components/SearchResultUserCreatedTasks/styles';

import {
  populateTaskColumns,
  generateColumns,
  populateProposalColumns,
  ORG_POD_PROPOSAL_COLUMNS,
  LIMIT,
} from 'services/board';
import { useEffect, useMemo, useState } from 'react';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import {
  COLUMNS_CONFIGURATION,
  DEFAULT_STATUSES,
  ENTITIES_TYPES,
  PRIVACY_LEVEL,
  STATUSES_ON_ENTITY_TYPES,
  STATUS_OPEN,
} from 'utils/constants';
import dynamic from 'next/dynamic';
import ItemsContainer from 'components/ListView/ItemsContainer';
import { useMe } from 'components/Auth/withAuth';
import { useRouter } from 'next/router';
import { Spinner } from 'components/Dashboard/bounties/styles';

const ListView = dynamic(() => import('components/ListView'), { suspense: true });

const TITLES = {
  [ENTITIES_TYPES.TASK]: 'Tasks',
  [ENTITIES_TYPES.PROPOSAL]: 'Proposals',
  [ENTITIES_TYPES.MILESTONE]: 'Milestones',
  [ENTITIES_TYPES.BOUNTY]: 'Bounties',
};

const EntityListItem = ({ entityType, columns }) => {
  const [showAll, setShowAll] = useState(false);
  const tasks = useMemo(() => {
    if (!columns) return null;
    if (showAll) return columns;
    if (Array.isArray(columns)) {
      return columns.slice(0, LIMIT);
    }
    return { ...columns, tasks: columns?.tasks?.slice(0, LIMIT) };
  }, [showAll, columns]);

  if (!tasks) return null;
  if (Array.isArray(tasks)) {
    return (
      <ListView
        entityType={entityType}
        columns={tasks}
        singleColumnData
        hasMore={!showAll && columns?.length > LIMIT}
        onLoadMore={() => setShowAll(true)}
      />
    );
  }
  return (
    <ItemsContainer
      entityType={entityType}
      data={tasks}
      hasMore={!showAll && columns?.length > LIMIT}
      onLoadMore={() => setShowAll(true)}
      disableDnd
      highlighted={false}
      taskCount={columns?.tasks?.length}
    />
  );
};

const ENTITIES_LIST = [ENTITIES_TYPES.TASK, ENTITIES_TYPES.PROPOSAL, ENTITIES_TYPES.MILESTONE, ENTITIES_TYPES.BOUNTY];

const BoardSearch = ({ searchQuery }) => {
  const orgBoard = useOrgBoard();
  const loggedInUser = useMe();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const { filters, entityType, orgId } = orgBoard || userBoard || podBoard;
  const router = useRouter();
  const searchOrgTasksArgs = {
    variables: {
      podIds: filters?.podIds,
      priorities: filters?.priorities,
      orgId,
      limit: 1000,
      offset: 0,
      // Needed to exclude proposals
      statuses: filters?.statuses?.length
        ? filters?.statuses
        : STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT,
      searchString: searchQuery,
      ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
        onlyPublic: true,
      }),
    },
  };

  const searchOrgProposalArgs = {
    variables: {
      podIds: filters?.podIds,
      priorities: filters?.priorities,
      orgId,
      statuses: [STATUS_OPEN],
      offset: 0,
      limit: 1000,
      searchString: searchQuery,
    },
  };

  const searchPodTasksArgs = {
    variables: {
      input: {
        podId: podBoard?.podId,
        limit: 1000,
        offset: 0,
        labelId: filters?.labelId,
        date: filters?.date,

        // Needed to exclude proposals
        statuses: filters?.statuses?.length
          ? filters?.statuses
          : STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT,
        searchString: searchQuery,
        ...(filters?.privacyLevel === PRIVACY_LEVEL.public && {
          onlyPublic: true,
        }),
      },
    },
  };

  const searchPodTaskProposalsArgs = {
    variables: {
      input: {
        podId: podBoard?.podId,
        statuses: [STATUS_OPEN],
        offset: 0,
        limit: LIMIT,
        searchString: searchQuery,
      },
    },
  };

  const searchUserTaskArgs = {
    variables: {
      userId: loggedInUser?.id,
      podIds: filters?.podIds,
      limit: LIMIT,
      offset: 0,
      // Needed to exclude proposals
      statuses: filters?.statuses?.length ? filters?.statuses : DEFAULT_STATUSES,
      searchString: searchQuery,
    },
  };

  const searchUserProposalArgs = {
    variables: {
      userId: loggedInUser?.id,
      podIds: [],
      statuses: [STATUS_OPEN],
      offset: 0,
      limit: LIMIT,
      searchString: searchQuery,
    },
  };

  const [getOrgTasks, { data: orgTasksData, refetch: refetchOrgTasksData, loading: orgTasksLoading }] = useLazyQuery(
    GET_ORG_TASK_BOARD_TASKS,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  );

  const [getOrgProposals, { data: orgProposalData, refetch: refetchOrgProposalsData, loading: orgProposalsLoading }] =
    useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    });

  const [getPodTasks, { data: podTasksData, refetch: refetchPodTasksData, loading: podTasksLoading }] = useLazyQuery(
    GET_POD_TASK_BOARD_TASKS,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  );

  const [getPodProposals, { data: podProposalData, refetch: refetchPodProposalsData, loading: podProposalsLoading }] =
    useLazyQuery(GET_POD_TASK_BOARD_PROPOSALS, {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    });

  const [getUserBoardTasks, { data: userBoardTasksData, refetch: refetchUserTaskData, loading: userTasksLoading }] =
    useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    });

  const [
    getUserBoardProposals,
    { data: userBoardProposalsData, refetch: refetchUserProposalData, loading: userProposalsLoading },
  ] = useLazyQuery(GET_USER_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!loggedInUser) return;
    if (orgBoard && !orgTasksData && !orgProposalData) {
      getOrgTasks(searchOrgTasksArgs);
      getOrgProposals(searchOrgProposalArgs);
    }
    if (podBoard && !podTasksData && !podProposalData) {
      getPodTasks(searchPodTasksArgs);
      getPodProposals(searchPodTaskProposalsArgs);
    }
    if (userBoard && !userBoardTasksData && !userBoardProposalsData) {
      if (router.pathname === '/dashboard/proposals') {
        // for proposals page we need to fetch only proposals
        getUserBoardProposals(searchUserProposalArgs);
      } else {
        getUserBoardTasks(searchUserTaskArgs);
        getUserBoardProposals(searchUserProposalArgs);
      }
    }
  }, [orgBoard, podBoard, userBoard, loggedInUser?.id]);

  useEffect(() => {
    if (!loggedInUser) return;
    if (orgBoard) {
      refetchOrgTasksData(searchOrgTasksArgs.variables);
      refetchOrgProposalsData(searchOrgProposalArgs.variables);
    }
    if (podBoard) {
      refetchPodTasksData({ input: searchPodTasksArgs.variables.input });
      refetchPodProposalsData({ input: searchPodTaskProposalsArgs.variables.input });
    }
    if (userBoard) {
      if (router.pathname === '/dashboard/proposals') {
        refetchUserProposalData(searchUserProposalArgs.variables);
      } else {
        refetchUserTaskData(searchUserTaskArgs.variables);
        refetchUserProposalData(searchUserProposalArgs.variables);
      }
    }
  }, [filters, searchQuery, entityType, loggedInUser?.id]);

  const dataColumns = useMemo(() => {
    if (
      (orgTasksData && orgProposalData) ||
      (podTasksData && podProposalData) ||
      userBoardTasksData ||
      userBoardProposalsData
    ) {
      const tasks =
        orgTasksData?.getOrgTaskBoardTasks ||
        podTasksData?.getPodTaskBoardTasks ||
        userBoardTasksData?.getUserTaskBoardTasks;
      const proposals =
        orgProposalData?.getOrgTaskBoardProposals ||
        podProposalData?.getPodTaskBoardProposals ||
        userBoardProposalsData?.getUserTaskBoardProposals;
      let columnsPerTaskType = {};
      let columnsPerStatus = {};

      if (tasks) {
        columnsPerTaskType = tasks?.reduce((acc, next) => {
          const { type } = next;
          if (next) {
            acc[type] = [...(acc[type] || []), next];
          }
          return acc;
        }, {});

        columnsPerStatus = Object.keys(columnsPerTaskType).reduce((acc, next) => {
          if (next === ENTITIES_TYPES.TASK) {
            const columns = populateTaskColumns(
              columnsPerTaskType[next],
              generateColumns(false, COLUMNS_CONFIGURATION.ORG),
              true,
              true
            );
            acc[next] = columns;
            return acc;
          }
          acc[next] = columnsPerTaskType[next];
          return acc;
        }, {});
      }

      const proposalColumns = populateProposalColumns(proposals, ORG_POD_PROPOSAL_COLUMNS, true, true);
      columnsPerStatus[ENTITIES_TYPES.PROPOSAL] = proposalColumns;
      return columnsPerStatus;
    }
  }, [orgTasksData, orgProposalData, podTasksData, podProposalData, userBoardTasksData, userBoardProposalsData]);

  const counts = useMemo(() => {
    if (!dataColumns) return null;
    const taskAndProposalCount = {
      [ENTITIES_TYPES.TASK]: 0,
      [ENTITIES_TYPES.PROPOSAL]: 0,
      [ENTITIES_TYPES.MILESTONE]: 0,
      [ENTITIES_TYPES.BOUNTY]: 0,
      total: 0,
    };

    ENTITIES_LIST.forEach((entity) => {
      if (dataColumns[entity] && (entity === ENTITIES_TYPES.MILESTONE || entity === ENTITIES_TYPES.BOUNTY)) {
        taskAndProposalCount[entity] = dataColumns[entity].length;
        taskAndProposalCount.total += dataColumns[entity].length;
      } else {
        dataColumns[entity]?.forEach((column) => {
          taskAndProposalCount[entity] += column?.tasks?.length;
        });
        taskAndProposalCount.total += taskAndProposalCount[entity];
      }
    });
    return taskAndProposalCount;
  }, [dataColumns]);

  const loading =
    orgTasksLoading ||
    orgProposalsLoading ||
    podTasksLoading ||
    podProposalsLoading ||
    userTasksLoading ||
    userProposalsLoading;
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>
          {loading && !counts
            ? `Searching result for '${searchQuery}'`
            : `Showing ${counts?.total} results for ${searchQuery || null}`}
        </Title>
      </TitleWrapper>
      {dataColumns && !loading ? (
        Object.keys(dataColumns).map((entityType) => {
          const columns = dataColumns[entityType];
          const singleColumnData = entityType === ENTITIES_TYPES.BOUNTY || entityType === ENTITIES_TYPES.MILESTONE;
          if (!singleColumnData) {
            return (
              <Accordion title={TITLES[entityType]} count={counts[entityType]}>
                {columns?.map((column, idx) => (
                  <EntityListItem columns={column} key={idx} entityType={entityType} />
                ))}
              </Accordion>
            );
          }
          return <EntityListItem columns={columns} entityType={entityType} />;
        })
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
};

export default BoardSearch;
