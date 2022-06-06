import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_USER_ABOUT_PAGE_DATA, GET_USER_TASK_BOARD_TASKS } from 'graphql/queries';

const useGetUserAboutPage = (userId) => {
  const [getUserAboutPage, { data }] = useLazyQuery(GET_USER_ABOUT_PAGE_DATA);

  const [getUserWorkingTasks, { data: workingTaskData }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {});

  useEffect(() => {
    if (!data && userId) {
      getUserAboutPage({
        variables: {
          userId: userId,
        },
      });
    }
    if (!workingTaskData && userId) {
      getUserWorkingTasks({
        variables: {
          userId: userId,
          statuses: ['created', 'in_progress', 'in_review'],
        },
      });
    }
  }, [getUserAboutPage, userId, data, workingTaskData, getUserWorkingTasks]);
  return data?.getUserAboutPageData && workingTaskData.getUserTaskBoardTasks
    ? { userData: data?.getUserAboutPageData, workingTasksData: workingTaskData.getUserTaskBoardTasks }
    : {};
};

export default useGetUserAboutPage;
