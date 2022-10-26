import React from 'react';
import { useRouter } from 'next/router';
import Notifications from 'components/Settings/Notifications';
import { withAuth } from 'components/Auth/withAuth';

function NotificationsPage() {
  const router = useRouter();

  const { orgId } = router.query;

  return <Notifications orgId={orgId} isCollab />;
}

export default withAuth(NotificationsPage);
