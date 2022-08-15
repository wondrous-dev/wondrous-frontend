import TokenGatingSettings from 'components/Settings/TokenGating';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';

function TokenGatingPage() {
  const router = useRouter();

  const { orgId } = router.query;

  return <TokenGatingSettings orgId={orgId} />;
}

export default withAuth(TokenGatingPage);
