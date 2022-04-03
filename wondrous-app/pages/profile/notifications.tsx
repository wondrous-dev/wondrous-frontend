import React from 'react';
import { useMe, withAuth } from '../../components/Auth/withAuth';
import ProfileSettings from '../../components/Settings/Notifications/profile';

const NotificationsSettingsPage = () => {
  const loggedInUser = useMe();
  return <ProfileSettings loggedInUser={loggedInUser} />;
};

export default withAuth(NotificationsSettingsPage);
