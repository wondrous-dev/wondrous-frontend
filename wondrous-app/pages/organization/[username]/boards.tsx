import { useLazyQuery, useQuery } from '@apollo/client';
import { bindSectionToColumns } from '@utils/board';
import { useRouterQuery } from '@utils/hooks';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { withAuth } from '../../../components/Auth/withAuth';
import Boards from '../../../components/organization/boards/boards';
import { GET_USER_PERMISSION_CONTEXT } from '../../../graphql/queries';
import { GET_ORG_BY_ID, GET_ORG_FROM_USERNAME, GET_ORG_PODS, SEARCH_ORG_USERS } from '../../../graphql/queries/org';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_SUBMISSIONS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
  GET_TASKS_RELATED_TO_USER_IN_ORG,
  SEARCH_ORG_TASK_BOARD_PROPOSALS,
  SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
} from '../../../graphql/queries/taskBoard';
import apollo from '../../../services/apollo';
import { COLUMNS, LIMIT, populateTaskColumns, SELECT_OPTIONS } from '../../../services/board';
import { TaskFilter } from '../../../types/task';
import { dedupeColumns } from '../../../utils';
import {
  DEFAULT_STATUS_ARR,
  PRIVACY_LEVEL,
  STATUS_OPEN,
  TASK_STATUSES,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
} from '../../../utils/constants';
import { OrgBoardContext } from '../../../utils/contexts';

const useGetOrgTaskBoardTasks = ({
  columns,
  setColumns,
  setOrgTaskHasMore,
  statuses,
  orgId,
  boardType,
  podIds,
  userId,
}) => {
  const [getOrgTaskBoardTasks, { fetchMore }] = useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: ({ getOrgTaskBoardTasks }) => {
      const newColumns = populateTaskColumns(getOrgTaskBoardTasks, columns);
      setColumns(dedupeColumns(newColumns));
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const getOrgTaskBoardTasksFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getOrgTaskBoardTasks.length > LIMIT);
        return {
          getOrgTaskBoardTasks: [...prev.getOrgTaskBoardTasks, ...fetchMoreResult.getOrgTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);
  useEffect(() => {
    if (!userId) {
      const taskBoardStatuses =
        statuses.length > 0 ? statuses?.filter((status) => DEFAULT_STATUS_ARR.includes(status)) : DEFAULT_STATUS_ARR;
      const taskBoardLimit = taskBoardStatuses.length > 0 ? LIMIT : 0;
      getOrgTaskBoardTasks({
        variables: {
          orgId,
          podIds,
          offset: 0,
          statuses: taskBoardStatuses,
          limit: taskBoardLimit,
          ...(boardType === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      });
      setOrgTaskHasMore(true);
    }
  }, [boardType, getOrgTaskBoardTasks, orgId, statuses, podIds, setOrgTaskHasMore, userId]);
  return { fetchMore: getOrgTaskBoardTasksFetchMore };
};

const useGetTaskRelatedToUser = ({ podIds, userId, orgId, statuses, setColumns, columns, setOrgTaskHasMore }) => {
  const [getTasksRelatedToUserInOrg, { fetchMore }] = useLazyQuery(GET_TASKS_RELATED_TO_USER_IN_ORG, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: ({ getTasksRelatedToUserInOrg }) => {
      const newColumns = populateTaskColumns(getTasksRelatedToUserInOrg, columns);
      setColumns(newColumns);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const getTasksRelatedToUserFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setOrgTaskHasMore(fetchMoreResult?.getTasksRelatedToUserInOrg.length >= LIMIT);
        const getTasksRelatedToUserInOrg = _.uniqBy(
          [...prev.getTasksRelatedToUserInOrg, ...fetchMoreResult.getTasksRelatedToUserInOrg],
          'id'
        );
        return {
          getTasksRelatedToUserInOrg,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);

  useEffect(() => {
    if (userId) {
      const taskBoardStatuses =
        statuses.length > 0 ? statuses?.filter((status) => DEFAULT_STATUS_ARR.includes(status)) : DEFAULT_STATUS_ARR;
      const taskBoardLimit = taskBoardStatuses.length > 0 ? LIMIT : 0;
      getTasksRelatedToUserInOrg({
        variables: {
          podIds: podIds || [],
          userId,
          orgId,
          statuses: taskBoardStatuses,
          limit: taskBoardLimit,
          offset: 0,
        },
      });
      setOrgTaskHasMore(true);
    }
  }, [getTasksRelatedToUserInOrg, orgId, podIds, statuses, userId, setOrgTaskHasMore]);
  return { fetchMore: getTasksRelatedToUserFetchMore };
};

const useGetOrgTaskBoardProposals = ({ isProposalCardOpen, columns, setColumns, orgId, statuses, podIds }) => {
  const [getOrgTaskProposals] = useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns,
        data: data?.getOrgTaskBoardProposals,
        section: TASK_STATUS_REQUESTED,
      });
      setColumns(dedupeColumns(newColumns));
    },
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (isProposalCardOpen)
      getOrgTaskProposals({
        variables: {
          podIds,
          orgId,
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: statuses.length === 0 || statuses.includes(TASK_STATUS_REQUESTED) ? LIMIT : 0,
        },
      });
  }, [isProposalCardOpen, getOrgTaskProposals, orgId, statuses, podIds]);
};

const useGetOrgTaskBoardSubmissions = ({ isSubmissionCardOpen, columns, setColumns, orgId, statuses, podIds }) => {
  const [getOrgTaskSubmissions] = useLazyQuery(GET_ORG_TASK_BOARD_SUBMISSIONS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns,
        data: data?.getOrgTaskBoardSubmissions,
        section: TASK_STATUS_IN_REVIEW,
      });
      setColumns(dedupeColumns(newColumns));
    },
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (isSubmissionCardOpen) {
      getOrgTaskSubmissions({
        variables: {
          podIds,
          orgId,
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: statuses.length === 0 || statuses.includes(TASK_STATUS_IN_REVIEW) ? LIMIT : 0,
        },
      });
    }
  }, [isSubmissionCardOpen, getOrgTaskSubmissions, orgId, statuses, podIds]);
};

const useGetOrgTaskBoard = ({
  currentCard,
  columns,
  setColumns,
  setOrgTaskHasMore,
  boardType,
  orgId,
  statuses,
  podIds,
  userId,
}) => {
  const board = {
    [userId]: useGetTaskRelatedToUser({
      columns,
      setColumns,
      setOrgTaskHasMore,
      podIds,
      userId,
      orgId,
      statuses,
    }),
    withoutUserId: useGetOrgTaskBoardTasks({
      columns,
      setColumns,
      setOrgTaskHasMore,
      boardType,
      orgId,
      statuses,
      podIds,
      userId,
    }),
  };
  const { fetchMore } = userId ? board[userId] : board.withoutUserId;

  const isProposalCardOpen = currentCard === TASK_STATUS_REQUESTED;
  const isSubmissionCardOpen = currentCard === TASK_STATUS_IN_REVIEW;
  useGetOrgTaskBoardProposals({ isProposalCardOpen, columns, setColumns, orgId, statuses, podIds });
  useGetOrgTaskBoardSubmissions({ isSubmissionCardOpen, columns, setColumns, orgId, statuses, podIds });
  return { fetchMore };
};

const BoardsPage = () => {
  const router = useRouter();
  const [columns, setColumns] = useState(COLUMNS);
  const [statuses, setStatuses] = useRouterQuery({ router, query: 'statuses' });
  const [podIds, setPodIds] = useRouterQuery({ router, query: 'podIds' });
  const [orgData, setOrgData] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const [currentCard, setCurrentCard] = useState('');
  const { username, orgId, search, userId, boardType } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const [orgTaskHasMore, setOrgTaskHasMore] = useState(true);
  const [getOrgPods, { data: { getOrgPods: orgPods = [] } = {} }] = useLazyQuery(GET_ORG_PODS);

  const { fetchMore } = useGetOrgTaskBoard({
    currentCard,
    columns,
    setColumns,
    setOrgTaskHasMore,
    boardType,
    orgId: orgId ?? orgData?.id,
    statuses,
    podIds,
    userId,
  });

  const [searchOrgTaskProposals] = useLazyQuery(SEARCH_ORG_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns,
        data: data?.searchProposalsForOrgBoardView,
        section: TASK_STATUS_REQUESTED,
      });
      setColumns(dedupeColumns(newColumns));
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgBoardTaskCount, { data: orgTaskCountData }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD);

  const [searchOrgTasks] = useLazyQuery(SEARCH_TASKS_FOR_ORG_BOARD_VIEW, {
    onCompleted: (data) => {
      const tasks = data?.searchTasksForOrgBoardView;
      const newColumns = populateTaskColumns(tasks, columns);
      newColumns[0].section.tasks = [];
      newColumns[1].section.tasks = [];
      newColumns[2].section.tasks = [];

      tasks.forEach((task) => {
        if (task.status === TASK_STATUS_IN_REVIEW) {
          newColumns[1].section.tasks.push(task);
        }
      });

      if (statuses.length) {
        newColumns.forEach((column) => {
          if (!statuses.includes(column.section.filter.taskType)) {
            column.section.tasks = [];
          }
        });
      }

      setColumns(dedupeColumns(newColumns));
      if (orgTaskHasMore) {
        setOrgTaskHasMore(tasks.length >= LIMIT);
      }
      setFirstTimeFetch(true);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgFromUsername] = useLazyQuery(GET_ORG_FROM_USERNAME, {
    onCompleted: (data) => {
      if (data?.getOrgFromUsername) {
        setOrgData(data?.getOrgFromUsername);
      }
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrg] = useLazyQuery(GET_ORG_BY_ID, {
    onCompleted: (data) => {
      setOrgData(data?.getOrgById);
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (orgId && !orgData) {
      getOrg({
        variables: {
          orgId,
        },
      });
      // get user task board tasks immediately
    } else if (!orgId && username && !orgData) {
      // Get orgId from username
      getOrgFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [username, orgId, orgData, getOrg, getOrgFromUsername]);

  useEffect(() => {
    if (orgId || orgData?.id) {
      const id = orgId || orgData?.id;

      getOrgPods({
        variables: {
          orgId: id,
        },
      });

      if (search) {
        if (!firstTimeFetch) {
          const id = orgId || orgData?.id;
          const searchOrgTaskProposalsArgs = {
            variables: {
              podIds,
              orgId: id,
              statuses: [STATUS_OPEN],
              offset: 0,
              limit: 100,
              searchString: search,
            },
          };

          const searchOrgTasksArgs = {
            variables: {
              podIds,
              orgId: id,
              limit: 100,
              offset: 0,
              // Needed to exclude proposals
              statuses: DEFAULT_STATUS_ARR,
              searchString: search,
              ...(boardType === PRIVACY_LEVEL.public && {
                onlyPublic: true,
              }),
            },
          };
          searchOrgTasks(searchOrgTasksArgs);
          searchOrgTaskProposals(searchOrgTaskProposalsArgs);
          setFirstTimeFetch(true);
          setSearchString(search as string);
        }
      } else {
        getOrgBoardTaskCount({
          variables: {
            orgId: id,
          },
        });
      }
    }
  }, [orgData, orgId, getOrgBoardTaskCount, boardType]);

  function handleSearch(searchString: string) {
    const id = orgId || orgData?.id;
    const searchOrgTaskProposalsArgs = {
      variables: {
        podIds,
        orgId: id,
        statuses: [STATUS_OPEN],
        offset: 0,
        limit: LIMIT,
        searchString,
      },
    };

    const searchOrgTasksArgs = {
      variables: {
        podIds,
        orgId: id,
        limit: LIMIT,
        offset: 0,
        // Needed to exclude proposals
        statuses: DEFAULT_STATUS_ARR,
        searchString,
        ...(boardType === PRIVACY_LEVEL.public && {
          onlyPublic: true,
        }),
      },
    };

    const promises: any = [
      apollo.query({
        query: SEARCH_ORG_USERS,
        variables: {
          orgId: id,
          limit: LIMIT,
          offset: 0,
          queryString: searchString,
        },
      }),
      apollo.query({
        ...searchOrgTaskProposalsArgs,
        query: SEARCH_ORG_TASK_BOARD_PROPOSALS,
      }),

      apollo.query({
        ...searchOrgTasksArgs,
        query: SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
      }),
    ];

    return Promise.all(promises).then(([users, proposals, tasks]: any) => ({
      users: users.data.searchOrgUsers,
      proposals: proposals.data.searchProposalsForOrgBoardView,
      tasks: tasks.data.searchTasksForOrgBoardView,
    }));
  }

  const handleFilterChange: any = ({ statuses = [], podIds = [] }: TaskFilter) => {
    setStatuses(statuses);
    setPodIds(podIds);

    if (search) {
      const id = orgId || orgData?.id;
      const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));
      const searchProposals = statuses.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
      const searchTasks = !(searchProposals && statuses.length === 1);
      const searchOrgTaskProposalsArgs = {
        variables: {
          podIds,
          orgId: id,
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: 100,
          search,
        },
      };

      const searchOrgTasksArgs = {
        variables: {
          podIds,
          orgId: id,
          limit: 100,
          offset: 0,
          // Needed to exclude proposals
          statuses: taskStatuses,
          search,
          ...(boardType === PRIVACY_LEVEL.public && {
            onlyPublic: true,
          }),
        },
      };

      if (searchTasks) {
        searchOrgTasks(searchOrgTasksArgs);
      } else {
        const newColumns = [...columns];
        newColumns.forEach((column) => {
          column.tasks = [];
          column.section.tasks = [];
        });

        setColumns(dedupeColumns(newColumns));
      }

      if (searchProposals) {
        searchOrgTaskProposals(searchOrgTaskProposalsArgs);
      }
    }
  };

  if (!process.env.NEXT_PUBLIC_PRODUCTION) {
    console.log(
      'user permissions context',
      userPermissionsContext?.getUserPermissionContext
        ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
        : null
    );
  }

  const handleCardOpening = (section, isOpen) => {
    const taskToSection = [TASK_STATUS_REQUESTED, TASK_STATUS_IN_REVIEW].find(
      (taskType) => taskType === section?.filter?.taskType
    );
    if (taskToSection && taskToSection !== currentCard && isOpen) setCurrentCard(taskToSection);
  };

  return (
    <OrgBoardContext.Provider
      value={{
        statuses,
        setStatuses,
        columns,
        setColumns,
        orgId: orgData?.id,
        taskCount: orgTaskCountData?.getPerStatusTaskCountForOrgBoard,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        setFirstTimeFetch,
        orgData,
      }}
    >
      <Boards
        orgPods={orgPods}
        handleCardOpening={handleCardOpening}
        selectOptions={SELECT_OPTIONS}
        columns={columns}
        searchString={searchString}
        onLoadMore={fetchMore}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        hasMore={orgTaskHasMore}
        orgData={orgData}
        statuses={statuses}
        podIds={podIds}
        setColumns={setColumns}
      />
    </OrgBoardContext.Provider>
  );
};

export default withAuth(BoardsPage);
