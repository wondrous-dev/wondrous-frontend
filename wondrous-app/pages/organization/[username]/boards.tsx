import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/client';

import { useMe, withAuth } from '../../../components/Auth/withAuth';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_SUBMISSIONS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
  GET_TASKS_RELATED_TO_USER_IN_ORG,
  SEARCH_ORG_TASK_BOARD_PROPOSALS,
  SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
} from '../../../graphql/queries/taskBoard';
import Boards from '../../../components/organization/boards/boards';
import {
  TASK_STATUS_IN_REVIEW,
  DEFAULT_STATUS_ARR,
  STATUS_OPEN,
  TASK_STATUSES,
  PRIVACY_LEVEL,
} from '../../../utils/constants';
import { GET_ORG_FROM_USERNAME, GET_ORG_BY_ID, GET_ORG_PODS, SEARCH_ORG_USERS } from '../../../graphql/queries/org';
import { OrgBoardContext } from '../../../utils/contexts';
import { GET_USER_PERMISSION_CONTEXT } from '../../../graphql/queries';
import { dedupeColumns } from '../../../utils';
import apollo from '../../../services/apollo';
import { TaskFilter } from '../../../types/task';
import {
  COLUMNS,
  LIMIT,
  SELECT_OPTIONS,
  populateTaskColumns,
  addToTaskColumns,
  bindTasksToCols,
} from '../../../services/board';
import { useOrganizationBoardService } from '@services/orginization/board';

const BoardsPage = () => {
  const router = useRouter();
  const [columns, setColumns] = useState(COLUMNS);
  const [submissions, setSubmissions] = useState([]);
  const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR);
  const [podIds, setPodIds] = useState([]);
  const [orgData, setOrgData] = useState(null);
  // const { fetchTasks, columns, setColumns } = useOrganizationBoardService();
  // const [searchString, setSearchString] = useState('');
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const { username, orgId, search: searchString, userId, boardType } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const [orgTaskHasMore, setOrgTaskHasMore] = useState(true);
  const [getOrgPods, { data: { getOrgPods: orgPods = [] } = {} }] = useLazyQuery(GET_ORG_PODS);

  const [getOrgTaskProposals] = useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    // onCompleted: (data) => bindProposalsToCols(data?.getOrgTaskBoardProposals),
    fetchPolicy: 'cache-and-network',
  });

  const [searchOrgTaskProposals] = useLazyQuery(SEARCH_ORG_TASK_BOARD_PROPOSALS, {
    // onCompleted: (data) => bindProposalsToCols(data?.searchProposalsForOrgBoardView),
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgTaskSubmissions] = useLazyQuery(GET_ORG_TASK_BOARD_SUBMISSIONS, {
    // onCompleted: (data) => {
    //   const newColumns = [...columns];
    //   const taskSubmissions = data?.getOrgTaskBoardSubmissions;
    //   newColumns[1].section.tasks = [];
    //   taskSubmissions?.forEach((taskSubmission) => {
    //     newColumns[1].section.tasks.push(taskSubmission);
    //   });
    //   setSubmissions(taskSubmissions);
    //   setColumns(newColumns);
    // },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgBoardTaskCount, { data: orgTaskCountData, variables: getOrgBoardTaskCountVariables }] = useLazyQuery(
    GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD
  );

  const [searchOrgTasks] = useLazyQuery(SEARCH_TASKS_FOR_ORG_BOARD_VIEW, {
    // onCompleted: (data) => {
    //   const tasks = data?.searchTasksForOrgBoardView;
    //   const newColumns = populateTaskColumns(tasks, columns);
    //   newColumns[0].section.tasks = [];
    //   newColumns[1].section.tasks = [];
    //   newColumns[2].section.tasks = [];
    //
    //   tasks.forEach((task) => {
    //     if (task.status === TASK_STATUS_IN_REVIEW) {
    //       newColumns[1].section.tasks.push(task);
    //     }
    //   });
    //
    //   if (statuses.length) {
    //     newColumns.forEach((column) => {
    //       if (!statuses.includes(column.section.filter.taskType)) {
    //         column.section.tasks = [];
    //       }
    //     });
    //   }
    //
    //   setColumns(dedupeColumns(newColumns));
    //   if (orgTaskHasMore) {
    //     setOrgTaskHasMore(tasks.length >= LIMIT);
    //   }
    //   setFirstTimeFetch(true);
    // },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgTasks, { fetchMore, variables: getOrgTasksVariables }] = useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
    // onCompleted: (data) => {
    //   if (!firstTimeFetch) {
    //     const tasks = data?.getOrgTaskBoardTasks;
    //     const newColumns = populateTaskColumns(tasks, columns);
    //     setColumns(dedupeColumns(newColumns));
    //     if (orgTaskHasMore) {
    //       setOrgTaskHasMore(tasks.length >= LIMIT);
    //     }
    //     setFirstTimeFetch(true);
    //   }
    // },
    fetchPolicy: 'cache-and-network',
  });

  const [getTasksRelatedToUser] = useLazyQuery(GET_TASKS_RELATED_TO_USER_IN_ORG, {
    // onCompleted: (data) => {
    //   bindTasksToCols(data?.getTasksRelatedToUserInOrg);
    //   setFirstTimeFetch(true);
    // },
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

  async function fetchTasks({ search = '', offset = 0 } = {}) {
    const id = orgId || orgData?.id;
    const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));

    const variables = {
      offset,
      orgId: id,
      onlyPublic: boardType === PRIVACY_LEVEL.public,
      statuses: taskStatuses,
      limit: LIMIT,
    };

    if (search) {
      return searchOrgTasks({ variables: { ...variables, podIds, search } }).then(
        (res) => res.data?.searchTasksForOrgBoardView
      );
    } else if (userId) {
      return getTasksRelatedToUser({ variables: { ...variables, podIds, userId } }).then(
        (res) => res.data?.getTasksRelatedToUserInOrg
      );
    } else {
      return getOrgTasks({ variables }).then((res) => res.data?.getOrgTaskBoardTasks);
    }
  }

  const fetchProposals = async ({ search = '' } = {}) => {
    const id = orgId || orgData?.id;

    const variables = {
      orgId: id,
      statuses: [STATUS_OPEN],
      offset: 0,
      limit: LIMIT,
    };

    if (search) {
      return searchOrgTaskProposals({ variables: { ...variables, podIds, search } }).then(
        (res) => res.data?.getTasksRelatedToUserInOrg
      );
    } else {
      getOrgTaskProposals({ variables });
    }
    //   const searchOrgTaskProposalsArgs = {
    //     variables: {
    //       podIds,
    //       orgId: id,
    //       statuses: [STATUS_OPEN],
    //       offset: 0,
    //       limit: 100,
    //       search,
    //     },
    //   };
    //
    //   const searchOrgTasksArgs = {
    //     variables: {
    //       podIds,
    //       orgId: id,
    //       limit: 100,
    //       offset: 0,
    //       // Needed to exclude proposals
    //       statuses: taskStatuses,
    //       search,
    //       ...(boardType === PRIVACY_LEVEL.public && {
    //         onlyPublic: true,
    //       }),
    //     },
    //   };
    //
    //   if (searchTasks) {
    //     searchOrgTasks(searchOrgTasksArgs);
    //   } else {
    //     const newColumns = [...columns];
    //     newColumns.forEach((column) => {
    //       column.tasks = [];
    //       column.section.tasks = [];
    //     });
    //
    //     setColumns(newColumns);
    //   }
    //
    //   // TODO: Handle when section is open
    //   if (searchProposals) {
    //     searchOrgTaskProposals(searchOrgTaskProposalsArgs);
    //   }
  };

  const fetchSubmissions = async () => {};

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

  // @ts-ignore
  useEffect(async () => {
    const id = orgId || orgData?.id;

    if (id) {
      getOrgPods({ variables: { orgId: id } });
      getOrgBoardTaskCount({ variables: { orgId: id } });

      const tasks = await fetchTasks();
      const { newColumns, hasMore } = bindTasksToCols(columns, tasks);

      setColumns(newColumns);
      setOrgTaskHasMore(hasMore);
    }

    // if (searchString) {
    //   // if (!firstTimeFetch) {
    //   //   const searchOrgTaskProposalsArgs = {
    //   //     variables: {
    //   //       podIds,
    //   //       orgId: id,
    //   //       statuses: [STATUS_OPEN],
    //   //       offset: 0,
    //   //       limit: 100,
    //   //       searchString: search,
    //   //     },
    //   //   };
    //   //
    //   //   const searchOrgTasksArgs = {
    //   //     variables: {
    //   //       podIds,
    //   //       orgId: id,
    //   //       limit: 100,
    //   //       offset: 0,
    //   //       // Needed to exclude proposals
    //   //       statuses: DEFAULT_STATUS_ARR,
    //   //       searchString: search,
    //   //       ...(boardType === PRIVACY_LEVEL.public && {
    //   //         onlyPublic: true,
    //   //       }),
    //   //     },
    //   //   };
    //   //
    //   //   searchOrgTasks(searchOrgTasksArgs);
    //   //   searchOrgTaskProposals(searchOrgTaskProposalsArgs);
    //   //   setFirstTimeFetch(true);
    //   //   setSearchString(search as string);
    //   // }
    // } else if (userId) {
    //   // const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));
    //   //
    //   // getTasksRelatedToUser({
    //   //   variables: {
    //   //     podIds,
    //   //     userId,
    //   //     orgId: id,
    //   //     limit: 1000,
    //   //     offset: 0,
    //   //     statuses: taskStatuses,
    //   //   },
    //   // });
    // } else {
    //   // getOrgTasks({
    //   //   variables: {
    //   //     orgId: id,
    //   //     statuses,
    //   //     offset: 0,
    //   //     limit: LIMIT,
    //   //     ...(boardType === PRIVACY_LEVEL.public && {
    //   //       onlyPublic: true,
    //   //     }),
    //   //   },
    //   // });
    //   //
    //   // // TODO: Handle when section is open
    //   // getOrgTaskSubmissions({
    //   //   variables: {
    //   //     orgId: id,
    //   //     statuses: [STATUS_OPEN],
    //   //     offset: 0,
    //   //     limit: LIMIT,
    //   //   },
    //   // });
    //   //
    //   // // TODO: Handle when section is open
    //   // getOrgTaskProposals({
    //   //   variables: {
    //   //     orgId: id,
    //   //     statuses: [STATUS_OPEN],
    //   //     offset: 0,
    //   //     limit: LIMIT,
    //   //   },
    //   // });
    //   //
    // }
  }, [orgData, orgId, boardType]);

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

  const handleFilterChange = ({ statuses = DEFAULT_STATUS_ARR, podIds }: TaskFilter) => {
    // const id = orgId || orgData?.id;
    // const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));
    // const searchProposals = statuses.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
    // const searchTasks = !(searchProposals && statuses.length === 1);
    //
    // setStatuses(statuses);
    // setPodIds(podIds || []);
    //
    // if (userId) {
    //   getTasksRelatedToUser({
    //     variables: {
    //       podIds: podIds || [],
    //       userId,
    //       orgId: id,
    //       statuses: taskStatuses,
    //       limit: 1000,
    //       offset: 0,
    //     },
    //   });
    // } else {
    //   const searchOrgTaskProposalsArgs = {
    //     variables: {
    //       podIds,
    //       orgId: id,
    //       statuses: [STATUS_OPEN],
    //       offset: 0,
    //       limit: 100,
    //       search,
    //     },
    //   };
    //
    //   const searchOrgTasksArgs = {
    //     variables: {
    //       podIds,
    //       orgId: id,
    //       limit: 100,
    //       offset: 0,
    //       // Needed to exclude proposals
    //       statuses: taskStatuses,
    //       search,
    //       ...(boardType === PRIVACY_LEVEL.public && {
    //         onlyPublic: true,
    //       }),
    //     },
    //   };
    //
    //   if (searchTasks) {
    //     searchOrgTasks(searchOrgTasksArgs);
    //   } else {
    //     const newColumns = [...columns];
    //     newColumns.forEach((column) => {
    //       column.tasks = [];
    //       column.section.tasks = [];
    //     });
    //
    //     setColumns(newColumns);
    //   }
    //
    //   // TODO: Handle when section is open
    //   if (searchProposals) {
    //     searchOrgTaskProposals(searchOrgTaskProposalsArgs);
    //   }
    // }
  };

  const handleColumnSectionToggle = (column: unknown, isOpen: boolean) => {};

  const handleLoadMore = useCallback(() => {
    if (orgTaskHasMore) {
      fetchMore({
        variables: {
          offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
          limit: LIMIT,
        },
      })
        .then((fetchMoreResult) => {
          const results = fetchMoreResult?.data?.getOrgTaskBoardTasks;
          if (results && results?.length > 0) {
            const newColumns = addToTaskColumns(results, columns);
            setColumns(dedupeColumns(newColumns));
          } else {
            setOrgTaskHasMore(false);
          }
        })
        .catch(() => {
          console.error('Error fetching more tasks');
        });
    }
  }, [orgTaskHasMore, columns, fetchMore]);

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
        getOrgBoardTaskCountVariables,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        getOrgTasksVariables,
        setFirstTimeFetch,
        orgData,
      }}
    >
      <Boards
        orgPods={orgPods}
        selectOptions={SELECT_OPTIONS}
        columns={columns}
        onLoadMore={handleLoadMore}
        onColumnSectionToggle={handleColumnSectionToggle}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        hasMore={orgTaskHasMore}
        orgData={orgData}
      />
    </OrgBoardContext.Provider>
  );
};

export default withAuth(BoardsPage);
