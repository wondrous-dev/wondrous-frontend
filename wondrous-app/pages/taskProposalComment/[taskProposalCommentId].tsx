import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_TASK_PROPOSAL_BY_ID, GET_TASK_PROPOSAL_COMMENT_BY_ID } from '../../graphql/queries/taskProposal';
import AppLayout from '../../components/Common/Layout/App';
import { CircularProgress } from '@material-ui/core';

const TaskRedirect = () => {
  const router = useRouter();
  const { taskProposalCommentId } = router.query;
  const [getTaskProposalById, { data: taskProposalData }] = useLazyQuery(GET_TASK_PROPOSAL_BY_ID);
  const [getTaskProposalCommentById] = useLazyQuery(GET_TASK_PROPOSAL_COMMENT_BY_ID, {
    onCompleted: (data) => {
      const taskProposalComment = data?.getTaskProposalCommentById;
      getTaskProposalById({
        variables: {
          proposalId: taskProposalComment?.proposalId,
        },
      });
    },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    if (taskProposalCommentId) {
      getTaskProposalCommentById({
        variables: {
          proposalCommentId: taskProposalCommentId,
        },
      });
    }
  }, [taskProposalCommentId]);

  const task = taskProposalData?.getTaskProposalById;

  if (task?.org?.username) {
    router.push(`/organization/${task?.org?.username}/boards?taskProposal=${task?.id}`);
  }

  return (
    <AppLayout banner={null}>
      <CircularProgress />
    </AppLayout>
  );
};

export default TaskRedirect;
