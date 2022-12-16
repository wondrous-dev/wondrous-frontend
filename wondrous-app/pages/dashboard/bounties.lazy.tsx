import { withAuth } from 'components/Auth/withAuth';
import { useIsMobile } from 'utils/hooks';
import { ViewType } from 'types/common';
import { useRouter } from 'next/router';
import Board from 'components/Dashboard/bounties';

const BountiesPage = () => {
  const router = useRouter();
  const isAdmin = router.query.view === ViewType.Admin;

  return <Board isAdmin={isAdmin} />;
};

export default withAuth(BountiesPage);
