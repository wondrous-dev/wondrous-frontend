import React from 'react';
import { PodGeneralSettings } from 'components/Settings/generalSettings';
import { withAuth } from 'components/Auth/withAuth';

const GeneralSettingsPage = () => {
  return <PodGeneralSettings />;
};

export default withAuth(GeneralSettingsPage);
