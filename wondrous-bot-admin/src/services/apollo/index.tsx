import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { getAuthHeader, getWaitlistAuthHeader } from "components/Auth/withAuthHeader";
import offsetLimitPaginationInput from "utils/offsetLimitPaginationInput";

// Staging is http://34.135.9.199/graphql
const graphqlUri = !import.meta.env.VITE_STAGING
  ? import.meta.env.VITE_GRAPHQL_SERVER_URL
  : "https://apistaging.wonderapp.co/graphql";

const httpLink = new HttpLink({
  uri: graphqlUri,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept, Authorization, X-Request-With",
  },
  // credentials: "include",
});

const getAuth = () => {
  try {
    const token = getAuthHeader();
    return token ? `Bearer ${token}` : "";
  } catch (error) {
    return null;
  }
};

const getWaitlistAuth = () => {
  try {
    const token = getWaitlistAuthHeader();
    return token ? `Bearer ${token}` : "";
  } catch (error) {
    return null;
  }
};

const authLink = setContext((_, { headers }) => {
  const auth = getAuth() || getWaitlistAuth();

  return {
    headers: {
      Authorization: auth,
      ...headers,
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        whoami(existingData, { args, toReference }) {
          return existingData || toReference({ __typename: "User", ...args });
        },
        users(existingData, { args, toReference }) {
          return existingData || toReference({ __typename: "User", ...args });
        },
        getQuestsForOrg: {
          keyArgs: ["input", ["orgId", "statuses", "status"]],
          merge: offsetLimitPaginationInput,
        },
        getUnpaidCmtyPaymentsForQuest: {
          keyArgs: ["input", ["questId"]],
          merge: offsetLimitPaginationInput,
        },
        getProcessingCmtyPaymentsForQuest: {
          keyArgs: ["input", ["questId"]],
          merge: offsetLimitPaginationInput,
        },

        getPaidCmtyPaymentsForQuest: {
          keyArgs: ["input", ["questId"]],
          merge: offsetLimitPaginationInput,
        },
        getUnpaidCmtyPaymentsForOrg: {
          keyArgs: ["input", ["orgId"]],
          merge: offsetLimitPaginationInput,
        },
        getProcessingCmtyPaymentsForOrg: {
          keyArgs: ["input", ["orgId"]],
          merge: offsetLimitPaginationInput,
        },
        getCompletedCmtyPaymentsForOrg: {
          keyArgs: ["input", ["orgId"]],
          merge: offsetLimitPaginationInput,
        },
        getQuestsAnalyticsLeaderboard: offsetLimitPagination(),

        getStoreItemsForOrg: {
          keyArgs: ["input", ["orgId"]],
          merge: offsetLimitPaginationInput,
        },
        getCmtyUsersLeaderboard: offsetLimitPagination(),
        getQuestSubmissions: offsetLimitPagination(["questId"]),
        getCmtyUsersForOrg: {
          keyArgs: ["input", ["orgId"]],
          merge: offsetLimitPaginationInput,
        },
        getUserQuestSubmissions: offsetLimitPagination(["cmtyUserId", "orgId", "questId"]),
        getStoreItemPurchases: offsetLimitPagination(["cmtyUserId", "orgId", "storeItemId"]),
        getCmtyUserBadges: offsetLimitPagination(["cmtyUserId", "orgId"]),
        getCmtyUserPurchases: offsetLimitPagination(["cmtyUserId", "orgId"]),
      },
    },
  },
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
