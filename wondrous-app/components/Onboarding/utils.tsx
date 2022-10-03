export const handleUserOnboardingRedirect = (user, router) => {
  const { collabInvite } = router.query;

  const defaultRoute = collabInvite ? `/invite/collab/${collabInvite}` : '/mission-control';

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
