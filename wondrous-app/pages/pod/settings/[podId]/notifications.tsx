import React from 'react';
import { useRouter } from 'next/router';
import PodNotification from 'components/Settings/Notifications/PodNotification';
import { withAuth } from 'components/Auth/withAuth';

function NotificationsPage() {
  const router = useRouter();

  const { podId } = router.query;

  return <PodNotification podId={podId} />;
}

export default withAuth(NotificationsPage);
