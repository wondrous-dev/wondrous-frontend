export function shallowEqual(objA, objB) {
  if (!objA || !objB) {
    return objA === objB;
  }

  return !Object.keys({ ...objA, ...objB }).some(
    (key) => objA[key] !== objB[key]
  );
}

export const handleUserOnboardingRedirect = (
  userOrError,
  navigate,
  params,
) => {
  if (userOrError === 'Incorrect Email and Password combination') return;

  return navigate('/');
};
