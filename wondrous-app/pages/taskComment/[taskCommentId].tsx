import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_TASK_BY_ID, GET_TASK_COMMENT_BY_ID } from 'graphql/queries/task';
import AppLayout from 'components/Common/Layout/App';
import { CircularProgress } from '@material-ui/core';

const TaskRedirect = () => {
  // TODO use getTaskForTaskComment
  const router = useRouter();
  const { taskCommentId } = router.query;
  const [getTaskById, { data: taskData }] = useLazyQuery(GET_TASK_BY_ID);
  const [getTaskCommentById] = useLazyQuery(GET_TASK_COMMENT_BY_ID, {
    onCompleted: (data) => {
      const taskComment = data?.getTaskCommentById;
      getTaskById({
        variables: {
          taskId: taskComment?.taskId,
        },
      });
    },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    if (taskCommentId) {
      getTaskCommentById({
        variables: {
          taskCommentId,
        },
      });
    }
  }, [taskCommentId]);

  const task = taskData?.getTaskById;

  if (task?.org?.username) {
    router.push(`/organization/${task?.org?.username}/boards?task=${task?.id}`, undefined, {
      shallow: true,
    });
  }
  return (
    <AppLayout banner={null}>
      <CircularProgress />
    </AppLayout>
  );
};

export default TaskRedirect;
