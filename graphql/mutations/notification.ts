import { gql } from '@apollo/client'

import { NotificationTokenFragment } from '../fragments/notification'

export const CREATE_NOTIFICATION_TOKEN = gql`
  mutation CreateNotificationToken($userId: String!, $token: String!) {
    createNotificationToken(userId: $userId, token: $token) {
      ...NotificationTokenFragment
    }
  }
  ${NotificationTokenFragment}
`
