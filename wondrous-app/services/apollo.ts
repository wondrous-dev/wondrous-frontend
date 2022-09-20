import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { getAuthHeader, getWaitlistAuthHeader } from 'components/Auth/withAuth';
import offsetLimitPaginationInput from 'utils/offsetLimitPaginationInput';

// Staging is http://34.135.9.199/graphql
const graphqlUri = !process.env.NEXT_PUBLIC_STAGING
  ? process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL
  : 'https://apistaging.wonderapp.co/graphql';

const httpLink = new HttpLink({
  uri: graphqlUri,
  credentials: 'include',
});

const getAuth = () => {
  const token = getAuthHeader();
  return token ? `Bearer ${token}` : '';
};

const getWaitlistAuth = () => {
  const token = getWaitlistAuthHeader();
  return token ? `Bearer ${token}` : '';
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
          return existingData || toReference({ __typename: 'User', ...args });
        },
        users(existingData, { args, toReference }) {
          return existingData || toReference({ __typename: 'User', ...args });
        },
        waitlistUsers(existingData, { args, toReference }) {
          return existingData || toReference({ __typename: 'WaitlistUser', ...args });
        },
        getOrgFeed: offsetLimitPagination(), // NOTE: https://www.apollographql.com/docs/react/pagination/core-api/#non-paginated-read-functions
        getPodFeed: offsetLimitPagination(),
        getOrgMembershipRequest: offsetLimitPagination(['orgId']),
        getPodMembershipRequest: offsetLimitPagination(['podId']),
        getTasksForMilestone: offsetLimitPagination(['milestoneId', 'status']),
        getProposalsUserCanReview: {
          keyArgs: ['input', ['orgId', 'podIds', 'date']],
          merge: offsetLimitPaginationInput,
        },
        getSubmissionsUserCanReview: {
          keyArgs: ['input', ['orgId', 'podIds', 'date']],
          merge: offsetLimitPaginationInput,
        },
        getSubtasksForTask: offsetLimitPagination(['taskId', 'status']),
        getUserTaskBoardProposals: {
          keyArgs: ['input', ['orgId', 'podIds', 'date', 'statuses']],
          merge: offsetLimitPaginationInput,
        },
        getJoinOrgRequests: {
          keyArgs: ['input', ['orgId', 'podIds', 'date', 'statuses']],
          merge: (existing, incoming, { args }) => {
            const merged = existing ? existing.slice(0) : [];
            if (incoming) {
              if (args) {
                // Assume an offset of 0 if args.offset omitted.
                const { offset = 0 } = args;
                for (let i = 0; i < incoming.length; ++i) {
                  merged[offset + i] = incoming[i];
                }
              } else {
                // It's unusual (probably a mistake) for a paginated field not
                // to receive any arguments, so you might prefer to throw an
                // exception here, instead of recovering by appending incoming
                // onto the existing array.
                merged.push.apply(merged, incoming);
              }
            }
            return merged;
          },
        },
        getUserTaskBoardSubmissions: {
          keyArgs: ['input', ['status']],
          merge: offsetLimitPaginationInput,
        },
        getJoinPodRequests: {
          keyArgs: ['input', ['orgId', 'podIds', 'date', 'statuses']],
          merge: (existing, incoming, { args }) => {
            const merged = existing ? existing.slice(0) : [];
            if (incoming) {
              if (args) {
                // Assume an offset of 0 if args.offset omitted.
                const { offset = 0 } = args;
                for (let i = 0; i < incoming.length; ++i) {
                  merged[offset + i] = incoming[i];
                }
              } else {
                // It's unusual (probably a mistake) for a paginated field not
                // to receive any arguments, so you might prefer to throw an
                // exception here, instead of recovering by appending incoming
                // onto the existing array.
                merged.push.apply(merged, incoming);
              }
            }
            return merged;
          },
        },
        getNotifications: offsetLimitPagination(),
        getUserFeed: offsetLimitPagination(),

        getUserTaskBoardTasks: {
          keyArgs: ['input', ['orgId', 'podIds', 'date', 'statuses']],
          merge: offsetLimitPaginationInput,
        },
        getOrgUsers: offsetLimitPagination(['orgId', 'searchString', 'roleIds', 'limit', 'offset']),
      },
    },
  },
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
