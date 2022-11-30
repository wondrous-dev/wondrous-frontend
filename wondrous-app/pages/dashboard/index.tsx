import React, { useEffect } from 'react';

import MetaTags from 'components/MetaTags';
import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';
import { getServerSideProps } from 'utils/board/dataFetching';
import lazy from 'utils/enhancements/lazy';

const Dashboard = lazy(() => import('./index.lazy'), BoardSkeleton);

const DashboardPage = (props) => {
  console.log('-----DashboardPage:render');

  useEffect(() => {
    console.log('-----DashboardPage:mounted');
    return () => console.log('-----DashboardPage:unmounted');
  }, []);

  return (
    <>
      <MetaTags meta={props.meta} />
      <Dashboard {...props} />
    </>
  );
};

export default DashboardPage;

export { getServerSideProps };
