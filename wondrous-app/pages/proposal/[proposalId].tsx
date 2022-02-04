import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_TASK_PROPOSAL_BY_ID } from '../../graphql/queries/taskProposal';
import AppLayout from '../../components/Common/Layout/App';
import { CircularProgress } from '@material-ui/core';
const TaskRedirect = () => {
  const router = useRouter();
  const { proposalId } = router.query;
  const [getTaskById, { data: proposalData }] = useLazyQuery(GET_TASK_PROPOSAL_BY_ID);
  useEffect(() => {
    getTaskById({
      variables: {
        proposalId,
      },
    });
  }, [proposalId]);

  const taskProposal = proposalData?.getTaskProposalById;
  if (taskProposal?.org?.username) {
    router.push(`/organization/${taskProposal?.org?.username}/boards?taskProposal=${taskProposal?.id}`, undefined, {
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
