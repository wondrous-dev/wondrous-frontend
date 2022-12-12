import React from 'react';

import Wrapper from 'components/Dashboard/wrapper';
import { useRouter } from 'next/router';
import MetaTags from 'components/MetaTags';
import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';
import { ViewType } from 'types/common';
import { getServerSideProps } from 'utils/board/dataFetching';
import lazy from 'utils/enhancements/lazy';

const Bounties = lazy(() => import('./bounties.lazy'), BoardSkeleton);

const BountiesPage = (props) => (
  <>
    <MetaTags meta={props.meta} />
    <Bounties {...props} />
  </>
);

export default BountiesPage;

BountiesPage.getLayout = (page) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const isAdmin = router.query.view === ViewType.Admin;

  return <Wrapper isAdmin={isAdmin}>{page}</Wrapper>;
};

export { getServerSideProps };
