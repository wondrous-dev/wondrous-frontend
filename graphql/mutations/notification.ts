import { gql } from '@apollo/client'

import { NotificationTokenFragment } from '../fragments/notification'

export const CREATE_NOTIFICATION_TOKEN = gql`
  mutation CreateNotificationToken($token: String!) {
    createNotificationToken(token: $token) {
      success
    }
  }
`

export const MARK_NOTIFICATION_AS_VIEWED = gql`
  mutation MarkNotificationAsViewed($notificationId: ID!) {
    markNotificationAsViewed(notificationId: $notificationId) {
      success
    }
  }
`