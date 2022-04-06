import React from 'react';
import { useRouter } from 'next/router';
import Notifications from 'components/Settings/Notifications';

const NotificationsPage = () => {
  const router = useRouter();

  const { orgId } = router.query;

  return <Notifications orgId={orgId} />;
};

export default NotificationsPage;
