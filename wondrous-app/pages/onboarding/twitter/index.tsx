import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { InviteWelcomeBox } from 'components/Onboarding/connect-twitter';
import { MainWrapper } from 'components/Onboarding/styles';
import { withAuth } from 'components/Auth/withAuth';



const TwitterConnectPage = () => {
  const router = useRouter();

  return (
    <MainWrapper>
      <InviteWelcomeBox />
    </MainWrapper>
  );
};

export default withAuth(TwitterConnectPage);
