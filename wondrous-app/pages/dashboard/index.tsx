import React from 'react';

import boardSkeleton from 'components/Dashboard/boards/BoardSkeleton';
import { getServerSideProps } from 'utils/board/dataFetching';
import lazy from 'utils/enhancements/lazy';

const DashboardLazy = lazy(() => import('./index.lazy'));

const Dashboard = (props) => <DashboardLazy fallback={boardSkeleton} {...props} />;

export default Dashboard;

export { getServerSideProps };
