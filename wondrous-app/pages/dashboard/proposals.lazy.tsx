import React from 'react';

import Wrapper from 'components/Dashboard/wrapper';
import { withAuth } from 'components/Auth/withAuth';
import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import { useIsMobile } from 'utils/hooks';
import Board from 'components/Dashboard/proposals';

const ProposalsPage = () => {
  const isMobile = useIsMobile();

  return (
    <Wrapper isAdmin={false}>
      {isMobile ? <MobileComingSoonModal /> : null}
      <Board />
    </Wrapper>
  );
};

export default withAuth(ProposalsPage);
