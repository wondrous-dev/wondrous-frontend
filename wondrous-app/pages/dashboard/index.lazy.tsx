import React from 'react';
import { useRouter } from 'next/router';

import { withAuth } from 'components/Auth/withAuth';
import Boards from 'components/Dashboard/boards';

const DashboardLazy = () => {
  const router = useRouter();
  const isAdmin = router.asPath.includes('/dashboard/admin');

  return <Boards isAdmin={isAdmin} />;
};

export default withAuth(DashboardLazy);
