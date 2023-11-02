import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ORG_DISCORD_ROLES } from "graphql/queries/discord";
import { useEffect } from "react";
import { getBaseUrl } from "utils/common";

export const addSearchParamsUrl = (url: string, param: string, paramValue: string) => {
  const newUrl = new URL(url);
  const searchParams = new URLSearchParams(newUrl.searchParams);
  searchParams.set(param, paramValue);
  return `${newUrl.pathname}?${searchParams.toString()}`;
};

export const generateRandomString = function (length: number) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export function createSpacingUnit(multiplier = 1) {
  return function spacingUnit({ theme }) {
    return theme.spacing(multiplier);
  };
}

/**
 * @deprecated
 * @param key
 * @param value
 */
export function insertUrlParam(key, value) {
  if (history.pushState) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    const newurl = `${window.location.protocol}//${window.location.host}${
      window.location.pathname
    }?${searchParams.toString()}`;
    window.history.pushState({ path: newurl }, "", newurl);
  }
}

/**
 * @deprecated
 * @param key
 */
export function removeUrlParam(key) {
  if (history.pushState) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(key);
    const newurl = `${window.location.protocol}//${window.location.host}${
      window.location.pathname
    }?${searchParams.toString()}`;
    window.history.pushState({ path: newurl }, "", newurl);
  }
}

export const delQuery = (asPath) => asPath.split("?")[0];

export const dedupeColumns = (columns) => {
  const taskMap = {};
  if (!columns) return [];
  const newColumns = columns.map((column) => {
    column.tasks = column?.tasks?.filter((task) => {
      if (!(task?.id in taskMap)) {
        taskMap[task?.id] = true;
        return true;
      }
      return false;
    });
    return column;
  });
  return newColumns;
};

export const getDiscordUrl = (callbackUrl = "/discord/callback", params = "") => {
  let redirectUri = encodeURIComponent(`${getBaseUrl()}${callbackUrl}`);
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20identify${params}`;
};

export const getTelegramBotLink = (state = '?startgroup=true&admin=post_messages') => {
  let botName = "wonderverse_bot";
  let link = `https://t.me/${botName}${state}`;
  if (import.meta.env.VITE_PRODUCTION) {
    return link;
  }
  if (import.meta.env.VITE_STAGING) {
    botName = "wonderverse_staging_bot";
    link = `https://t.me/${botName}${state}`;
    return link;
  }
  return `https://t.me/communities_test_bot${state}`;
};

export const useDiscordRoles = ({ orgId, skip = false }) => {
  const [getCmtyOrgDiscordRoles, { data: getCmtyOrgDiscordRolesData, variables }] = useLazyQuery(
    GET_ORG_DISCORD_ROLES,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  useEffect(() => {
    if (skip || !orgId || orgId === variables?.orgId) return;

    getCmtyOrgDiscordRoles({
      variables: {
        orgId,
      },
    });
  }, [getCmtyOrgDiscordRolesData, orgId, skip]);
  return getCmtyOrgDiscordRolesData?.getCmtyOrgDiscordRoles || [];
};
