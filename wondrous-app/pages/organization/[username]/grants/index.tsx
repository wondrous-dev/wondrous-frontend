import MetaTags from 'components/MetaTags';
import React from 'react';

import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';

import lazy from 'utils/enhancements/lazy';
import { getServerSideProps } from 'utils/board/dataFetching';

const BoardsLazyPage = lazy(() => import('./boards.lazy'), BoardSkeleton);

const BoardsPage = (props) => (
  <>
    <MetaTags meta={props.meta} />
    <BoardsLazyPage {...props} />
  </>
);

export default BoardsPage;
export { getServerSideProps };
