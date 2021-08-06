import { gql } from '@apollo/client'

export const NotificationTokenFragment = gql`
  fragment NotificationTokenFragment on NotificationToken {
    userId
    token
    active
  }
`