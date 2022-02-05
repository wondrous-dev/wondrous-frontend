import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORG_INVITE_ORG_INFO } from '../../graphql/queries/org';

import { InviteWelcomeBox, Logo } from '../../components/Onboarding/signup';
import { MainWrapper } from '../../components/Onboarding/styles';
import { REDEEM_ORG_INVITE_LINK } from '../../graphql/mutations';
import { withAuth, useMe } from '../../components/Auth/withAuth';

const ContributorOnboardingPage = () => {
  const router = useRouter();

  const { token } = router.query;
  const { data, loading, error } = useQuery(GET_ORG_INVITE_ORG_INFO, {
    variables: {
      token,
    },
  });
  const user = useMe();
  const [redeemOrgInviteLink] = useMutation(REDEEM_ORG_INVITE_LINK);
  const orgInfo = data?.getInvitedOrgInfo;
  useEffect(() => {
    if (user && token && orgInfo) {
      redeemOrgInviteLink({
        variables: {
          token,
        },
        onCompleted: (data) => {
          router.push(`/organization/${orgInfo?.username}/boards`, undefined, {
            shallow: true,
          });
        },
        onError: () => {
          router.push(`/organization/${orgInfo?.username}/boards`, undefined, {
            shallow: true,
          });
        },
      });
    }
  }, [user, orgInfo, token, router]);
  return (
    <MainWrapper>
      <Logo />
      <InviteWelcomeBox orgInfo={orgInfo} redeemOrgInviteLink={redeemOrgInviteLink} />
    </MainWrapper>
  );
};

export default withAuth(ContributorOnboardingPage);
