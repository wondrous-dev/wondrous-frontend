import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ORG_DISCORD_ROLES } from "graphql/queries/discord";
import { useEffect } from "react";

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

export const getDiscordUrl = () => {
  if (import.meta.env.PRODUCTION) {
    return "https://discord.com/api/oauth2/authorize?client_id=917630803314352208&redirect_uri=https%3A%2F%2Fapp.wonderverse.xyz%2Fdiscord%2Fcallback&response_type=code&scope=email%20identify";
  }
  if (import.meta.env.STAGING) {
    return "https://discord.com/api/oauth2/authorize?client_id=917630803314352208&redirect_uri=https%3A%2F%2Fwondrous-app-git-staging-wonderverse.vercel.app%2Fdiscord%2Fcallback&response_type=code&scope=email%20identify";
  }
  return "https://discord.com/api/oauth2/authorize?client_id=917630803314352208&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Fcallback&response_type=code&scope=email%20identify";
};

export const getTelegramBotLink = () => {
  if (import.meta.env.PRODUCTION) {
    return "https://t.me/wonderverse_bot";
  }
  return "https://t.me/wonderverse_staging_bot";
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