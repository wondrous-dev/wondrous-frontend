import { useLazyQuery } from '@apollo/client';
import { GET_USER_ORG_ROLES, GET_USER_TASK_BOARD_TASKS } from 'graphql/queries';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import max from 'lodash/max';
import values from 'lodash/values';
import countBy from 'lodash/countBy';
import map from 'lodash/map';
import { useEffect, useState } from 'react';
import { useGetPerStatusTaskCountForUserBoard } from 'utils/hooks';

const FETCH_MORE_LIMIT = 8;

const LIMIT = 4;

const hasNoMoreData = (result, limit) => isNull(result) || isEmpty(result) || result.length < limit;

const useGetUserAboutPage = (userId) => {
  const [completedTasksData, setCompletedTasksData] = useState([]);
  const [disableCompletedTaskButton, setDisableCompletedTaskButton] = useState(false);
  const [disableInProgressButton, setDisableInProgressButton] = useState(false);
  const [disableOrgRolesButton, setDisableOrgRolesButton] = useState(false);
  const [getUserCompletedTasks, { fetchMore: completedTaskFetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    fetchPolicy: 'network-only',
  });
  const [getUserInProgressTasks, { fetchMore: inProgressFetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    fetchPolicy: 'network-only',
  });
  const [getUserOrgRoles, { data: userOrgRolesData }] = useLazyQuery(GET_USER_ORG_ROLES);
  const [inProgressData, setInProgressData] = useState([]);
  const { data: userTaskCountData } = useGetPerStatusTaskCountForUserBoard(userId);

  const handleFetchMoreOrgRoles = () => {
    setDisableOrgRolesButton(true);
  };
  const handleFetchMoreCompletedTasks = () => {
    completedTaskFetchMore({
      variables: {
        offset: completedTasksData?.length,
        limit: FETCH_MORE_LIMIT,
      },
    })
      .then(({ data }) => {
        const result = data?.getUserTaskBoardTasks;
        setDisableCompletedTaskButton(hasNoMoreData(result, FETCH_MORE_LIMIT));
        setCompletedTasksData([...completedTasksData, ...result]);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleFetchMoreInProgressTasks = () => {
    inProgressFetchMore({
      variables: {
        offset: max(values(countBy(map(inProgressData, (i) => i.status)))),
        limit: FETCH_MORE_LIMIT,
      },
    })
      .then(({ data }) => {
        const result = data?.getUserTaskBoardTasks;
        setDisableInProgressButton(hasNoMoreData(result, FETCH_MORE_LIMIT));
        setInProgressData([...inProgressData, ...result]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (!userOrgRolesData && userId) {
      getUserOrgRoles({
        variables: {
          userId,
        },
      })
        .then(({ data }) => {
          const result = data.getUserOrgRoles;
          setDisableOrgRolesButton(hasNoMoreData(result, LIMIT));
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (isEmpty(inProgressData) && userId) {
      getUserInProgressTasks({
        variables: {
          userId,
          statuses: ['created', 'in_progress', 'in_review'],
          limit: LIMIT,
          offset: 0,
        },
      })
        .then(({ data }) => {
          const result = data.getUserTaskBoardTasks;
          setDisableInProgressButton(hasNoMoreData(result, LIMIT));
          setInProgressData(result);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (isEmpty(completedTasksData) && userId) {
      getUserCompletedTasks({
        variables: {
          userId,
          statuses: ['completed'],
          limit: LIMIT,
          offset: 0,
        },
      })
        .then(({ data }) => {
          const result = data.getUserTaskBoardTasks;
          setDisableCompletedTaskButton(hasNoMoreData(result, LIMIT));
          setCompletedTasksData(result);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [userId, userOrgRolesData, getUserOrgRoles, getUserInProgressTasks, getUserCompletedTasks]);

  return userOrgRolesData
    ? {
        completedTasksData,
        disableCompletedTaskButton,
        disableInProgressButton,
        disableOrgRolesButton,
        handleFetchMoreCompletedTasks,
        handleFetchMoreInProgressTasks,
        handleFetchMoreOrgRoles,
        inProgressData,
        userOrgs: userOrgRolesData?.getUserOrgRoles,
        userTaskCountData: userTaskCountData?.getPerStatusTaskCountForUserBoard,
      }
    : {};
};

export default useGetUserAboutPage;
