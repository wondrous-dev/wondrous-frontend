import MetaTags from 'components/MetaTags';
import React from 'react';

import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';
import { getServerSideProps } from 'utils/board/dataFetching';
import lazy from 'utils/enhancements/lazy';

const Boards = lazy(() => import('./boards.lazy'), BoardSkeleton);

const BoardsPage = (props) => (
  <>
    <MetaTags meta={props.meta} />
    <Boards {...props} />
  </>
);

export default BoardsPage;
export { getServerSideProps };
