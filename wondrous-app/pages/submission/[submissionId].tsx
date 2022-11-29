import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_TASK_SUBMISSION_BY_ID } from 'graphql/queries';
import AppLayout from 'components/Common/Layout/App';
import CircularProgress from '@mui/material/CircularProgress';

function TaskRedirect() {
  const router = useRouter();
  const { submissionId } = router.query;
  const [getSubmissionById, { data: submissionData }] = useLazyQuery(GET_TASK_SUBMISSION_BY_ID);
  useEffect(() => {
    getSubmissionById({
      variables: {
        submissionId,
      },
    });
  }, [submissionId, getSubmissionById]);

  const taskSubmission = submissionData?.getTaskSubmissionById;
  if (taskSubmission?.org?.username) {
    router.push(`/organization/${taskSubmission?.org?.username}/boards?task=${taskSubmission?.taskId}`, undefined, {
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
