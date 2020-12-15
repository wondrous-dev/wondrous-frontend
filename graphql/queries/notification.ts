import { gql } from '@apollo/client'

import { NotificationTokenFragment } from '../fragments/notification'

export const GET_ACTIVE_NOTIFICATION_TOKEN = gql`
  query GetActiveNotificationToken($userId: String!) {
    getActiveNotificationToken(userId: $userId) {
      ...NotificationTokenFragment
    }
  }
  ${NotificationTokenFragment}
`
