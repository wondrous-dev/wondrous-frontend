import React from 'react';
import Integrations from '../../../../components/Settings/Integrations';
import { withAuth } from 'components/Auth/withAuth';

const GeneralSettingsPage = () => {
  return <Integrations />;
};

export default withAuth(GeneralSettingsPage);
