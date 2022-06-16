import { useLazyQuery } from '@apollo/client';
import { GET_USER_ORG_ROLES, GET_USER_TASK_BOARD_TASKS } from 'graphql/queries';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useGetPerStatusTaskCountForUserBoard } from 'utils/hooks';

const FETCH_MORE_LIMIT = 8;

const LIMIT = 4;

const useGetUserAboutPage = (userId) => {
  const [completedTasksData, setCompletedTasksData] = useState([]);
  const [completedTaskButton, setCompletedTaskButton] = useState(false);
  const [inProgressData, setInProgressData] = useState([]);
  const [inProgressButton, setInProgressButton] = useState(false);
  const [getUserOrgRoles, { data: userOrgRolesData }] = useLazyQuery(GET_USER_ORG_ROLES);
  const [orgRolesButton, setOrgRolesButton] = useState(false);
  const { data: userTaskCountData } = useGetPerStatusTaskCountForUserBoard(userId);
  const [getUserInProgressTasks, { fetchMore: inProgressFetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS);
  const [getUserCompletedTasks, { fetchMore: completedTaskFetchMore }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS);

  const handleFetchMoreOrgRoles = () => {
    setOrgRolesButton(true);
  };
  const handleFetchMoreCompletedTasks = () => {
    completedTaskFetchMore({
      variables: {
        offset: completedTasksData?.length,
        limit: FETCH_MORE_LIMIT,
      },
    })
      .then(({ data }) => {
        if (_.isEmpty(data.getUserTaskBoardTasks)) setCompletedTaskButton(true);
        setCompletedTasksData([...completedTasksData, ...data.getUserTaskBoardTasks]);
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
        if (_.isEmpty(data.getUserTaskBoardTasks)) setInProgressButton(true);
        setInProgressData([...inProgressData, ...data.getUserTaskBoardTasks]);
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
          if (_.isNull(data.getUserTaskBoardTasks)) return;
          setInProgressData(data.getUserTaskBoardTasks);
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
          if (_.isNull(data.getUserTaskBoardTasks)) return;
          setCompletedTasksData(data?.getUserTaskBoardTasks);
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
        completedTaskButton,
        completedTasksData,
        handleFetchMoreCompletedTasks,
        handleFetchMoreInProgressTasks,
        handleFetchMoreOrgRoles,
        inProgressButton,
        inProgressData,
        orgRolesButton,
        userOrgs: userOrgRolesData?.getUserOrgRoles,
        userTaskCountData: userTaskCountData?.getPerStatusTaskCountForUserBoard,
      }
    : {};
};

export default useGetUserAboutPage;
