export const handleUserOnboardingRedirect = (user, router, inviteToken = null, inviteType = null) => {
  const { collabInvite, token, type } = router.query;

  const discordOrRouterToken = inviteToken || token;

  const discordOrRouterType = inviteType || type;

  let defaultRoute = collabInvite ? `/invite/collab/${collabInvite}` : '/mission-control';

  if (discordOrRouterToken) {
    defaultRoute = `/invite/${discordOrRouterToken}`;
  }

  if (discordOrRouterType === 'pod') {
    defaultRoute = `/invite/pod/${discordOrRouterToken}`;
  }

  const collabInviteQuery = collabInvite ? `?collabInvite=${collabInvite}` : '';
  if (user?.signupCompleted) {
    router.push(defaultRoute, undefined, {
      shallow: true,
    });
  } else if (user?.profilePictureUrl) {
    router.push(defaultRoute, undefined, {
      shallow: true,
    });
  } else if (user?.username) {
    router.push(`/onboarding/build-profile${collabInviteQuery}`, undefined, {
      shallow: true,
    });
  } else if (user?.id) {
    router.push(`/onboarding/welcome${collabInviteQuery}`, undefined, {
      shallow: true,
    });
  }
};

export const handleUserFirstOnboarding = (router, collabInvite, firstOrg, firstPod) => {
  // if user has collabInvite token and is not a member of an org we assume they want to create a new org
  if (collabInvite && !firstOrg) {
    return router.push(`/onboarding-dao?collabInvite=${collabInvite}`, undefined, {
      shallow: true,
    });
  }
  if (collabInvite && firstOrg) {
    return router.push(`/invite/collab/${collabInvite}`, undefined, { shallow: true });
  }
  if (firstPod) {
    router.push(`/pod/${firstPod.id}/home`, undefined, {
      shallow: true,
    });
  } else if (firstOrg) {
    router.push(
      `/${firstOrg?.shared ? 'collaboration' : 'organization'}/${firstOrg.username}/${
        firstOrg?.shared ? 'boards' : 'home'
      }`,
      undefined,
      {
        shallow: true,
      }
    );
  } else {
    router.push('/mission-control', undefined, {
      shallow: true,
    });
  }
};
