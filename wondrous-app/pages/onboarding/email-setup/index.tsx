import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';

import { InviteWelcomeBox } from '../../../components/Onboarding/email-setup';
import { MainWrapper } from '../../../components/Onboarding/styles';
import { UPDATE_USER } from '../../../graphql/mutations';
import { withAuth } from '../../../components/Auth/withAuth';
import { GET_USER_ORGS } from '../../../graphql/queries/org';
import { GET_USER_PODS } from '../../../graphql/queries';

const ContributorBuildProfilePage = () => {
  const router = useRouter();
  const { data: getOrgData } = useQuery(GET_USER_ORGS);
  const { data: getPodData } = useQuery(GET_USER_PODS);
  const [redirect, setRedirect] = useState(false);
  let firstOrg,
    firstPod = null;
  const orgs = getOrgData?.getUserOrgs;
  const pods = getPodData?.getUserPods;
  if (orgs?.length > 0) {
    firstOrg = orgs[0];
  }
  if (pods?.length > 0) {
    firstPod = pods[0];
  }
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: async () => {
      // Find org associated with user
      setRedirect(true);
    },
  });

  useEffect(() => {
    if (redirect) {
      if (!firstOrg && !firstPod) {
        router.push('/explore', undefined, {
          shallow: true,
        });
      } else {
        if (firstPod) {
          router.push(`/pod/${firstPod?.id}/boards`, undefined, {
            shallow: true,
          });
        } else if (firstOrg) {
          router.push(`/organization/${firstOrg?.username}/boards`, undefined, {
            shallow: true,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect]);
  return (
    <MainWrapper>
      <InviteWelcomeBox updateUser={updateUser} firstOrg={firstOrg} firstPod={firstPod} />
    </MainWrapper>
  );
};

export default withAuth(ContributorBuildProfilePage);
