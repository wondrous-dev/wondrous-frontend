import TaskImport from 'components/Settings/TaskImport';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';

function TaskImportPage() {
  const router = useRouter();

  const { podId } = router.query;

  return <TaskImport podId={podId} />;
}

export default withAuth(TaskImportPage);
