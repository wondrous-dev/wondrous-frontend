import React from 'react';
import { useRouter } from 'next/router';
import { GithubIntegration } from 'components/Settings/Github/pod';
import { withAuth } from 'components/Auth/withAuth';
import { useQuery } from '@apollo/client';
import { GET_POD_BY_ID } from 'graphql/queries';

const GithubIntegrationPage = () => {
  const router = useRouter();

  const { podId } = router.query;
  const { data: podData } = useQuery(GET_POD_BY_ID, {
    variables: {
      podId,
    },
  });

  return <GithubIntegration orgId={podData?.getPodById?.orgId} podId={podId} />;
};

export default withAuth(GithubIntegrationPage);
