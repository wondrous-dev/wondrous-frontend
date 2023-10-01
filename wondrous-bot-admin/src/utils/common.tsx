import { PAYMENT_OPTIONS } from "components/CreateTemplate/RewardUtils";
import moment from "moment";
import { QUEST_CONDITION_TYPES } from "./constants";
import { CHAIN_TO_EXPLORER_URL } from "./web3Constants";

const DEFAULT_TWITTER_SCOPE =
  "users.read%20tweet.read%20follows.read%20follows.write%20like.read%20like.write%20offline.access";
export const TWITTER_CHALLENGE_CODE = "0ioze5m20493ny2"; // not that important but should fetch from server'

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
  const { type, name, exclusiveQuest } = condition;
  let text = "";
  if (type === QUEST_CONDITION_TYPES.DISCORD_ROLE) {
    text = `Discord Role: ${name || "None"}`;
  }
  if (type === QUEST_CONDITION_TYPES.QUEST) {
    text = `${exclusiveQuest ? "Exclude" : "Quest"}: ${name || "None"}`;
  }
  return text;
};

export const getBaseUrl = () => {
  if (import.meta.env.VITE_PRODUCTION) {
    return "https://communities.wonderverse.xyz";
  }
  if (import.meta.env.VITE_STAGING) {
    return "https://staging-communities.wonderverse.xyz";
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

export const constructExplorerRedirectUrl = (chain, txHash) => `${CHAIN_TO_EXPLORER_URL[chain]}/tx/${txHash}`;

export const constructRewards = ({ rewards }) => {
  return rewards?.map((reward) => {
    if (reward.type === "points") {
      return reward;
    }
    if (reward.type === PAYMENT_OPTIONS.TOKEN) {
      return {
        type: reward?.paymentMethod?.name,
        value: reward?.amount,
      };
    }
    if (reward.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
      return {
        type: "Discord Role",
        value: reward?.discordRewardData?.discordRoleName || null,
      };
    }
    if (reward.type === PAYMENT_OPTIONS.POAP) {
      return {
        type: "POAP",
        value: reward?.poapRewardData?.name || null,
      };
    }
  });
};

export const filterToDates = (value) => {
  if (value === "last_week") {
    return {
      startDate: moment().subtract(7, "days").utcOffset(0).startOf("day").toISOString(),
      endDate: moment().utcOffset(0).endOf("day").toISOString(),
    };
  }
  if (value === "last_month") {
    return {
      startDate: moment().subtract(1, "months").utcOffset(0).startOf("day").toISOString(),
      endDate: moment().utcOffset(0).endOf("day").toISOString(),
    };
  }
  if (value === "ytd") {
    return {
      startDate: moment().startOf("year").utcOffset(0).startOf("day").toISOString(),
      endDate: moment().utcOffset(0).endOf("day").toISOString(),
    };
  }
  return {
    startDate: moment().subtract(7, "days").utcOffset(0).startOf("day").toISOString(),
    endDate: moment().utcOffset(0).endOf("day").toISOString(),
  };
};

export const getYoutubeChannelId = (url) => {
  // Extract channel ID from the second format: https://www.youtube.com/channel/channelId
  const regex1 = /^https:\/\/www\.youtube\.com\/channel\/([^\?]+)/;
  const match1 = url.match(regex1);
  if (match1 && match1.length >= 2) {
    return { channelId: match1[1] };
  }
  // Extract channel ID from the first format: https://www.youtube.com/@channelName

  const regex2 = /^https:\/\/www\.youtube\.com\/@([^\?]+)/;
  const match2 = url.match(regex2);
  if (match2 && match2.length >= 2) {
    return { channelHandle: match2[1] };
  }
};

export const getWeb3ConnectUrl = ({ telegramUserId }) => {
  const baseUrl = getBaseUrl();
  const link = `${baseUrl}/wallet/connect?telegramUserId=${telegramUserId}`;
  return link;
};

export const toCent = (amount) => {
  const str = amount.toString();
  const int = str.split(".");

  return Number(
    Number(amount)
      .toFixed(2)
      .replace(".", "")
      .padEnd(int.length === 1 ? 3 : 4, "0")
  );
};

export const getTwitterCallbackUrl = () => {
  return getBaseUrl() + "%2Ftwitter%2Fcallback";
};

export const buildTwitterAuthUrl = (state?) => {
  const CLIENT_ID = "alotNFdURk5Qd0FoRGpKeUpHMDE6MTpjaQ";
  if (!state) {
    state = "state";
  }

  // fetch URL from server
  const redirectUri = getTwitterCallbackUrl();
  return `https://twitter.com/i/oauth2/authorize?client_id=${CLIENT_ID}&scope=${DEFAULT_TWITTER_SCOPE}&response_type=code&redirect_uri=${redirectUri}&state=${state}&code_challenge=${TWITTER_CHALLENGE_CODE}&code_challenge_method=plain`;
};
