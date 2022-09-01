import React from 'react';
import { PodGeneralSettings } from 'components/Settings/generalSettings';
import { withAuth } from 'components/Auth/withAuth';

function GeneralSettingsPage() {
  return <PodGeneralSettings />;
}

export default withAuth(GeneralSettingsPage);
