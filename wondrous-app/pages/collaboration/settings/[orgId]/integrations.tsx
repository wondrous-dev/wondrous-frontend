import React from 'react';
import { withAuth } from 'components/Auth/withAuth';
import Integrations from 'components/Settings/Integrations';
import { useRouter } from 'next/router';

function GeneralSettingsPage() {
  const router = useRouter();
  const { orgId, podId } = router.query;

  return <Integrations orgId={orgId} podId={podId} />;
}

export default withAuth(GeneralSettingsPage);
