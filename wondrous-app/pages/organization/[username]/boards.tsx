import MetaTags from 'components/MetaTags';
import React from 'react';

import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';

import lazy from 'utils/enhancements/lazy';
import apollo from 'services/apollo';
import { GET_TASK_BY_ID, GET_TASK_PROPOSAL_BY_ID, GET_PREVIEW_FILE } from 'graphql/queries';

const BoardsLazyPage = lazy(() => import('./boards.lazy'), BoardSkeleton);

const BoardsPage = (props) => (
  <>
    <MetaTags meta={props.meta} />
    <BoardsLazyPage {...props} />
  </>
);

export const getServerSideProps = async (context) => ({
  props: {},
});

export default BoardsPage;
