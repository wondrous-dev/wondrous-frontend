import SearchResult from 'components/SearchResult';
import { UserBoardContext } from 'utils/contexts';

const SearchResultPage = () => (
  <UserBoardContext.Provider value={{}}>
    <SearchResult />;
  </UserBoardContext.Provider>
);

export default SearchResultPage;
