import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_TASK_SUBMISSION_BY_ID, GET_SUBMISSION_COMMENT_BY_ID } from 'graphql/queries/';
import AppLayout from 'components/Common/Layout/App';
import { CircularProgress } from '@mui/material';

function TaskRedirect() {
  const router = useRouter();
  const { submissionCommentId } = router.query;
  const [getTaskSubmissionById, { data: taskSubmissiondata }] = useLazyQuery(GET_TASK_SUBMISSION_BY_ID);
  const [getTaskSubmissionCommentById] = useLazyQuery(GET_SUBMISSION_COMMENT_BY_ID, {
    onCompleted: (data) => {
      const submissionComment = data?.getTaskSubmissionCommentById;
      getTaskSubmissionById({
        variables: {
          submissionId: submissionComment?.submissoinId,
        },
      });
    },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    if (submissionCommentId) {
      getTaskSubmissionCommentById({
        variables: {
          submissionCommentId,
        },
      });
    }
  }, [submissionCommentId]);

  const submission = taskSubmissiondata?.getTaskSubmissionById;

  if (submission?.org?.username) {
    router.push(`/organization/${submission?.org?.username}/boards?task=${submission?.taskId}`, undefined, {
      shallow: true,
    });
  }

  return (
    <AppLayout banner={null}>
      <CircularProgress />
    </AppLayout>
  );
}

export default TaskRedirect;
