import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ORG_INVITE_ORG_INFO } from 'graphql/queries/org';

import { Invite } from 'components/Onboarding/Invite';
import { MainWrapper } from 'components/Onboarding/styles';
import { REDEEM_ORG_INVITE_LINK, REDEEM_POD_INVITE_LINK } from 'graphql/mutations';
import { withAuth, useMe } from 'components/Auth/withAuth';
import { GET_POD_INVITE_ORG_INFO } from 'graphql/queries';
import { Org } from 'types/Org';
import { OrgPod } from 'types/pod';
import { Spinner } from 'components/Dashboard/bounties/styles';

enum Type {
  ORG = 'org',
  Pod = 'pod',
}

type Props = {
  preloadedState: {
    orgInfo?: Org;
    podInfo?: OrgPod;
  };
};

function ContributorOnboardingPage({ preloadedState }: Props) {
  const router = useRouter();

  const { token, type } = router.query;

  const [getOrgInviteOrgInfo, { data: orgData }] = useLazyQuery(GET_ORG_INVITE_ORG_INFO);
  const [getPodInvitePodInfo, { data: podData }] = useLazyQuery(GET_POD_INVITE_ORG_INFO);

  const user = useMe();
  const [redeemOrgInviteLink, { loading: orgInviteLinkLoading, data: orgInviteLinkData }] =
    useMutation(REDEEM_ORG_INVITE_LINK);
  const [redeemPodInviteLInk, { loading: podInviteLinkLoading, data: podInviteLinkData }] =
    useMutation(REDEEM_POD_INVITE_LINK);
  const orgInfo = preloadedState?.orgInfo || orgData?.getInvitedOrgInfo;
  const podInfo = preloadedState?.podInfo || podData?.getInvitedPodInfo;
  useEffect(() => {
    if (token) {
      if (!orgInfo && !type) {
        getOrgInviteOrgInfo({ variables: { token } });
      }

      if (!podInfo && type === Type.Pod) {
        getPodInvitePodInfo({ variables: { token } });
      }
    }

    if (user && token) {
      if (orgInfo) {
        redeemOrgInviteLink({
          variables: {
            token,
          },
          onCompleted: (data) => {
            if (orgInfo?.shared) {
              router.push(`/organization/${orgInfo?.username}/boards`, undefined, {
                shallow: true,
              });
            } else {
              router.push(`/organization/${orgInfo?.username}/home`, undefined, {
                shallow: true,
              });
            }
          },
          onError: () => {
            if (orgInfo?.shared) {
              router.push(`/organization/${orgInfo?.username}/boards`, undefined, {
                shallow: true,
              });
            } else {
              router.push(`/organization/${orgInfo?.username}/home`, undefined, {
                shallow: true,
              });
            }
          },
        });
      } else if (podInfo) {
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
  }, [user, orgInfo, token, router, type, podInfo, preloadedState]);

  const loading = orgInviteLinkLoading || podInviteLinkLoading;

  const hasData = orgInviteLinkData?.redeemOrgInviteLink?.success || podInviteLinkData?.redeemPodInviteLink?.success;
  return (
    <MainWrapper>
      {loading || hasData ? (
        <Spinner />
      ) : (
        <Invite
          orgInfo={orgInfo}
          podInfo={podInfo}
          redeemOrgInviteLink={redeemOrgInviteLink}
          redeemPodInviteLink={redeemPodInviteLInk}
        />
      )}
    </MainWrapper>
  );
}

export default withAuth(ContributorOnboardingPage);
