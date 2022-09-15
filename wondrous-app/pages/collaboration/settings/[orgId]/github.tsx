import React from 'react';
import { useRouter } from 'next/router';
import { GithubIntegration } from 'components/Settings/Github';
import { withAuth } from 'components/Auth/withAuth';

function GithubIntegrationPage() {
  const router = useRouter();

  const { orgId } = router.query;

  return <GithubIntegration orgId={orgId} />;
}

export default withAuth(GithubIntegrationPage);
