import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import {
  GET_USER_ABOUT_PAGE_DATA,
  GET_USER_TASK_BOARD_TASKS,
  GET_USER_ORG_ROLES,
  GET_USER_TASKS_COMPLETED_COUNT,
} from 'graphql/queries';

const useGetUserAboutPage = (userId) => {
  const [getUserOrgRoles, { data: userOrgRolesData }] = useLazyQuery(GET_USER_ORG_ROLES);
  const [getUserTasksCompletedCount, { data: taskCompletedCount }] = useLazyQuery(GET_USER_TASKS_COMPLETED_COUNT);

  const [getUserInProgressTasks, { data: workingTaskData }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {});
  const [getUserCompletedTasks, { data: completedTaskData }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {});

  useEffect(() => {
    if (!userOrgRolesData && userId) {
      getUserTasksCompletedCount({
        variables: {
          userId: userId,
        },
      });
      getUserOrgRoles({
        variables: {
          userId: userId,
        },
      });
    }
    if (!workingTaskData && userId) {
      getUserInProgressTasks({
        variables: {
          userId: userId,
          statuses: ['created', 'in_progress', 'in_review'],
        },
      });
    }
    if (!completedTaskData && userId) {
      getUserCompletedTasks({
        variables: {
          userId: userId,
          statuses: ['completed'],
        },
      });
    }
  }, [userId, userOrgRolesData, workingTaskData, completedTaskData]);

  return userOrgRolesData 
    ? {
        workingTasksData: workingTaskData?.getUserTaskBoardTasks,
        completedTasksData: completedTaskData?.getUserTaskBoardTasks,
        userOrgs: userOrgRolesData?.getUserOrgRoles,
        completedTaskCount: taskCompletedCount?.getUserTasksCompletedCount,
      }
    : {};
};

export default useGetUserAboutPage;
