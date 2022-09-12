export const handleUserOnboardingRedirect = (user, router) => {
  if (user?.signupCompleted) {
    router.push('/mission-control', undefined, {
      shallow: true,
    });
  } else if (user?.profilePictureUrl) {
    router.push('/mission-control', undefined, {
      shallow: true,
    });
  } else if (user?.username) {
    router.push('/onboarding/build-profile', undefined, {
      shallow: true,
    });
  } else if (user?.id) {
    router.push('/onboarding/welcome', undefined, {
      shallow: true,
    });
  }
};
