import React from 'react';

import Wrapper from 'components/Dashboard/wrapper';
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

ProposalsPage.getLayout = (page) => <Wrapper isAdmin={false}>{page}</Wrapper>;

export { getServerSideProps };
