import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_MILESTONE_BY_ID } from 'graphql/queries/milestone';
import AppLayout from 'components/Common/Layout/App';
import { CircularProgress } from '@mui/material';

function MilestoneRedirect() {
  const router = useRouter();
  const { milestoneId } = router.query;
  const [getMilestoneById, { data: milestoneData }] = useLazyQuery(GET_MILESTONE_BY_ID);
  useEffect(() => {
    getMilestoneById({
      variables: {
        milestoneId,
      },
    });
  }, [milestoneId]);

  const milestone = milestoneData?.getMilestoneById;
  if (milestone?.org?.username) {
    router.push(`/organization/${milestone?.org?.username}/boards?milestone=${milestoneId}`, undefined, {
      shallow: true,
    });
  }
  return (
    <AppLayout banner={null}>
      <CircularProgress />
    </AppLayout>
  );
}

export default MilestoneRedirect;
