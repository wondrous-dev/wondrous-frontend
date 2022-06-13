import React from 'react';

import { MainWrapper } from 'components/Onboarding/styles';
import { ConnectTwitter } from 'components/Onboarding/ConnectTwitter/connect-twitter';
import { withAuth } from 'components/Auth/withAuth';

const ConnectTwitterPage = () => {
  return (
    <MainWrapper>
      <ConnectTwitter />
    </MainWrapper>
  );
};

export default withAuth(ConnectTwitterPage);
