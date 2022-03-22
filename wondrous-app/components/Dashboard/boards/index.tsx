import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  GET_JOIN_ORG_REQUESTS,
  GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD,
  GET_USER_PERMISSION_CONTEXT,
  GET_USER_PODS,
  GET_USER_TASK_BOARD_PROPOSALS,
  GET_USER_TASK_BOARD_SUBMISSIONS,
  GET_USER_TASK_BOARD_TASKS,
  SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW,
  SEARCH_TASKS_FOR_USER_BOARD_VIEW,
} from '../../../graphql/queries';
import {
  GET_PROPOSALS_USER_CAN_REVIEW,
  GET_SUBMISSIONS_USER_CAN_REVIEW,
} from '../../../graphql/queries/workflowBoards';
import apollo from '../../../services/apollo';
import { COLUMNS, FILTER_STATUSES, LIMIT, populateTaskColumns } from '../../../services/board';
import { TaskFilter } from '../../../types/task';
import { dedupeColumns } from '../../../utils';
import {
  DEFAULT_STATUS_ARR,
  STATUS_OPEN,
  TASK_STATUSES,
  TASK_STATUS_AWAITING_PAYMENT,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_SUBMISSION_REQUEST,
} from '../../../utils/constants';
import { UserBoardContext } from '../../../utils/contexts';
import { useRouterQuery, useSelectMembership } from '../../../utils/hooks';
import { useMe } from '../../Auth/withAuth';
import Boards from '../../Common/Boards';
import { FilterItem, FilterItemIcon, FilterItemName } from '../../Common/Filter/styles';
import CreateDaoIcon from '../../Icons/createDao';
import CreatePodIcon from '../../Icons/createPod';
import { FilterItemOrgIcon, FilterOrg } from './styles';

const proposal = {
  status: TASK_STATUS_PROPOSAL_REQUEST,
  tasks: [],
};

const submissions = {
  status: TASK_STATUS_SUBMISSION_REQUEST,
  tasks: [],
};

const awaitingPayment = {
  // NOTE: Per Terry's instruction, payments will be hidden for now in Admin View
  status: TASK_STATUS_AWAITING_PAYMENT,
  tasks: [],
};

const baseColumnsAdmin = [proposal, submissions];

const filterColumnsByStatus = (columns, status) => {
  if (!status) return columns;
  return columns.filter((column) => column.status === status);
};

const useGetUserTaskBoardTasks = ({
  contributorColumns,
  setContributorColumns,
  setHasMoreTasks,
  hasMoreTasks,
  loggedInUser,
  statuses,
  podIds,
}) => {
  const [getUserTaskBoardTasks, { fetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardTasks ?? [];
      const newColumns = populateTaskColumns(tasks, contributorColumns.length > 0 ? contributorColumns : COLUMNS);
      setContributorColumns(dedupeColumns(newColumns));
      if (hasMoreTasks) {
        setHasMoreTasks(tasks?.length > LIMIT - 1);
      }
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
      updateQuery: (prev, { fetchMoreResult }) => ({
        getUserTaskBoardTasks: [...prev.getUserTaskBoardTasks, ...fetchMoreResult.getUserTaskBoardTasks],
      }),
    });
  }, [contributorColumns, fetchMore]);
  useEffect(() => {
    const taskBoardStatuses =
      statuses.length > 0 ? statuses?.filter((status) => DEFAULT_STATUS_ARR.includes(status)) : DEFAULT_STATUS_ARR;
    const taskBoardStatusesIsNotEmpty = taskBoardStatuses.length > 0;
    getUserTaskBoardTasks({
      variables: {
        podIds,
        userId: loggedInUser?.id,
        statuses: taskBoardStatuses,
        limit: taskBoardStatusesIsNotEmpty ? LIMIT : 0,
        offset: 0,
      },
    });
  }, [getUserTaskBoardTasks, loggedInUser?.id, podIds, statuses]);
  return { getUserTaskBoardTasksFetchMore };
};

const useGetUserTaskBoardProposals = ({ contributorColumns, setContributorColumns, loggedInUser, statuses }) => {
  const [getUserTaskBoardProposals] = useLazyQuery(GET_USER_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const taskProposals = data?.getUserTaskBoardProposals;
      const newColumns = contributorColumns[0]?.section ? [...contributorColumns] : [...COLUMNS];
      newColumns[0].section.tasks = Array.from(taskProposals);
      setContributorColumns(newColumns);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  useEffect(() => {
    getUserTaskBoardProposals({
      variables: {
        userId: loggedInUser?.id,
        statuses: [STATUS_OPEN],
        limit: statuses.length === 0 || statuses.includes(TASK_STATUS_REQUESTED) ? LIMIT : 0,
        offset: 0,
      },
    });
  }, [loggedInUser, getUserTaskBoardProposals, statuses]);
};

const useGetUserTaskBoardSubmissions = ({ contributorColumns, setContributorColumns, loggedInUser, statuses }) => {
  const [getUserTaskBoardSubmissions] = useLazyQuery(GET_USER_TASK_BOARD_SUBMISSIONS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardSubmissions;
      const newColumns = contributorColumns[1]?.section ? [...contributorColumns] : [...COLUMNS];
      newColumns[1].section.tasks = tasks ? [...tasks] : [];
      setContributorColumns(newColumns);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  useEffect(() => {
    getUserTaskBoardSubmissions({
      variables: {
        userId: loggedInUser?.id,
        statuses: [STATUS_OPEN],
        limit: statuses.length === 0 || statuses.includes(TASK_STATUS_IN_REVIEW) ? LIMIT : 0,
        offset: 0,
      },
    });
  }, [loggedInUser, getUserTaskBoardSubmissions, statuses]);
};

const useGetUserTaskBoard = ({
  statuses,
  loggedInUser,
  hasMoreTasks,
  setHasMoreTasks,
  contributorColumns,
  setContributorColumns,
  podIds,
}) => {
  const { getUserTaskBoardTasksFetchMore } = useGetUserTaskBoardTasks({
    contributorColumns,
    setContributorColumns,
    setHasMoreTasks,
    hasMoreTasks,
    loggedInUser,
    statuses,
    podIds,
  });
  useGetUserTaskBoardProposals({ contributorColumns, setContributorColumns, loggedInUser, statuses });
  useGetUserTaskBoardSubmissions({
    contributorColumns,
    setContributorColumns,
    loggedInUser,
    statuses,
  });
  return {
    getUserTaskBoardTasksFetchMore,
  };
};

const useGetPerStatusTaskCountForUserBoard = (loggedInUser) => {
  const [getPerStatusTaskCountForUserBoard, { data }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD);
  useEffect(() => {
    getPerStatusTaskCountForUserBoard({
      variables: {
        userId: loggedInUser?.id,
      },
    });
  }, [loggedInUser, getPerStatusTaskCountForUserBoard]);
  return { data };
};

const useAdminColumns = () => {
  const [adminColumns, setAdminColumns] = useState([]);
  useQuery(GET_PROPOSALS_USER_CAN_REVIEW, {
    onCompleted: (data) => {
      const tasks = data?.getProposalsUserCanReview || [];
      const newColumns = adminColumns[0]?.tasks ? [...adminColumns] : [...baseColumnsAdmin];
      newColumns[0].tasks = [...tasks];
      setAdminColumns(newColumns);
    },
  });
  useQuery(GET_SUBMISSIONS_USER_CAN_REVIEW, {
    onCompleted: (data) => {
      const tasks = data?.getSubmissionsUserCanReview;
      const newColumns = adminColumns[1]?.tasks ? [...adminColumns] : [...baseColumnsAdmin];
      newColumns[1].tasks = [...tasks];
      setAdminColumns(newColumns);
    },
  });
  return { adminColumns };
};

const BoardsPage = (props) => {
  const { isAdmin, selectedStatus, selectMembershipRequests } = props;
  const selectMembershipHook = useSelectMembership();
  const router = useRouter();
  const loggedInUser = useMe();
  const { search } = router.query;
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [contributorColumns, setContributorColumns] = useState([]);
  const [statuses, setStatuses] = useRouterQuery({ router, query: 'statuses' });
  const [podIds, setPodIds] = useRouterQuery({ router, query: 'podIds' });
  const { data: userTaskCountData } = useGetPerStatusTaskCountForUserBoard(loggedInUser);
  const { adminColumns } = useAdminColumns();
  const { getUserTaskBoardTasksFetchMore } = useGetUserTaskBoard({
    statuses,
    loggedInUser,
    hasMoreTasks,
    setHasMoreTasks,
    contributorColumns,
    setContributorColumns,
    podIds,
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

  const [filterSchema, setFilterSchema] = useState([
    {
      name: 'podIds',
      label: 'Orgs',
      multiChoice: true,
      orgPods: {},
      renderList: ({ selectedTab, selectedTabItems, toggleInFilter, items }) => {
        return Object.keys(selectedTab.orgPods).map((orgName) => (
          <FilterOrg
            key={orgName}
            title={
              <FilterItemOrgIcon>
                <CreateDaoIcon /> {orgName}
              </FilterItemOrgIcon>
            }
          >
            {selectedTab.orgPods[orgName].map((item) => {
              const isSelected = (selectedTabItems[selectedTab?.name] || []).includes(item.id);

              return (
                <FilterItem onClick={() => toggleInFilter(item.id)} selected={isSelected} key={item.id}>
                  <FilterItemIcon>
                    <CreatePodIcon />
                  </FilterItemIcon>
                  <FilterItemName>{item.name}</FilterItemName>
                </FilterItem>
              );
            })}
          </FilterOrg>
        ));
      },
      items: [],
    },
    FILTER_STATUSES,
  ]);

  const [getUserPods] = useLazyQuery(GET_USER_PODS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const orgPods = {};
      data.getUserPods.forEach((pod) => {
        if (!orgPods[pod.org.name]) {
          orgPods[pod.org.name] = [];
        }

        orgPods[pod.org.name].push(pod);
      });

      const newFilterSchema: any = [...filterSchema];
      newFilterSchema[0].orgPods = orgPods;
      newFilterSchema[0].items = data.getUserPods;

      setFilterSchema(newFilterSchema);
    },
  });

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }
    if (selectMembershipHook?.selectMembershipRequests) {
      getJoinOrgRequests();
    } else {
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
            statuses: DEFAULT_STATUS_ARR,
            searchString: search,
          },
        };

        searchTasks(searchTasksArgs);
        searchProposals(searchTaskProposalsArgs);
      }
    }

    getUserPods({
      variables: {
        userId: loggedInUser?.id,
      },
    });
  }, [loggedInUser, selectMembershipHook?.selectMembershipRequests]);

  const handleLoadMore = useCallback(() => {
    if (hasMoreTasks) {
      if (selectMembershipHook?.selectMembershipRequests) {
        fetchMoreJoinOrgRequests({
          variables: {
            offset: joinOrgRequests?.length,
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
      } else {
        getUserTaskBoardTasksFetchMore();
      }
    }
  }, [hasMoreTasks, contributorColumns, getUserTaskBoardTasksFetchMore]);

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
        statuses: DEFAULT_STATUS_ARR,
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

    const taskStatuses = statuses?.filter((status) => TASK_STATUSES.includes(status));
    const shouldSearchProposals = statuses?.length !== taskStatuses?.length || statuses === DEFAULT_STATUS_ARR;
    const shouldSearchTasks = !(searchProposals && statuses?.length === 1);
    if (search) {
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
      }}
    >
      <Boards
        filterSchema={filterSchema}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        columns={isAdmin ? filterColumnsByStatus(adminColumns, selectedStatus) : contributorColumns}
        onLoadMore={handleLoadMore}
        hasMore={hasMoreTasks}
        isAdmin={isAdmin}
        statuses={statuses}
        podIds={podIds}
      />
    </UserBoardContext.Provider>
  );
};

export default BoardsPage;
