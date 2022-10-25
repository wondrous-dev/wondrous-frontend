import React from 'react';
import { useMe, withAuth } from 'components/Auth/withAuth';
import LogInMethods from 'components/Settings/LoginMethods';

function LoginMethodsPage() {
  const loggedInUser = useMe();
  return <LogInMethods loggedInUser={loggedInUser} />;
}

export default withAuth(LoginMethodsPage);
