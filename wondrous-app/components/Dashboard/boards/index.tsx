import { useLazyQuery, useQuery } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import Boards from 'components/Common/Boards';
import BoardsActivity from 'components/Common/BoardsActivity';
import { FilterItem, FilterItemIcon, FilterItemName } from 'components/Common/Filter/styles';
import CreateDaoIcon from 'components/Icons/createDao';
import CreatePodIcon from 'components/Icons/createPod';
import {
  GET_JOIN_ORG_REQUESTS,
  GET_JOIN_POD_REQUESTS,
  GET_USER_PERMISSION_CONTEXT,
  GET_USER_PODS,
  GET_USER_TASK_BOARD_PROPOSALS,
  GET_USER_TASK_BOARD_SUBMISSIONS,
  GET_USER_TASK_BOARD_TASKS,
  SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
  SEARCH_TASKS_FOR_USER_BOARD_VIEW,
} from 'graphql/queries';
import { useAdminColumns } from 'hooks/useAdminColumns';

import cloneDeep from 'lodash/cloneDeep';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import apollo from 'services/apollo';
import { COLUMNS, FILTER_STATUSES_ADMIN, LIMIT, populateTaskColumns } from 'services/board';
import { ViewType } from 'types/common';
import { TaskFilter } from 'types/task';
import { dedupeColumns } from 'utils';
import { bindSectionToColumns, sectionOpeningReducer } from 'utils/board';
import {
  DEFAULT_STATUSES,
  STATUS_OPEN,
  TASK_STATUSES,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
} from 'utils/constants';
import { UserBoardContext } from 'utils/contexts';
import { useGetPerStatusTaskCountForUserBoard, useRouterQuery, useSelectMembership } from 'utils/hooks';
import { FilterItemOrgIcon, FilterOrg } from './styles';

const useGetUserTaskBoardTasks = ({
  isAdmin,
  contributorColumns,
  setContributorColumns,
  setHasMoreTasks,
  loggedInUser,
  statuses,
  podIds,
}) => {
  const [getUserTaskBoardTasks, { fetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardTasks ?? [];
      const newColumns = populateTaskColumns(tasks, contributorColumns.length > 0 ? contributorColumns : COLUMNS);
      setContributorColumns(dedupeColumns(newColumns));
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const getUserTaskBoardTasksFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: Math.max(...contributorColumns.map(({ tasks }) => tasks.length)),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setHasMoreTasks(fetchMoreResult?.getUserTaskBoardTasks?.length >= LIMIT);
        return {
          getUserTaskBoardTasks: [...prev.getUserTaskBoardTasks, ...fetchMoreResult.getUserTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [contributorColumns, fetchMore, setHasMoreTasks]);

  const fetchPerStatus = async (status, limit) => {
    const column = contributorColumns?.find((column) => column.status === status);

    fetchMore({
      variables: {
        offset: column?.tasks?.length,
        statuses: [status],
        ...(limit ? { limit } : {}),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          getUserTaskBoardTasks: [...prev.getUserTaskBoardTasks, ...fetchMoreResult.getUserTaskBoardTasks],
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    const taskBoardStatuses =
      statuses.length > 0 ? statuses?.filter((status) => DEFAULT_STATUSES.includes(status)) : DEFAULT_STATUSES;
    const taskBoardStatusesIsNotEmpty = taskBoardStatuses.length > 0;
    if (!isAdmin && loggedInUser?.id) {
      getUserTaskBoardTasks({
        variables: {
          podIds,
          userId: loggedInUser?.id,
          statuses: taskBoardStatuses,
          limit: taskBoardStatusesIsNotEmpty ? LIMIT : 0,
          offset: 0,
        },
      });
    }
    setHasMoreTasks(true);
  }, [getUserTaskBoardTasks, loggedInUser?.id, podIds, statuses, setHasMoreTasks]);
  return { getUserTaskBoardTasksFetchMore, fetchPerStatus };
};

const useGetUserTaskBoardProposals = ({
  isAdmin,
  listView,
  section,
  contributorColumns,
  setContributorColumns,
  loggedInUser,
  statuses,
  podIds,
}) => {
  const [getUserTaskBoardProposals, { data }] = useLazyQuery(GET_USER_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns: contributorColumns,
        data: data?.getUserTaskBoardProposals,
        section: TASK_STATUS_REQUESTED,
      });
      setContributorColumns(newColumns);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  useEffect(() => {
    if (!isAdmin && loggedInUser?.id) {
      if (section === TASK_STATUS_REQUESTED || listView || data) {
        getUserTaskBoardProposals({
          variables: {
            podIds,
            userId: loggedInUser?.id,
            statuses: [STATUS_OPEN],
            limit: statuses.length === 0 || statuses.includes(TASK_STATUS_REQUESTED) ? LIMIT : 0,
            offset: 0,
          },
        });
      }
    }
  }, [getUserTaskBoardProposals, isAdmin, listView, loggedInUser?.id, podIds, section, statuses, data]);
};

const useGetUserTaskBoardSubmissions = ({
  isAdmin,
  listView,
  section,
  contributorColumns,
  setContributorColumns,
  loggedInUser,
  statuses,
  podIds,
}) => {
  const [getUserTaskBoardSubmissions, { data }] = useLazyQuery(GET_USER_TASK_BOARD_SUBMISSIONS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const newColumns = bindSectionToColumns({
        columns: contributorColumns,
        data: data?.getUserTaskBoardSubmissions,
        section: TASK_STATUS_IN_REVIEW,
      });
      setContributorColumns(newColumns);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  useEffect(() => {
    if (!isAdmin && loggedInUser?.id) {
      if (section === TASK_STATUS_IN_REVIEW || listView || data) {
        getUserTaskBoardSubmissions({
          variables: {
            podIds,
            userId: loggedInUser?.id,
            statuses: [STATUS_OPEN],
            limit: statuses.length === 0 || statuses.includes(TASK_STATUS_IN_REVIEW) ? LIMIT : 0,
            offset: 0,
          },
        });
      }
    }
  }, [isAdmin, loggedInUser, getUserTaskBoardSubmissions, statuses, podIds, section, listView, data]);
};

const useGetUserTaskBoard = ({
  isAdmin,
  view,
  section,
  statuses,
  loggedInUser,
  setHasMoreTasks,
  contributorColumns,
  setContributorColumns,
  podIds,
}) => {
  const { getUserTaskBoardTasksFetchMore, fetchPerStatus } = useGetUserTaskBoardTasks({
    isAdmin,
    contributorColumns,
    setContributorColumns,
    setHasMoreTasks,
    loggedInUser,
    statuses,
    podIds,
  });
  const listView = view === ViewType.List;
  useGetUserTaskBoardProposals({
    isAdmin,
    listView,
    section,
    contributorColumns,
    setContributorColumns,
    loggedInUser,
    statuses,
    podIds,
  });
  useGetUserTaskBoardSubmissions({
    isAdmin,
    listView,
    section,
    contributorColumns,
    setContributorColumns,
    loggedInUser,
    statuses,
    podIds,
  });

  return {
    getUserTaskBoardTasksFetchMore,
    fetchPerStatus,
  };
};

const useFilterSchema = (loggedInUser, isAdmin) => {
  const [filterSchema, setFilterSchema]: any = useState([
    {
      name: 'podIds',
      label: 'Orgs',
      multiChoice: true,
      orgPods: {},
      renderList: ({ schema, toggleOption, checkIsSelected }) =>
        Object.keys(schema.orgPods).map((orgName) => (
          <FilterOrg
            key={orgName}
            title={
              <FilterItemOrgIcon>
                <CreateDaoIcon /> {orgName}
              </FilterItemOrgIcon>
            }
          >
            {schema.orgPods[orgName].map((item) => {
              const isSelected = checkIsSelected(item.id);
              return (
                <FilterItem
                  onClick={() => toggleOption({ ...item, filterType: schema.name })}
                  selected={isSelected}
                  key={item.id}
                >
                  <FilterItemIcon>
                    <CreatePodIcon />
                  </FilterItemIcon>
                  <FilterItemName>{item.name}</FilterItemName>
                </FilterItem>
              );
            })}
          </FilterOrg>
        )),
      items: [],
    },
  ]);
  const [getUserPods] = useLazyQuery(GET_USER_PODS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const orgPods = {};
      data?.getUserPods?.forEach((pod) => {
        if (!orgPods[pod.org.name]) {
          orgPods[pod.org.name] = [];
        }

        orgPods[pod.org.name].push(pod);
      });

      const newFilterSchema: any = cloneDeep(filterSchema);
      newFilterSchema[0].orgPods = orgPods;
      newFilterSchema[0].items = data.getUserPods;

      setFilterSchema(newFilterSchema);
    },
  });
  useEffect(() => {
    if (isAdmin && loggedInUser?.id) {
      return setFilterSchema([FILTER_STATUSES_ADMIN]);
    }
    if (!isAdmin && loggedInUser?.id) {
      return getUserPods({
        variables: {
          userId: loggedInUser?.id,
        },
      });
    }
  }, [getUserPods, isAdmin, loggedInUser?.id]);
  return filterSchema;
};

const BoardsPage = (props) => {
  const { isAdmin, selectedStatus, setSelectedStatus, selectMembershipRequests } = props;
  const selectMembershipHook = useSelectMembership();
  const router = useRouter();
  const loggedInUser = useMe();
  const { search, view } = router.query;
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [contributorColumns, setContributorColumns] = useState([]);
  const [statuses, setStatuses] = useRouterQuery({ router, query: 'statuses' });
  const [podIds, setPodIds] = useRouterQuery({ router, query: 'podIds' });
  const [section, setSection] = useReducer(sectionOpeningReducer, '');
  const { data: userTaskCountData } = useGetPerStatusTaskCountForUserBoard(loggedInUser?.id);
  const { adminColumns, handleAdminColumnsLoadMore } = useAdminColumns({
    isAdmin,
    selectedStatus,
    statuses,
    setSelectedStatus,
    setStatuses,
    podIds,
    setHasMoreTasks,
  });

  const filterSchema = useFilterSchema(loggedInUser, isAdmin);

  const { getUserTaskBoardTasksFetchMore, fetchPerStatus = () => {} } = useGetUserTaskBoard({
    isAdmin,
    section,
    statuses,
    loggedInUser,
    setHasMoreTasks,
    contributorColumns,
    setContributorColumns,
    podIds,
    view,
  });

  const bindProposalsToCols = (taskProposals) => {
    const newColumns = [...contributorColumns];
    newColumns[0].section.tasks = [];
    taskProposals?.forEach((taskProposal) => {
      newColumns[0].section.tasks.push(taskProposal);
    });
    setContributorColumns(newColumns);
  };
  const [searchTasks] = useLazyQuery(SEARCH_TASKS_FOR_USER_BOARD_VIEW, {
    onCompleted: (data) => {
      const tasks = data?.searchTasksForUserBoardView;
      const newColumns = populateTaskColumns(tasks, contributorColumns.length > 0 ? contributorColumns : COLUMNS);
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

      setContributorColumns(dedupeColumns(newColumns));
      if (hasMoreTasks) {
        setHasMoreTasks(tasks.length > LIMIT - 1);
      }
    },
    fetchPolicy: 'cache-and-network',
  });
  const [searchProposals] = useLazyQuery(SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW, {
    onCompleted: (data) => bindProposalsToCols(data?.searchProposalsForUserBoardView),
    fetchPolicy: 'cache-and-network',
  });

  const [joinOrgRequests, setJoinOrgRequests] = useState([]);
  const [getJoinOrgRequests, { data: getJoinOrgRequestsData, fetchMore: fetchMoreJoinOrgRequests }] =
    useLazyQuery(GET_JOIN_ORG_REQUESTS);
  const [getJoinPodRequests, { data: getJoinPodRequestsData, fetchMore: fetchMoreJoinPodRequests }] =
    useLazyQuery(GET_JOIN_POD_REQUESTS);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }
    if (selectMembershipHook?.selectMembershipRequests) {
      getJoinOrgRequests();
      getJoinPodRequests();
      return;
    }

    if (search) {
      const searchTaskProposalsArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds: [],
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: LIMIT,
          searchString: search,
        },
      };

      const searchTasksArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds: [],
          limit: LIMIT,
          offset: 0,
          // Needed to exclude proposals
          statuses: DEFAULT_STATUSES,
          searchString: search,
        },
      };

      searchTasks(searchTasksArgs);
      searchProposals(searchTaskProposalsArgs);
    }
  }, [loggedInUser, selectMembershipHook?.selectMembershipRequests]);

  const handleLoadMore = useCallback(() => {
    if (!hasMoreTasks) {
      return;
    }

    if (selectMembershipHook?.selectMembershipRequests) {
      fetchMoreJoinOrgRequests({
        variables: {
          offset: getJoinOrgRequestsData?.getJoinOrgRequests?.length,
          limit: LIMIT,
        },
        updateQuery: (prev, { fetchMoreResult }) => ({
          getJoinOrgRequests: [...prev.getJoinOrgRequests, ...fetchMoreResult.getJoinOrgRequests],
        }),
      }).then((fetchMoreResult) => {
        const results = fetchMoreResult?.data?.getJoinOrgRequests;
        if (results && results?.length === 0) {
          setHasMoreTasks(false);
        }
      });
      fetchMoreJoinPodRequests({
        variables: {
          offset: getJoinPodRequestsData?.getJoinPodRequests?.length,
          limit: LIMIT,
        },
        updateQuery: (prev, { fetchMoreResult }) => ({
          getJoinPodRequestsData: [...prev.getJoinPodRequests, ...fetchMoreResult.getJoinPodRequests],
        }),
      }).then((fetchMoreResult) => {
        const results = fetchMoreResult?.data?.getJoinPodRequests;
        if (results && results?.length === 0) {
          setHasMoreTasks(false);
        }
      });
    } else if (isAdmin) {
      handleAdminColumnsLoadMore();
    } else {
      !isAdmin && getUserTaskBoardTasksFetchMore();
    }
  }, [hasMoreTasks, contributorColumns, getUserTaskBoardTasksFetchMore, handleAdminColumnsLoadMore, isAdmin]);

  function handleSearch(searchString: string) {
    const searchTaskProposalsArgs = {
      variables: {
        userId: loggedInUser?.id,
        podIds: [],
        statuses: [STATUS_OPEN],
        offset: 0,
        limit: LIMIT,
        searchString,
      },
    };

    const searchTasksArgs = {
      variables: {
        userId: loggedInUser?.id,
        podIds: [],
        limit: LIMIT,
        offset: 0,
        // Needed to exclude proposals
        statuses: DEFAULT_STATUSES,
        searchString,
      },
    };

    const promises: any = [
      apollo.query({
        ...searchTaskProposalsArgs,
        query: SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
      }),

      apollo.query({
        ...searchTasksArgs,
        query: SEARCH_TASKS_FOR_USER_BOARD_VIEW,
      }),
    ];

    return Promise.all(promises).then(([proposals, tasks]: any) => ({
      proposals: proposals.data.searchProposalsForUserBoardView,
      tasks: tasks.data.searchTasksForUserBoardView,
    }));
  }

  const handleFilterChange = ({ statuses = [], podIds = [] }: TaskFilter) => {
    setStatuses(statuses);
    setPodIds(podIds);

    if (search) {
      const taskStatuses = statuses?.filter((status) => TASK_STATUSES.includes(status));
      const shouldSearchProposals = statuses?.length !== taskStatuses?.length || statuses === DEFAULT_STATUSES;
      const shouldSearchTasks = !(searchProposals && statuses?.length === 1);
      const searchTaskProposalsArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds,
          statuses: [STATUS_OPEN],
          offset: 0,
          limit: LIMIT,
          searchString: search,
        },
      };

      const searchTasksArgs = {
        variables: {
          userId: loggedInUser?.id,
          podIds,
          limit: LIMIT,
          offset: 0,
          // Needed to exclude proposals
          statuses: taskStatuses,
          searchString: search,
        },
      };

      if (shouldSearchTasks) {
        searchTasks(searchTasksArgs);
      } else {
        const newColumns = [...contributorColumns];
        newColumns.forEach((column) => {
          column.tasks = [];
          column.section.tasks = [];
        });

        setContributorColumns(newColumns);
      }

      if (shouldSearchProposals) {
        searchProposals(searchTaskProposalsArgs);
      }
    }
  };
  const activeColumns = isAdmin ? adminColumns : contributorColumns;

  return (
    <UserBoardContext.Provider
      value={{
        columns: contributorColumns,
        setColumns: setContributorColumns,
        taskCount: userTaskCountData?.getPerStatusTaskCountForUserBoard,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
        loggedInUserId: loggedInUser?.id,
        joinOrgRequests: getJoinOrgRequestsData?.getJoinOrgRequests,
        joinPodRequests: getJoinPodRequestsData?.getJoinPodRequests,
        setSection,
        fetchPerStatus,
        hasMore: hasMoreTasks,
        onLoadMore: handleLoadMore,
      }}
    >
      <BoardsActivity
        onSearch={handleSearch}
        filterSchema={filterSchema}
        onFilterChange={handleFilterChange}
        statuses={statuses}
        podIds={podIds}
        isAdmin={isAdmin}
      />
      <Boards
        columns={activeColumns}
        onLoadMore={handleLoadMore}
        hasMore={hasMoreTasks}
        isAdmin={isAdmin}
        setColumns={setContributorColumns}
      />
    </UserBoardContext.Provider>
  );
};

export default BoardsPage;
