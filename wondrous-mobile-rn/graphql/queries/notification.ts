import { gql } from '@apollo/client'

import { NotificationTokenFragment } from '../fragments/notification'

export const GET_ACTIVE_NOTIFICATION_TOKEN = gql`
  query GetActiveNotificationToken($userId: String!) {
    getActiveNotificationToken {
      ...NotificationTokenFragment
    }
  }
  ${NotificationTokenFragment}
`

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($limit: Int, $offset: Int) {
    getNotifications(limit: $limit, offset: $offset) {
      id
      timestamp
      userId
      actorFirstName
      actorId
      actorLastName
      actorProfilePicture
      actorThumbnail
      actorUsername
      objectId
      objectType
      objectName
      type
      viewedAt
      message
      additionalData {
        message
        currentStreakCount
        contentPreview
      }
    }
  }
`

export const GET_UNREAD_NOTIFICATION_COUNT = gql`
  query {
    getUnreadNotificationCount {
      count
    }
  }
`