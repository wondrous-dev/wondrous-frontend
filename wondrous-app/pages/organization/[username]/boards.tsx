import { useLazyQuery, useQuery } from '@apollo/client';
import { bindSectionToColumns } from '@utils/board';
import { useRouterQuery } from '@utils/hooks';
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

const useGetOrgTaskBoardTasks = ({ columns, setColumns, setOrgTaskHasMore, statuses, orgId, boardType, podIds }) => {
  const [getOrgTaskBoardTasks, { fetchMore }] = useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      const tasks = data?.getOrgTaskBoardTasks;
      const newColumns = populateTaskColumns(tasks, columns);
      setColumns(dedupeColumns(newColumns));
    },
    fetchPolicy: 'cache-and-network',
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
        setOrgTaskHasMore(fetchMoreResult?.getOrgTaskBoardTasks.length >= LIMIT);
        return {
          getOrgTaskBoardTasks: [...prev.getOrgTaskBoardTasks, ...fetchMoreResult.getOrgTaskBoardTasks],
        };
      },
    });
  }, [columns, fetchMore, setOrgTaskHasMore]);
  useEffect(() => {
    const taskBoardStatuses =
      statuses.length > 0 ? statuses?.filter((status) => DEFAULT_STATUS_ARR.includes(status)) : DEFAULT_STATUS_ARR;
    const taskBoardStatusesIsNotEmpty = taskBoardStatuses.length > 0;
    getOrgTaskBoardTasks({
      variables: {
        orgId,
        podIds,
        offset: 0,
        statuses: taskBoardStatuses,
        limit: taskBoardStatusesIsNotEmpty ? LIMIT : 0,
        ...(boardType === PRIVACY_LEVEL.public && {
          onlyPublic: true,
        }),
      },
    });
  }, [boardType, getOrgTaskBoardTasks, orgId, statuses, podIds]);
  return { getOrgTaskBoardTasksFetchMore };
};

const useGetOrgTaskBoardProposals = ({ columns, setColumns, orgId, statuses }) => {
  const [getOrgTaskProposals] = useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns,
        data: data?.getOrgTaskBoardProposals,
        section: TASK_STATUS_REQUESTED,
      });
      setColumns(dedupeColumns(newColumns));
    },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    getOrgTaskProposals({
      variables: {
        orgId,
        statuses: [STATUS_OPEN],
        offset: 0,
        limit: statuses.length === 0 || statuses.includes(TASK_STATUS_REQUESTED) ? LIMIT : 0,
      },
    });
  }, [getOrgTaskProposals, orgId, statuses]);
};

const useGetOrgTaskBoardSubmissions = ({ columns, setColumns, orgId, statuses }) => {
  const [getOrgTaskSubmissions] = useLazyQuery(GET_ORG_TASK_BOARD_SUBMISSIONS, {
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns,
        data: data?.getOrgTaskBoardSubmissions,
        section: TASK_STATUS_IN_REVIEW,
      });
      setColumns(dedupeColumns(newColumns));
    },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    getOrgTaskSubmissions({
      variables: {
        orgId,
        statuses: [STATUS_OPEN],
        offset: 0,
        limit: statuses.length === 0 || statuses.includes(TASK_STATUS_IN_REVIEW) ? LIMIT : 0,
      },
    });
  }, [getOrgTaskSubmissions, orgId, statuses]);
};

const useGetOrgTaskBoard = ({ columns, setColumns, setOrgTaskHasMore, boardType, orgId, statuses, podIds }) => {
  const { getOrgTaskBoardTasksFetchMore } = useGetOrgTaskBoardTasks({
    columns,
    setColumns,
    setOrgTaskHasMore,
    boardType,
    orgId,
    statuses,
    podIds,
  });
  useGetOrgTaskBoardProposals({ columns, setColumns, orgId, statuses });
  useGetOrgTaskBoardSubmissions({ columns, setColumns, orgId, statuses });
  return { getOrgTaskBoardTasksFetchMore };
};

const BoardsPage = () => {
  const router = useRouter();
  const [columns, setColumns] = useState(COLUMNS);
  const [statuses, setStatuses] = useRouterQuery({ router, query: 'statuses' });
  const [podIds, setPodIds] = useRouterQuery({ router, query: 'podIds' });
  const [orgData, setOrgData] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const { username, orgId, search, userId, boardType } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const [orgTaskHasMore, setOrgTaskHasMore] = useState(true);
  const [getOrgPods, { data: { getOrgPods: orgPods = [] } = {} }] = useLazyQuery(GET_ORG_PODS);

  const { getOrgTaskBoardTasksFetchMore } = useGetOrgTaskBoard({
    columns,
    setColumns,
    setOrgTaskHasMore,
    boardType,
    orgId: orgId ?? orgData?.id,
    statuses,
    podIds,
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

  const bindTasksToCols = (tasks) => {
    const newColumns = populateTaskColumns(tasks, columns);
    setColumns(dedupeColumns(newColumns));
    if (orgTaskHasMore) {
      setOrgTaskHasMore(tasks.length >= LIMIT);
    }
  };
  const [getTasksRelatedToUser] = useLazyQuery(GET_TASKS_RELATED_TO_USER_IN_ORG, {
    onCompleted: (data) => {
      bindTasksToCols(data?.getTasksRelatedToUserInOrg);
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
      } else if (userId) {
        const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));

        getTasksRelatedToUser({
          variables: {
            podIds,
            userId,
            orgId: id,
            limit: 1000,
            offset: 0,
            statuses: taskStatuses,
          },
        });
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

    const id = orgId || orgData?.id;
    const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));
    const searchProposals = statuses.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
    const searchTasks = !(searchProposals && statuses.length === 1);
    if (userId) {
      getTasksRelatedToUser({
        variables: {
          podIds: podIds || [],
          userId,
          orgId: id,
          statuses: taskStatuses,
          limit: 1000,
          offset: 0,
        },
      });
    }
    if (search) {
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
        selectOptions={SELECT_OPTIONS}
        columns={columns}
        searchString={searchString}
        onLoadMore={getOrgTaskBoardTasksFetchMore}
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
