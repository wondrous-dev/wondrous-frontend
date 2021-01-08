import { gql } from '@apollo/client'

import { NotificationTokenFragment } from '../fragments/notification'

export const CREATE_NOTIFICATION_TOKEN = gql`
  mutation CreateNotificationToken($token: String!) {
    createNotificationToken(token: $token) {
      ...NotificationTokenFragment
    }
  }
  ${NotificationTokenFragment}
`
