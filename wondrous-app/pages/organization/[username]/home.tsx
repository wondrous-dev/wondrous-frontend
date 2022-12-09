import { withAuth } from 'components/Auth/withAuth';
import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';
import lazy from 'utils/enhancements/lazy';

const OrgProject = lazy(() => import('components/organization/project'), BoardSkeleton);

function ProjectPage(props) {
  return <OrgProject {...props} />;
}

export default withAuth(ProjectPage);
