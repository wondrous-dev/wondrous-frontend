import { ApolloClient, InMemoryCache, HttpLink, split, defaultDataIdFromObject } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import Constants from 'expo-constants'

import { getAuthHeader } from '../session'

const httpUri = Constants.manifest.extra.httpUri
const wsBaseUrl = httpUri
const wsUri = wsBaseUrl.replace(/^https?/, process.env.REACT_APP_ENV === 'dev' ? 'ws' : 'wss')

const httpLink = new HttpLink({
  uri: httpUri,
  credentials: 'include'
})

const getAuth = async () => {
  const token = await getAuthHeader()
  return token ? `Bearer ${token}` : ''
}

const wsClient = new SubscriptionClient(
  wsUri,
  {
    connectionParams: async () => {
      const authorization = await getAuth()
      return authorization ? { authorization, headers: { authorization } } : {}
    }
  }
)
const wsLink = new WebSocketLink(wsClient)

const authLink = setContext(async (_, { headers }) => {
  const auth = await getAuth()
  return {
    headers: {
      ...headers,
      Authorization: auth
    }
  }
})


const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        whoami(existingData, { args, toReference }) {
          return existingData || toReference({ __typename: 'User', ...args })
        },
        users(existingData, { args, toReference }) {
          return existingData || toReference({ __typename: 'User', ...args })
        },
        userInvitation(existingData, { args, toReference }) {
          return existingData || toReference({ __typename: 'MyUserInvite', ...args})
        }
      }
    }
  }
})

export default new ApolloClient({
  link: authLink.concat(link),
  cache
})
