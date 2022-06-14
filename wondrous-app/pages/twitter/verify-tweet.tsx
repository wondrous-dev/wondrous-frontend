import React from 'react';

import { MainWrapper } from 'components/Onboarding/styles';
import VerifyTweet from 'components/Onboarding/VerifyTweet';
import { withAuth } from 'components/Auth/withAuth';

const ConnectTwitterPage = () => {
  return (
    <MainWrapper>
      <VerifyTweet />
    </MainWrapper>
  );
};

export default withAuth(ConnectTwitterPage);
