import { gql } from '@apollo/client'
import { NotificationFragment } from '../fragments/notification'

export const GET_NOTIFICATIONS = gql`
  query getNotifications($limit: Int, $offset: Int) {
    getNotifications(limit: $limit, offset: $offset) {
      ...NotificationFragment
    }
  }
  ${NotificationFragment}
`
