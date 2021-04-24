import { gql } from '@apollo/client'

import { NotificationTokenFragment } from '../fragments/notification'

export const CREATE_NOTIFICATION_TOKEN = gql`
  mutation CreateNotificationToken($token: String!) {
    createNotificationToken(token: $token) {
      success
    }
  }
`

export const UPDATE_NOTIFICATION_TOKEN = gql`
  mutation UpdateNotificationToken($token: String!) {
    updateNotificationToken(token: $token) {
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

export const MARK_ALL_NOTIFICATIONS_AS_VIEWED = gql`
  mutation {
    markAllNotificationAsViewed {
      success
    }
  }
`