import { withAuth } from 'components/Auth/withAuth';
import SearchResult from 'components/SearchResult';

const SearchResultPage = () => <SearchResult />;

export default withAuth(SearchResultPage);
