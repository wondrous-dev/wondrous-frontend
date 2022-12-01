import Wrapper from 'components/Dashboard/wrapper';
import { useRouter } from 'next/router';
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

DashboardPage.getLayout = (page) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const isAdmin = router.asPath.includes('/dashboard/admin');

  return <Wrapper isAdmin={isAdmin}>{page}</Wrapper>;
};

export { getServerSideProps };
