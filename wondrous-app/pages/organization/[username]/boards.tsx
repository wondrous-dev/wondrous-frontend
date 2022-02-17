import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/client';

import { useMe, withAuth } from '../../../components/Auth/withAuth';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_SUBMISSIONS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
  SEARCH_ORG_TASK_BOARD_PROPOSALS,
  SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
} from '../../../graphql/queries/taskBoard';
import Boards from '../../../components/organization/boards/boards';
import { InReview, Requested, Archived } from '../../../components/Icons/sections';
import {
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_ARCHIVED,
  DEFAULT_STATUS_ARR,
  STATUS_OPEN,
  TASK_STATUSES,
} from '../../../utils/constants';
import { GET_ORG_FROM_USERNAME, GET_ORG_BY_ID, GET_ORG_PODS, SEARCH_ORG_USERS } from '../../../graphql/queries/org';
import { OrgBoardContext } from '../../../utils/contexts';
import { GET_USER_PERMISSION_CONTEXT } from '../../../graphql/queries';
import { dedupeColumns, delQuery } from '../../../utils';
import * as Constants from '../../../utils/constants';
import apollo from '../../../services/apollo';
import { TaskFilter } from '../../../types/task';
import { COLUMNS, LIMIT, SELECT_OPTIONS, populateTaskColumns, addToTaskColumns } from '../../../services/board';

const BoardsPage = () => {
  const router = useRouter();
  const [columns, setColumns] = useState(COLUMNS);
  const [submissions, setSubmissions] = useState([]);
  const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR);
  const [podIds, setPodIds] = useState([]);
  const [orgData, setOrgData] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const { username, orgId, search } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const [orgTaskHasMore, setOrgTaskHasMore] = useState(false);
  const [getOrgPods, { data: { getOrgPods: orgPods = [] } = {} }] = useLazyQuery(GET_ORG_PODS);

  const bindProposalsToCols = (taskProposals) => {
    const newColumns = [...columns];
    newColumns[0].section.tasks = [];
    taskProposals?.forEach((taskProposal) => {
      newColumns[0].section.tasks.push(taskProposal);
    });
    setColumns(newColumns);
  };

  const [getOrgTaskProposals] = useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => bindProposalsToCols(data?.getOrgTaskBoardProposals),
    fetchPolicy: 'cache-and-network',
  });

  const [searchOrgTaskProposals] = useLazyQuery(SEARCH_ORG_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => bindProposalsToCols(data?.searchProposalsForOrgBoardView),
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgTaskSubmissions] = useLazyQuery(GET_ORG_TASK_BOARD_SUBMISSIONS, {
    onCompleted: (data) => {
      const newColumns = [...columns];
      const taskSubmissions = data?.getOrgTaskBoardSubmissions;
      newColumns[1].section.tasks = [];
      taskSubmissions?.forEach((taskSubmission) => {
        newColumns[1].section.tasks.push(taskSubmission);
      });
      setSubmissions(taskSubmissions);
      setColumns(newColumns);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgBoardTaskCount, { data: orgTaskCountData, variables: getOrgBoardTaskCountVariables }] = useLazyQuery(
    GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD
  );

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
      setOrgTaskHasMore(tasks.length >= LIMIT);
      setFirstTimeFetch(true);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgTasks, { fetchMore, variables: getOrgTasksVariables }] = useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      if (!firstTimeFetch) {
        const tasks = data?.getOrgTaskBoardTasks;
        const newColumns = populateTaskColumns(tasks, columns);
        setColumns(dedupeColumns(newColumns));
        setOrgTaskHasMore(tasks.length >= LIMIT);
        setFirstTimeFetch(true);
      }
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
          setSearchString(search as string);
          setFirstTimeFetch(true);
        }
      } else {
        getOrgTasks({
          variables: {
            orgId: id,
            statuses,
            offset: 0,
            limit: LIMIT,
          },
        });

        getOrgTaskSubmissions({
          variables: {
            orgId: id,
            statuses: [STATUS_OPEN],
            offset: 0,
            limit: LIMIT,
          },
        });

        getOrgTaskProposals({
          variables: {
            orgId: id,
            statuses: [STATUS_OPEN],
            offset: 0,
            limit: LIMIT,
          },
        });

        getOrgBoardTaskCount({
          variables: {
            orgId: id,
          },
        });
      }
    }
  }, [orgData, orgId, getOrgBoardTaskCount, getOrgTaskSubmissions, getOrgTaskProposals, getOrgTasks]);

  function searchTasks(searchString: string) {
    // const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));
    // const searchProposals = statuses.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
    // const searchTasks = !(searchProposals && statuses.length === 1);

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
        limit: 1000,
        offset: 0,
        // Needed to exclude proposals
        statuses: DEFAULT_STATUS_ARR,
        searchString,
      },
    };

    // const searchOrgTasksArgs = {
    //   variables: {
    //     podIds,
    //     orgId: id,
    //     limit: 1000,
    //     offset: 0,
    //     // Needed   to exclude proposals
    //     statuses: taskStatuses.length ? taskStatuses : DEFAULT_STATUS_ARR,
    //     searchString,
    //   },
    // };

    // } else {
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
    //   if (searchProposals) {
    //     searchOrgTaskProposals(searchOrgTaskProposalsArgs);
    //   }
    // }

    const promises: any = [
      apollo.query({
        query: SEARCH_ORG_USERS,
        variables: {
          orgId: id,
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

  useEffect(() => {
    // if (firstTimeFetch) {
    //   searchTasks(searchString);
    // }
  }, [searchString, podIds, statuses, searchOrgTasks, searchOrgTaskProposals]);

  // const handleSearch = useCallback(
  //   (searchString) => {
  //     // if (search) {
  //     //   history.pushState({}, '', `${delQuery(router.asPath)}?search=${searchString}&view=list`);
  //     //   setSearchString(searchString);
  //     //
  //     //   return Promise.resolve([]);
  //     // } else {
  //     //   return searchTasks(searchString);
  //     // }
  //   },
  //   [orgId, orgData]
  // );

  const handleFilterChange: any = ({ statuses, pods }: TaskFilter) => {
    setStatuses(statuses || DEFAULT_STATUS_ARR);
    setPodIds(pods || []);
  };

  const handleLoadMore = useCallback(() => {
    if (orgTaskHasMore) {
      fetchMore({
        variables: {
          offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
          limit: LIMIT,
        },
      }).then((fetchMoreResult) => {
        const results = fetchMoreResult?.data?.getOrgTaskBoardTasks;
        if (results && results?.length > 0) {
          const newColumns = addToTaskColumns(results, columns);
          setColumns(dedupeColumns(newColumns));
        } else {
          setOrgTaskHasMore(false);
        }
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
      }}
    >
      <Boards
        orgPods={orgPods}
        selectOptions={SELECT_OPTIONS}
        columns={columns}
        searchString={searchString}
        onLoadMore={handleLoadMore}
        onSearch={(searchString) => searchTasks(searchString)}
        onFilterChange={handleFilterChange}
        hasMore={orgTaskHasMore}
        orgData={orgData}
      />
    </OrgBoardContext.Provider>
  );
};

export default withAuth(BoardsPage);
