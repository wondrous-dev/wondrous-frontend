import { QUEST_CONDITION_TYPES } from "./constants";

export function shallowEqual(objA, objB) {
  if (!objA || !objB) {
    return objA === objB;
  }

  return !Object.keys({ ...objA, ...objB })?.some((key) => objA[key] !== objB[key]);
}

export const handleUserOnboardingRedirect = (userOrError, navigate, params, defaultRoute = "/onboarding") => {
  if (userOrError === "Incorrect Email and Password combination") return;
  if (params.token) {
    return navigate(`/invite/${params.token}`);
  }
  return navigate(defaultRoute);
};

export const getTextForCondition = (condition) => {
  const { type, name } = condition;
  let text = "";
  if (type === QUEST_CONDITION_TYPES.DISCORD_ROLE) {
    text = `Discord Role: ${name || "None"}`;
  }
  if (type === QUEST_CONDITION_TYPES.QUEST) {
    text = `Quest: ${name || "None"}`;
  }
  return text;
};

export const getBaseUrl = () => {
  if (import.meta.env.VITE_PRODUCTION) {
    return "https://communities.wonderverse.xyz";
  }
  if (import.meta.env.VITE_STAGING) {
    return "https://wondrous-bot-admin-git-staging-wonderverse.vercel.app";
  }
  return "http://localhost:3000";
};

export function getPathArray(path) {
  return path.split(/[[\].]+/).filter(Boolean);
}

export const matchRoute = (pathname, options) => {
  return !!options.find((route) => {
    // Replace potential URL parameters (e.g., ":id") with wildcard for RegExp match
    const pattern = new RegExp(`^${route.replace(/:\w+/g, "[\\w-]+")}$`, "gi");
    return pattern.test(pathname);
  });
};

export const toggleHtmlOverflow = () => {
  const htmlTagElements = document.getElementsByTagName("html");
  const { style } = htmlTagElements.item(0);
  style.overflow = style.overflow ? "" : "hidden";
};

export const snakeToCamel = (str) => {
  if (str === null || str === undefined) return str;
  return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""));
};

export const camelToSnake = (str) => {
  if (str === null || str === undefined) return str;
  return str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};
