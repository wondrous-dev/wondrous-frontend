import React from 'react';
import Members from 'components/Settings/Members';
import { withAuth } from 'components/Auth/withAuth';

function MembersPage() {
  return <Members />;
}

export default withAuth(MembersPage);
