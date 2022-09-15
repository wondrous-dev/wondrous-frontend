import TaskImport from 'components/Settings/TaskImport';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';

function TaskImportPage() {
  const router = useRouter();

  const { orgId } = router.query;

  return <TaskImport orgId={orgId} />;
}

export default withAuth(TaskImportPage);
