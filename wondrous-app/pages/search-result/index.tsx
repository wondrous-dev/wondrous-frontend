import { withAuth } from 'components/Auth/withAuth';
import SearchResultUserCreatedTasks from 'components/SearchResultUserCreatedTasks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SearchResultPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!router.query.suggestion) router.push('/search-result?suggestion=user-created-tasks');
  }, [router]);
  if (router.query.suggestion === 'user-created-tasks') return <SearchResultUserCreatedTasks />;
  return <SearchResultUserCreatedTasks />;
};

export default withAuth(SearchResultPage);
