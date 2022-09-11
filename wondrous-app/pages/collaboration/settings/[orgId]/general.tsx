import React from 'react';
import GeneralSettings from 'components/Settings/generalSettings';
import { withAuth } from 'components/Auth/withAuth';

function GeneralSettingsPage() {
  return <GeneralSettings />;
}

export default withAuth(GeneralSettingsPage);
