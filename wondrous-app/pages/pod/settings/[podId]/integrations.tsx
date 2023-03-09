import React from 'react';
import { withAuth } from 'components/Auth/withAuth';
import Integrations from 'components/Settings/Integrations';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_POD_BY_ID } from 'graphql/queries';

function IntegrationsPage() {
  const router = useRouter();
  const { podId } = router.query;
  const { data: podData } = useQuery(GET_POD_BY_ID, {
    variables: {
      podId,
    },
  });

  return <Integrations orgId={podData?.getPodById?.orgId} podId={podId} />;
}

export default withAuth(IntegrationsPage);
