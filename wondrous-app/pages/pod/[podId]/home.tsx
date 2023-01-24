import { withAuth } from 'components/Auth/withAuth';
import BoardSkeleton from 'components/Dashboard/boards/BoardSkeleton';
import lazy from 'utils/enhancements/lazy';

const PodProject = lazy(() => import('components/Pod/project'), BoardSkeleton);

function ProjectPage(props) {
  return <PodProject {...props} />;
}

export default withAuth(ProjectPage);
