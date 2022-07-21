import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';

import { MainWrapper } from 'components/Onboarding/styles';
import { UPDATE_USER } from 'graphql/mutations';
import { useMe, withAuth } from 'components/Auth/withAuth';
import { SetupWallet } from 'components/Onboarding/SetupWallet';
import { GET_USER_ORGS, GET_USER_PODS } from 'graphql/queries';

const SetupWalletPage = () => {
  const router = useRouter();
  const user = useMe();

  return (
    <MainWrapper>
      <SetupWallet />
    </MainWrapper>
  );
};

export default withAuth(SetupWalletPage);
