import React from 'react';

import MetaTags from 'components/MetaTags';
import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';
import { getServerSideProps } from 'utils/board/dataFetching';
import lazy from 'utils/enhancements/lazy';

const Dashboard = lazy(() => import('./index.lazy'), BoardSkeleton);

const DashboardPage = (props) => (
  <>
    <MetaTags meta={props.meta} />
    <Dashboard {...props} />
  </>
);

export default DashboardPage;

export { getServerSideProps };
