import { useLazyQuery } from '@apollo/client';
import { GET_USER_ORG_ROLES, GET_USER_TASK_BOARD_TASKS } from 'graphql/queries';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useGetPerStatusTaskCountForUserBoard } from 'utils/hooks';

const FETCH_MORE_LIMIT = 8;

const LIMIT = 4;

const hasNoMoreData = (result, limit) => {
  return _.isNull(result) || _.isEmpty(result) || result.length < limit;
};

const useGetUserAboutPage = (userId) => {
  const [completedTasksData, setCompletedTasksData] = useState([]);
  const [disableCompletedTaskButton, setDisableCompletedTaskButton] = useState(false);
  const [disableInProgressButton, setDisableInProgressButton] = useState(false);
  const [disableOrgRolesButton, setDisableOrgRolesButton] = useState(false);
  const [getUserCompletedTasks, { fetchMore: completedTaskFetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS);
  const [getUserInProgressTasks, { fetchMore: inProgressFetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS);
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
        offset: _.max(_.values(_.countBy(_.map(inProgressData, (i) => i.status)))),
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
          userId: userId,
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
    if (_.isEmpty(inProgressData) && userId) {
      getUserInProgressTasks({
        variables: {
          userId: userId,
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
    if (_.isEmpty(completedTasksData) && userId) {
      getUserCompletedTasks({
        variables: {
          userId: userId,
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
  }, [
    userId,
    userOrgRolesData,
    inProgressData,
    completedTasksData,
    getUserOrgRoles,
    getUserInProgressTasks,
    getUserCompletedTasks,
  ]);

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
