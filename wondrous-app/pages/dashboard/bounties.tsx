import MetaTags from 'components/MetaTags';
import Wrapper from 'components/Dashboard/wrapper';
import { withAuth } from 'components/Auth/withAuth';
import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import { useIsMobile } from 'utils/hooks';
import { ViewType } from 'types/common';
import { useRouter } from 'next/router';
import Board from 'components/Dashboard/bounties';
import { getServerSideProps } from 'utils/board';

type Props = {
  meta: {
    title: string;
    img: string;
    description: string;
  };
};

const BountiesPage = ({ meta }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const isAdmin = router.query.view === ViewType.Admin;

  return (
    <Wrapper isAdmin={isAdmin}>
      <MetaTags meta={meta} />
      {isMobile ? <MobileComingSoonModal /> : null}
      <Board isAdmin={isAdmin} />
    </Wrapper>
  );
};

export default withAuth(BountiesPage);

export { getServerSideProps };
