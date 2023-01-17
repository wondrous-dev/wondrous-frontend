import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';

import { Invite } from 'components/Onboarding/Invite';
import { MainWrapper } from 'components/Onboarding/styles';
import { REDEEM_POD_INVITE_LINK } from 'graphql/mutations';
import { withAuth, useMe } from 'components/Auth/withAuth';
import { GET_POD_INVITE_ORG_INFO } from 'graphql/queries';

function ContributorOnboardingPage() {
  const router = useRouter();

  const { token } = router.query;

  const [getPodInvitePodInfo, { data: podData }] = useLazyQuery(GET_POD_INVITE_ORG_INFO);

  const user = useMe();
  const [redeemPodInviteLInk] = useMutation(REDEEM_POD_INVITE_LINK);
  const podInfo = podData?.getInvitedPodInfo;
  useEffect(() => {
    if (token) {
      getPodInvitePodInfo({ variables: { token } });
    }

    if (user && token) {
      if (podInfo) {
        redeemPodInviteLInk({
          variables: {
            token,
          },
          onCompleted: (data) => {
            router.push(`/pod/${podInfo?.id}/home`, undefined, {
              shallow: true,
            });
          },
          onError: () => {
            router.push(`/pod/${podInfo?.id}/home`, undefined, {
              shallow: true,
            });
          },
        });
      }
    }
  }, [user, token, router, podInfo]);
  return (
    <MainWrapper>
      <Invite podInfo={podInfo} redeemPodInviteLink={redeemPodInviteLInk} />
    </MainWrapper>
  );
}

export default withAuth(ContributorOnboardingPage);
