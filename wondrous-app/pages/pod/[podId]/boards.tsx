import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/client';

import { useMe, withAuth } from '../../../components/Auth/withAuth';
import {
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_SUBMISSIONS,
  GET_POD_TASK_BOARD_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD,
  SEARCH_TASKS_FOR_POD_BOARD_VIEW,
  GET_ORG_TASK_BOARD_PROPOSALS,
  SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
  SEARCH_POD_TASK_BOARD_PROPOSALS,
  SEARCH_ORG_TASK_BOARD_PROPOSALS,
  GET_TASKS_RELATED_TO_USER_IN_ORG,
  GET_TASKS_RELATED_TO_USER_IN_POD,
} from '../../../graphql/queries/taskBoard';
import Boards from '../../../components/Pod/boards';
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

import { PodBoardContext } from '../../../utils/contexts';
import { GET_AUTOCOMPLETE_USERS, GET_USER_PERMISSION_CONTEXT, SEARCH_ORG_USERS } from '../../../graphql/queries';
import { GET_POD_BY_ID } from '../../../graphql/queries/pod';
import { dedupeColumns, delQuery } from '../../../utils';
import * as Constants from '../../../utils/constants';
import apollo from '../../../services/apollo';
import { TaskFilter } from '../../../types/task';

import { COLUMNS, LIMIT, SELECT_OPTIONS, populateTaskColumns, addToTaskColumns } from '../../../services/board';

const BoardsPage = () => {
  const [columns, setColumns] = useState(COLUMNS);
  const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR);
  const router = useRouter();
  const { username, podId, search, userId } = router.query;
  const [searchString, setSearchString] = useState('');

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const [podTaskHasMore, setPodTaskHasMore] = useState(false);
  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const pod = podData?.getPodById;
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);

  const bindTasksToCols = (tasks) => {
    const newColumns = populateTaskColumns(tasks, columns);
    setColumns(dedupeColumns(newColumns));
    setPodTaskHasMore(tasks.length >= LIMIT);
  };

  const bindProposalsToCols = (taskProposals) => {
    const newColumns = [...columns];
    newColumns[0].section.tasks = [];
    taskProposals?.forEach((taskProposal) => {
      newColumns[0].section.tasks.push(taskProposal);
    });
    setColumns(newColumns);
  };

  const [getPodTaskProposals] = useLazyQuery(GET_POD_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => bindProposalsToCols(data?.getPodTaskBoardProposals),
    fetchPolicy: 'cache-and-network',
  });

  const [searchPodTaskProposals] = useLazyQuery(SEARCH_POD_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => bindProposalsToCols(data?.searchProposalsForPodBoardView),
    fetchPolicy: 'cache-and-network',
  });

  const [getPodTaskSubmissions] = useLazyQuery(GET_POD_TASK_BOARD_SUBMISSIONS, {
    onCompleted: (data) => {
      const newColumns = [...columns];
      const taskSubmissions = data?.getPodTaskBoardSubmissions;
      newColumns[1].section.tasks = [];
      taskSubmissions?.forEach((taskSubmission) => {
        newColumns[1].section.tasks.push(taskSubmission);
      });
      setColumns(newColumns);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getPodBoardTaskCount, { data: podTaskCountData }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD);

  const [getPodTasks, { fetchMore, variables: getPodTasksVariables }] = useLazyQuery(GET_POD_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      const tasks = data?.getPodTaskBoardTasks;
      const newColumns = populateTaskColumns(tasks, columns);
      setColumns(dedupeColumns(newColumns));
      setPodTaskHasMore(tasks.length >= LIMIT);
      setFirstTimeFetch(true);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getTasksRelatedToUser] = useLazyQuery(GET_TASKS_RELATED_TO_USER_IN_POD, {
    onCompleted: (data) => {
      bindTasksToCols(data?.getTasksRelatedToUserInPod);
      setFirstTimeFetch(true);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [searchPodTasks] = useLazyQuery(SEARCH_TASKS_FOR_POD_BOARD_VIEW, {
    onCompleted: (data) => {
      const tasks = data?.searchTasksForPodBoardView;
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
      setPodTaskHasMore(tasks.length >= LIMIT);
      setFirstTimeFetch(true);
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (podId) {
      getPod({
        variables: {
          podId,
        },
      });
      if (search) {
        if (!firstTimeFetch) {
          const searchOrgTaskProposalsArgs = {
            variables: {
              input: {
                podId,
                statuses: [STATUS_OPEN],
                offset: 0,
                limit: 100,
                searchString: search,
              },
            },
          };

          const searchOrgTasksArgs = {
            variables: {
              input: {
                podId,
                limit: 100,
                offset: 0,
                // Needed to exclude proposals
                statuses: DEFAULT_STATUS_ARR,
                searchString: search,
              },
            },
          };

          searchPodTasks(searchOrgTasksArgs);
          searchPodTaskProposals(searchOrgTaskProposalsArgs);
          setFirstTimeFetch(true);
          setSearchString(search as string);
        }
      } else if (userId) {
        const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));

        getTasksRelatedToUser({
          variables: {
            podId,
            userId,
            limit: 1000,
            offset: 0,
            statuses: taskStatuses,
          },
        });
      } else {
        // fetch user task boards after getting orgId from username
        getPodTasks({
          variables: {
            input: {
              podId,
              statuses,
              offset: 0,
              limit: LIMIT,
            },
          },
        });
        getPodTaskProposals({
          variables: {
            input: {
              podId,
              statuses: [STATUS_OPEN],
              offset: 0,
              limit: LIMIT,
            },
          },
        });
        getPodTaskSubmissions({
          variables: {
            input: {
              podId,
              statuses: [STATUS_OPEN],
              offset: 0,
              limit: LIMIT,
            },
          },
        });
        getPodBoardTaskCount({
          variables: {
            podId,
          },
        });
      }
    }
  }, [podId, getPodTasks, statuses, getPodTaskSubmissions, getPodTaskProposals, getPodBoardTaskCount, getPod]);

  const handleLoadMore = useCallback(() => {
    if (podTaskHasMore) {
      fetchMore({
        variables: {
          input: {
            offset: Math.max(...columns.map(({ tasks }) => tasks.length)),
            limit: LIMIT,
            podId,
            statuses,
          },
        },
      }).then((fetchMoreResult) => {
        const results = fetchMoreResult?.data?.getPodTaskBoardTasks;
        if (results && results?.length > 0) {
          const newColumns = addToTaskColumns(results, columns);
          setColumns(dedupeColumns(newColumns));
        } else {
          setPodTaskHasMore(false);
        }
      });
    }
  }, [podTaskHasMore, columns, fetchMore]);

  // function searchTasks(searchString: string, returnResult = false) {
  //   const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));
  //   const searchProposals = statuses.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
  //   const searchTasks = !(searchProposals && statuses.length === 1);
  //
  //   const getPodTaskProposalsArgs = {
  //     variables: {
  //       input: {
  //         podId,
  //         statuses: [STATUS_OPEN],
  //         offset: 0,
  //         limit: LIMIT,
  //         searchString,
  //       },
  //     },
  //   };
  //
  //   const searchPodTasksArgs = {
  //     variables: {
  //       input: {
  //         podId,
  //         limit: 1000,
  //         offset: 0,
  //         // Needed to exclude proposals
  //         statuses: taskStatuses.length ? taskStatuses : DEFAULT_STATUS_ARR,
  //         searchString,
  //       },
  //     },
  //   };
  //
  //   if (returnResult) {
  //     const promises: any = [
  //       searchProposals
  //         ? apollo.query({
  //             ...getPodTaskProposalsArgs,
  //             query: SEARCH_POD_TASK_BOARD_PROPOSALS,
  //           })
  //         : { data: { searchPodTaskProposals: [] } },
  //
  //       searchTasks
  //         ? apollo.query({
  //             ...searchPodTasksArgs,
  //             query: SEARCH_TASKS_FOR_POD_BOARD_VIEW,
  //           })
  //         : { data: { searchTasksForPodBoardView: [] } },
  //     ];
  //
  //     return Promise.all(promises).then(([proposals, tasks]: any) => [
  //       ...proposals.data.searchProposalsForPodBoardView,
  //       ...tasks.data.searchTasksForPodBoardView,
  //     ]);
  //   } else {
  //     if (searchTasks) {
  //       searchPodTasks(searchPodTasksArgs);
  //     } else {
  //       const newColumns = [...columns];
  //       newColumns.forEach((column) => {
  //         column.tasks = [];
  //         column.section.tasks = [];
  //       });
  //
  //       setColumns(newColumns);
  //     }
  //
  //     if (searchProposals) {
  //       searchPodTaskProposals(getPodTaskProposalsArgs);
  //     }
  //
  //     return Promise.resolve([]);
  //   }
  // }

  // useEffect(() => {
  //   if (firstTimeFetch) {
  //     searchTasks(searchString);
  //   }
  // }, [searchString, podId, statuses, searchPodTasks, getPodTaskProposals]);
  //

  function handleSearch(searchString: string) {
    // const id = orgId || orgData?.id;
    const searchPodTaskProposalsArgs = {
      variables: {
        input: {
          podId,
          // orgId: id,
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: LIMIT,
          searchString,
        },
      },
    };

    const searchPodTasksArgs = {
      variables: {
        input: {
          podId,
          // orgId: id,
          limit: LIMIT,
          offset: 0,
          // Needed to exclude proposals
          statuses: DEFAULT_STATUS_ARR,
          searchString,
        },
      },
    };

    const promises: any = [
      apollo.query({
        query: GET_AUTOCOMPLETE_USERS,
        variables: {
          // orgId: id,
          username: searchString,
        },
      }),
      apollo.query({
        ...searchPodTaskProposalsArgs,
        query: SEARCH_POD_TASK_BOARD_PROPOSALS,
      }),

      apollo.query({
        ...searchPodTasksArgs,
        query: SEARCH_TASKS_FOR_POD_BOARD_VIEW,
      }),
    ];

    return Promise.all(promises).then(([users, proposals, tasks]: any) => ({
      users: users.data.getAutocompleteUsers,
      proposals: proposals.data.searchProposalsForPodBoardView,
      tasks: tasks.data.searchTasksForPodBoardView,
    }));
  }

  // const handleSearch = useCallback(
  //   (searchString) => {
  //     // if (search) {
  //     //   history.pushState({}, '', `${delQuery(router.asPath)}?search=${searchString}&view=list`);
  //     //   setSearchString(searchString);
  //     //
  //     //   return Promise.resolve([]);
  //     // } else {
  //     //   return searchTasks(searchString, true);
  //     // }
  //   },
  //   [podId]
  // );

  // const handleFilterChange: any = ({ statuses }: TaskFilter) => {
  //   setStatuses(statuses || DEFAULT_STATUS_ARR);

  const handleFilterChange: any = ({ statuses, podIds }: TaskFilter) => {
    const taskStatuses = (statuses || DEFAULT_STATUS_ARR).filter((status) => TASK_STATUSES.includes(status));
    const searchProposals = statuses.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
    const searchTasks = !(searchProposals && statuses.length === 1);

    setStatuses(statuses || DEFAULT_STATUS_ARR);

    if (userId) {
      getTasksRelatedToUser({
        variables: {
          podId,
          userId,
          statuses: taskStatuses,
          limit: 1000,
          offset: 0,
        },
      });
    } else if (search) {
      const searchOrgTaskProposalsArgs = {
        variables: {
          input: {
            podId,
            statuses: [STATUS_OPEN],
            offset: 0,
            limit: 100,
            searchString: search,
          },
        },
      };

      const searchOrgTasksArgs = {
        variables: {
          input: {
            podId,
            limit: 100,
            offset: 0,
            // Needed to exclude proposals
            statuses: taskStatuses,
            searchString: search,
          },
        },
      };

      if (searchTasks) {
        searchPodTasks(searchOrgTasksArgs);
      } else {
        const newColumns = [...columns];
        newColumns.forEach((column) => {
          column.tasks = [];
          column.section.tasks = [];
        });

        setColumns(newColumns);
      }

      if (searchProposals) {
        searchPodTaskProposals(searchOrgTaskProposalsArgs);
      }

      // const searchOrgTaskProposalsArgs = {
      //   variables: {
      //     podIds,
      //     orgId: id,
      //     statuses: [STATUS_OPEN],
      //     offset: 0,
      //     limit: 100,
      //     search,
      //   },
      // };
      //
      // const searchOrgTasksArgs = {
      //   variables: {
      //     podIds,
      //     orgId: id,
      //     limit: 100,
      //     offset: 0,
      //     // Needed to exclude proposals
      //     statuses: taskStatuses,
      //     search,
      //   },
      // };
      //
      // if (searchTasks) {
      //   searchOrgTasks(searchOrgTasksArgs);
      // } else {
      //   const newColumns = [...columns];
      //   newColumns.forEach((column) => {
      //     column.tasks = [];
      //     column.section.tasks = [];
      //   });
      //
      //   setColumns(newColumns);
      // }
      //
      // if (searchProposals) {
      //   searchOrgTaskProposals(searchOrgTaskProposalsArgs);
      // }
    }
  };
  // };

  return (
    <PodBoardContext.Provider
      value={{
        statuses,
        setStatuses,
        columns,
        setColumns,
        orgId: pod?.orgId,
        pod,
        podId,
        taskCount: podTaskCountData?.getPerStatusTaskCountForPodBoard,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        getPodTasksVariables,
      }}
    >
      <Boards
        selectOptions={SELECT_OPTIONS}
        searchString={searchString}
        columns={columns}
        onLoadMore={handleLoadMore}
        hasMore={podTaskHasMore}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
    </PodBoardContext.Provider>
  );
};

export default withAuth(BoardsPage);
