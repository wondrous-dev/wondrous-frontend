import { useLazyQuery, useQuery } from '@apollo/client';
import { InputAdornment } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import {
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
import { dedupeColumns, delQuery } from '../../../utils';
import { updateTaskColumns } from '../../../utils/board';
import {
  DEFAULT_STATUS_ARR,
  STATUS_OPEN,
  TASK_STATUS_AWAITING_PAYMENT,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUSES,
} from '../../../utils/constants';
import { UserBoardContext } from '../../../utils/contexts';
import { useMe } from '../../Auth/withAuth';
import { FilterItemOrgIcon, FilterOrg } from './styles';
import Boards from '../../Common/Boards';
import { TaskFilter } from '../../../types/task';
import { FILTER_STATUSES, populateTaskColumns, COLUMNS, SELECT_OPTIONS, LIMIT } from '../../../services/board';
import apollo from '../../../services/apollo';
import CreatePodIcon from '../../Icons/createPod';
import { FilterItem, FilterItemIcon, FilterItemName } from '../../Common/Filter/styles';
import CreateDaoIcon from '../../Icons/createDao';

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

const BoardsPage = (props) => {
  const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR);
  const { isAdmin, selectedStatus } = props;
  const router = useRouter();
  const [view, setView] = useState(null);
  const loggedInUser = useMe();
  const [contributorColumns, setContributorColumns] = useState([]);
  const [adminColumns, setAdminColumns] = useState([]);
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const { search } = router.query;

  const [getTasks, { fetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    variables: {
      podIds: [],
      userId: loggedInUser?.id,
      statuses: DEFAULT_STATUS_ARR,
      limit: LIMIT,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardTasks;
      const newColumns = populateTaskColumns(tasks, contributorColumns.length > 0 ? contributorColumns : COLUMNS);
      setContributorColumns(dedupeColumns(newColumns));
      setHasMoreTasks(tasks?.length >= LIMIT);
    },
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
      setHasMoreTasks(tasks.length >= LIMIT);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [searchProposals] = useLazyQuery(SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW, {
    onCompleted: (data) => bindProposalsToCols(data?.searchProposalsForUserBoardView),
    fetchPolicy: 'cache-and-network',
  });

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

  const [getUserTaskBoardProposals] = useLazyQuery(GET_USER_TASK_BOARD_PROPOSALS, {
    variables: {
      userId: loggedInUser?.id,
      statuses: [STATUS_OPEN],
      limit: LIMIT,
      offset: 0,
    },
    onCompleted: (data) => {
      const taskProposals = data?.getUserTaskBoardProposals;
      const newColumns = contributorColumns[0]?.section ? [...contributorColumns] : [...COLUMNS];
      newColumns[0].section.tasks = [...taskProposals];
      setContributorColumns(newColumns);
    },
  });

  const getUserTaskBoardSubmissions = useQuery(GET_USER_TASK_BOARD_SUBMISSIONS, {
    variables: {
      userId: loggedInUser?.id,
      statuses: [STATUS_OPEN],
      limit: LIMIT,
      offset: 0,
    },
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardSubmissions;
      if (tasks?.length > 0) {
        const newColumns = contributorColumns[1]?.section ? [...contributorColumns] : [...COLUMNS];
        newColumns[1].section.tasks = [...tasks];
        setContributorColumns(newColumns);
      }
    },
  });
  const getProposalsUserCanReview = useQuery(GET_PROPOSALS_USER_CAN_REVIEW, {
    onCompleted: (data) => {
      const tasks = data?.getProposalsUserCanReview || [];
      const newColumns = adminColumns[0]?.tasks ? [...adminColumns] : [...baseColumnsAdmin];
      newColumns[0].tasks = [...tasks];
      setAdminColumns(newColumns);
    },
  });
  const getSubmissionsUserCanReview = useQuery(GET_SUBMISSIONS_USER_CAN_REVIEW, {
    onCompleted: (data) => {
      const tasks = data?.getSubmissionsUserCanReview;
      const newColumns = adminColumns[1]?.tasks ? [...adminColumns] : [...baseColumnsAdmin];
      newColumns[1].tasks = [...tasks];
      setAdminColumns(newColumns);
    },
  });
  const [getUserTaskCountData, { data: userTaskCountData }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (!loggedInUser) {
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
          statuses: DEFAULT_STATUS_ARR,
          searchString: search,
        },
      };

      searchTasks(searchTasksArgs);
      searchProposals(searchTaskProposalsArgs);
    } else {
      getTasks();
      getUserTaskBoardProposals();

      getUserTaskCountData({
        variables: {
          userId: loggedInUser?.id,
        },
      });
    }

    getUserPods({
      variables: {
        userId: loggedInUser?.id,
      },
    });
  }, [loggedInUser]);

  const handleLoadMore = useCallback(() => {
    if (hasMoreTasks) {
      fetchMore({
        variables: {
          offset: Math.max(...contributorColumns.map(({ tasks }) => tasks.length)),
          limit: LIMIT,
        },
        updateQuery: (prev, { fetchMoreResult }) => ({
          getUserTaskBoardTasks: [...prev.getUserTaskBoardTasks, ...fetchMoreResult.getUserTaskBoardTasks],
        }),
      })
        .then((fetchMoreResult) => {
          const results = fetchMoreResult?.data?.getUserTaskBoardTasks;
          if (results && results?.length > 0) {
            const newColumns = updateTaskColumns(results, contributorColumns);
            setContributorColumns(dedupeColumns(newColumns));
          } else {
            setHasMoreTasks(false);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [hasMoreTasks, contributorColumns, fetchMore]);

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

  const handleFilterChange: any = ({ statuses = DEFAULT_STATUS_ARR, podIds }: TaskFilter) => {
    const taskStatuses = statuses.filter((status) => TASK_STATUSES.includes(status));
    const shouldSearchProposals = statuses?.length !== taskStatuses.length || statuses === DEFAULT_STATUS_ARR;
    const shouldSearchTasks = !(searchProposals && statuses?.length === 1);

    setStatuses(statuses);

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
    } else {
      getTasks({
        variables: {
          podIds,
          limit: LIMIT,
          userId: loggedInUser?.id,
          statuses: taskStatuses,
          offset: 0,
        },
      });
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
      }}
    >
      <Boards
        filterSchema={filterSchema}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        columns={isAdmin ? filterColumnsByStatus(adminColumns, selectedStatus) : contributorColumns}
        onLoadMore={handleLoadMore}
        hasMore={hasMoreTasks}
      />
    </UserBoardContext.Provider>
  );
};

export default BoardsPage;
