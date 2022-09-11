import React from 'react';
import { withAuth } from 'components/Auth/withAuth';
import Integrations from 'components/Settings/Integrations';

function GeneralSettingsPage() {
  return <Integrations />;
}

export default withAuth(GeneralSettingsPage);
