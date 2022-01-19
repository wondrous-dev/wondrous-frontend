import { gql } from '@apollo/client'
import { NotificationFragment } from '../fragments/notification'

export const GET_NOTIFICATIONS = gql`
  query getNotifications($limit: Int, $offset: Int) {
    getNotifications(limit: $limit, offset: $offset) {
      id
      timestamp
      userId
      viewedAt
      actorId
      verb
      type
      objectType
      objectName
      message
      actorFirstName
      actorLastName
      actorUsername
      actorProfilePicture
      actorThumbnail
    }
  }
`
