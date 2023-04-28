import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_ORG_DISCORD_ROLES } from 'graphql/queries/discord';
import { useEffect } from 'react';

export const addSearchParamsUrl = (
  url: string,
  param: string,
  paramValue: string
) => {
  const newUrl = new URL(url);
  const searchParams = new URLSearchParams(newUrl.searchParams);
  searchParams.set(param, paramValue);
  return `${newUrl.pathname}?${searchParams.toString()}`;
};

export const generateRandomString = function (length: number) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

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
    window.history.pushState({ path: newurl }, '', newurl);
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
    window.history.pushState({ path: newurl }, '', newurl);
  }
}

export const delQuery = (asPath) => asPath.split('?')[0];

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
    return 'https://discord.com/api/oauth2/authorize?client_id=917630803314352208&redirect_uri=https%3A%2F%2Fapp.wonderverse.xyz%2Fdiscord%2Fcallback&response_type=code&scope=email%20identify';
  }
  if (import.meta.env.STAGING) {
    return 'https://discord.com/api/oauth2/authorize?client_id=917630803314352208&redirect_uri=https%3A%2F%2Fwondrous-app-git-staging-wonderverse.vercel.app%2Fdiscord%2Fcallback&response_type=code&scope=email%20identify';
  }
  return 'https://discord.com/api/oauth2/authorize?client_id=917630803314352208&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Fcallback&response_type=code&scope=email%20identify';
};

export const getTelegramBotLink = () => {
  if (import.meta.env.PRODUCTION) {
    return 'https://t.me/wonderverse_bot';
  }
  return 'https://t.me/wonderverse_staging_bot';
};

export const useDiscordRoles = ({ orgId, skip = false }) => {
  const [getOrgDiscordRoles, { data: getOrgDiscordRolesData, variables }] =
    useLazyQuery(GET_ORG_DISCORD_ROLES, {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    });

  useEffect(() => {
    if (skip || !orgId || orgId === variables?.orgId) return;

    getOrgDiscordRoles({
      variables: {
        orgId,
      },
    });
  }, [getOrgDiscordRolesData, orgId, skip]);

  const data = {
    getOrgDiscordRoles: [
      {
        guildId: '946662199189979166',
        guildInfo: {
          guildName: 'tall dao',
          __typename: 'DiscordGuildInfo',
        },
        roles: [
          {
            id: '946662199189979166',
            name: '@everyone',
            color: '#000000',
            permissions: '137411140505153',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1016560016859349024',
            name: 'Wonder-staging',
            color: '#000000',
            permissions: '8',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1088320088714780674',
            name: 'Wonder',
            color: '#000000',
            permissions: '8',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1088324826688659499',
            name: 'imo',
            color: '#000000',
            permissions: '8',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1091313794476687403',
            name: 'SurveyBot',
            color: '#000000',
            permissions: '2953235472',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1097450237968269424',
            name: 'Scoreboarder',
            color: '#000000',
            permissions: '2147485696',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1101059948722520146',
            name: 'test role',
            color: '#000000',
            permissions: '0',
            __typename: 'DiscordRoleInfo',
          },
        ],
        __typename: 'DiscordGuildRoleInfo',
      },
      {
        guildId: '917791289234325564',
        guildInfo: {
          guildName: "0xAndros's test Wonder Server",
          __typename: 'DiscordGuildInfo',
        },
        roles: [
          {
            id: '917791289234325564',
            name: '@everyone',
            color: '#000000',
            permissions: '137411140505153',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '917791488543436820',
            name: 'role1',
            color: '#000000',
            permissions: '1071698660935',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '917791575940165673',
            name: 'role 2',
            color: '#000000',
            permissions: '1071698660937',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '917791616654254121',
            name: 'engineering',
            color: '#000000',
            permissions: '1071967096401',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '950536627464335421',
            name: 'admin',
            color: '#000000',
            permissions: '1071698660937',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '987173771351842897',
            name: 'terry_role',
            color: '#e67e22',
            permissions: '1071698660929',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '989261562676137997',
            name: 'Wonder',
            color: '#000000',
            permissions: '8',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1016467771976065084',
            name: 'new role',
            color: '#000000',
            permissions: '1071698660929',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1016558528229548085',
            name: 'Wonder-staging',
            color: '#000000',
            permissions: '8',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1082575083291279432',
            name: 'SurveyBot',
            color: '#000000',
            permissions: '139855318097',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1082752929393561651',
            name: 'Forms',
            color: '#000000',
            permissions: '536873984',
            __typename: 'DiscordRoleInfo',
          },
          {
            id: '1094009238528991242',
            name: 'Mushroom',
            color: '#000000',
            permissions: '379912',
            __typename: 'DiscordRoleInfo',
          },
        ],
        __typename: 'DiscordGuildRoleInfo',
      },
    ],
  };
  return data?.getOrgDiscordRoles;
};
