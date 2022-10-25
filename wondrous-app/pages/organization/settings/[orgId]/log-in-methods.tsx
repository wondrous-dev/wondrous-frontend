import React from 'react';
import { withAuth } from 'components/Auth/withAuth';
import LogInMethods from 'components/Settings/LoginMethods';

function LogInMethodsPage() {
  return <LogInMethods />;
}

export default withAuth(LogInMethodsPage);
