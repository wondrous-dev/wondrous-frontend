import MetaTags from 'components/MetaTags';
import { useRouter } from 'next/router';
import React from 'react';
import { withAuth } from 'components/Auth/withAuth';
import Boards from 'components/Dashboard/boards';
import Wrapper from 'components/Dashboard/wrapper';
import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import { useIsMobile } from 'utils/hooks';
import { getServerSideProps } from 'utils/board/dataFetching';

type Props = {
  meta: {
    title: string;
    img: string;
    description: string;
  };
};

const Dashboard = ({ meta }: Props) => {
  const router = useRouter();
  const isAdmin = router.asPath.includes('/dashboard/admin');
  const isMobile = useIsMobile();
  return (
    <Wrapper isAdmin={isAdmin}>
      <MetaTags meta={meta} />
      {isMobile ? <MobileComingSoonModal /> : null}

      <Boards isAdmin={isAdmin} />
    </Wrapper>
  );
};

export default withAuth(Dashboard);

export { getServerSideProps };
