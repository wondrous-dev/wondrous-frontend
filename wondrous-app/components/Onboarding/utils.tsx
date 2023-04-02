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
  if (user?.signupCompleted || inviteToken) {
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
