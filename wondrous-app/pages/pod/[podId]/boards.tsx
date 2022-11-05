import MetaTags from 'components/MetaTags';
import React from 'react';

import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';
import { getServerSideProps } from 'utils/board/dataFetching';
import lazy from 'utils/enhancements/lazy';

const BoardsLazyPage = lazy(() => import('./boardsLazy'), BoardSkeleton);

const BoardsPage = (props) => (
  <>
    <MetaTags meta={props.meta} />
    <BoardsLazyPage {...props} />
  </>
);

export default BoardsPage;
export { getServerSideProps };
