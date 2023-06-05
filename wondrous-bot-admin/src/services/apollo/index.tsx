import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAuthHeader, getWaitlistAuthHeader } from "components/Auth/withAuthHeader";
import offsetLimitPaginationInput from "utils/offsetLimitPaginationInput";

// Staging is http://34.135.9.199/graphql
const graphqlUri = !import.meta.env.VITE_STAGING
  ? import.meta.env.VITE_GRAPHQL_SERVER_URL
  : "https://apistaging.wonderapp.co/graphql";

const httpLink = new HttpLink({
  uri: graphqlUri,
  credentials: "include",
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
      ...headers,
      Authorization: auth,
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
      },
    },
  },
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
