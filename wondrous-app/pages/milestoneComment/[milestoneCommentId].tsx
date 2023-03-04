import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_MILESTONE_COMMENT_BY_ID, GET_MINIMAL_TASK_BY_ID, GET_TASK_COMMENT_BY_ID } from 'graphql/queries/task';
import AppLayout from 'components/Common/Layout/App';
import { CircularProgress } from '@mui/material';
import { GET_MILESTONE_BY_ID } from 'graphql/queries';

function TaskRedirect() {
  // TODO use getTaskForTaskComment
  const router = useRouter();
  const { milestoneCommentId } = router.query;
  const [getMilestoneById, { data: milestoneData }] = useLazyQuery(GET_MILESTONE_BY_ID);
  const [getMilestoneCommentById] = useLazyQuery(GET_MILESTONE_COMMENT_BY_ID, {
    onCompleted: (data) => {
      const taskComment = data?.getMilestoneCommentById;
      getMilestoneById({
        variables: {
          milestoneId: taskComment?.milestoneId,
        },
      });
    },
  });

  useEffect(() => {
    if (milestoneCommentId) {
      getMilestoneCommentById({
        variables: {
          milestoneCommentId,
        },
      });
    }
  }, [milestoneCommentId, getMilestoneCommentById]);

  const milestone = milestoneData?.getMilestoneById;

  if (milestone?.org?.username) {
    router.push(
      `/organization/${milestone?.org?.username}/boards?milestone=${milestone?.id}&milestoneCommentId=${milestoneCommentId}`,
      undefined,
      {
        shallow: true,
      }
    );
  }
  return (
    <AppLayout banner={null}>
      <CircularProgress />
    </AppLayout>
  );
}

export default TaskRedirect;
