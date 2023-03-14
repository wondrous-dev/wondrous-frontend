import React from 'react';
import { useRouter } from 'next/router';
import { GithubIntegration } from 'components/Settings/Github';
import { withAuth } from 'components/Auth/withAuth';
import ConnectionContext from 'components/Settings/Integrations/Helpers/ConnectionContext';

function GithubIntegrationPage() {
  const router = useRouter();

  const { orgId } = router.query;

  return (
    <ConnectionContext.Provider
      value={{
        orgId,
      }}
    >
      <GithubIntegration />
    </ConnectionContext.Provider>
  );
}

export default withAuth(GithubIntegrationPage);
