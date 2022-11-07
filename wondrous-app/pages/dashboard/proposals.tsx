import React from 'react';

import MetaTags from 'components/MetaTags';
import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';
import { getServerSideProps } from 'utils/board/dataFetching';
import lazy from 'utils/enhancements/lazy';

const Proposals = lazy(() => import('./proposals.lazy'), BoardSkeleton);

const ProposalsPage = (props) => (
  <>
    <MetaTags meta={props.meta} />
    <Proposals {...props} />
  </>
);

export default ProposalsPage;

export { getServerSideProps };
