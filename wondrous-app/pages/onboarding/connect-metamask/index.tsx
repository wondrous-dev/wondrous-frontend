import React, {useState} from 'react';
import { useRouter } from 'next/router';
import {useMutation, useQuery} from '@apollo/client';

import { MainWrapper } from 'components/Onboarding/styles';
import { UPDATE_USER } from 'graphql/mutations';
import { useMe, withAuth } from 'components/Auth/withAuth';
import { OnboardingWallet } from 'components/Onboarding/ConnectMetaMask';
import {GET_USER_ORGS, GET_USER_PODS} from "graphql/queries";

const OnboardingConnectPage = () => {
  const router = useRouter();
  const user = useMe();
  const { data: getOrgData } = useQuery(GET_USER_ORGS);
  const { data: getPodData } = useQuery(GET_USER_PODS);

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      router.push('/onboarding/email-setup', undefined, {
        shallow: true,
      });
    },
  });

  return (
      <MainWrapper>
        <OnboardingWallet updateUser={updateUser}/>
      </MainWrapper>
  );
};

export default (OnboardingConnectPage);
