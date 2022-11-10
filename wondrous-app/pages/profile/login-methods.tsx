import React from 'react';
import { withAuth } from 'components/Auth/withAuth';
import LogInMethods from 'components/Settings/LoginMethods';

function LoginMethodsPage() {
  return <LogInMethods />;
}

export default withAuth(LoginMethodsPage);
