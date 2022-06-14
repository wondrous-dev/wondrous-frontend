export const handleUserOnboardingRedirect = (user, router) => {
    if (user?.signupCompleted) {
      router.push('/dashboard', undefined, {
        shallow: true,
      });
    } else if (user?.profilePictureUrl) {
      router.push('/dashboard', undefined, {
        shallow: true,
      });
    } else if (user?.username) {
      router.push('/onboarding/BuildProfile', undefined, {
        shallow: true,
      });
    } else if (user?.id) {
      router.push('/onboarding/welcome', undefined, {
        shallow: true,
      });
    }
  };
  