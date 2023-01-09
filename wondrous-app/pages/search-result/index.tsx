import { withAuth } from 'components/Auth/withAuth';
import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import SearchResultUserCreatedTasks from 'components/SearchResultUserCreatedTasks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SearchResultPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!router.query.suggestion) router.push('/search-result?suggestion=user-created-tasks');
  }, [router]);

  const Component =
    router.query.suggestion === 'user-created-tasks' ? SearchResultUserCreatedTasks : SearchResultUserCreatedTasks;
  return (
    <>
      <TaskViewModalWatcher />
      <Component />
    </>
  );
};

export default withAuth(SearchResultPage);
