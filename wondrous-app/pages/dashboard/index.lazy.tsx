import React from 'react';
import { useRouter } from 'next/router';

import { withAuth } from 'components/Auth/withAuth';
import Boards from 'components/Dashboard/boards';
import Wrapper from 'components/Dashboard/wrapper';
import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import { useIsMobile } from 'utils/hooks';

type Props = {
  meta: {
    title: string;
    img: string;
    description: string;
  };
};

const DashboardLazy = ({ meta }: Props) => {
  const router = useRouter();
  const isAdmin = router.asPath.includes('/dashboard/admin');
  const isMobile = useIsMobile();

  return (
    <Wrapper isAdmin={isAdmin}>
      {isMobile ? <MobileComingSoonModal /> : null}

      <Boards isAdmin={isAdmin} />
    </Wrapper>
  );
};

export default withAuth(DashboardLazy);
