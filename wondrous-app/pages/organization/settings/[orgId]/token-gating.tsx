import TokenGatingSettings from 'components/Settings/TokenGating';
import { useRouter } from 'next/router';

const TokenGatingPage = () => {
  const router = useRouter();

  const { orgId } = router.query;

  return <TokenGatingSettings orgId={orgId}/>;
};

export default TokenGatingPage;
