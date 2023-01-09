import React from 'react';

import { MainWrapper } from 'components/Onboarding/styles';
import ConnectTwitter from 'components/Onboarding/ConnectTwitter/connect-twitter';
import { withAuth } from 'components/Auth/withAuth';
import { useQuery } from '@apollo/client';

import { GET_USER_ORGS } from 'graphql/queries/org';
import { GET_USER_PODS } from 'graphql/queries';

function ConnectTwitterPage() {
  const { data: getOrgData } = useQuery(GET_USER_ORGS);
  const { data: getPodData } = useQuery(GET_USER_PODS);
  let firstOrg;
  let firstPod = null;
  const orgs = getOrgData?.getUserOrgs;
  const pods = getPodData?.getUserPods;

  if (orgs?.length > 0) {
    firstOrg = orgs[0];
  }

  if (pods?.length > 0) {
    firstPod = pods[0];
  }

  return (
    <MainWrapper>
      <ConnectTwitter firstOrg={firstOrg} firstPod={firstPod} />
    </MainWrapper>
  );
}

export default withAuth(ConnectTwitterPage);
