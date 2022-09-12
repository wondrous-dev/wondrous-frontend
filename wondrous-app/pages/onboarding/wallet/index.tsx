import React from 'react';

import { MainWrapper } from 'components/Onboarding/styles';
import { withAuth } from 'components/Auth/withAuth';
import SetupWallet from 'components/Onboarding/SetupWallet';

function SetupWalletPage() {
  return (
    <MainWrapper>
      <SetupWallet />
    </MainWrapper>
  );
}

export default withAuth(SetupWalletPage);
