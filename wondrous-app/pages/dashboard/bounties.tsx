import React from 'react';

import MetaTags from 'components/MetaTags';
import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';
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

export { getServerSideProps };
