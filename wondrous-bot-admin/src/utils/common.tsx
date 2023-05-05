import { QUEST_CONDITION_TYPES } from "./constants";

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

  return navigate('/onboarding');
};


export const getTextForCondition = (condition) => {
  const { type, name } = condition;
  let text = '';
  if (type === QUEST_CONDITION_TYPES.DISCORD_ROLE) {
    text = `Discord Role: ${name || 'None'}`;
  }
  if (type === QUEST_CONDITION_TYPES.QUEST) {
    text = `Quest: ${name || 'None'}`;
  }
  return text;
};
