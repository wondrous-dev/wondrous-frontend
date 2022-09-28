import { withAuth } from 'components/Auth/withAuth';
import SearchResult from 'components/SearchResult';
import React from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { UserBoardContext } from 'utils/contexts';

const SearchResultPage = () => {
  const value = React.useMemo(
    () => ({
      entityType: ENTITIES_TYPES.TASK,
    }),
    []
  );
  return (
    <UserBoardContext.Provider value={value}>
      <SearchResult />;
    </UserBoardContext.Provider>
  );
};

export default withAuth(SearchResultPage);
