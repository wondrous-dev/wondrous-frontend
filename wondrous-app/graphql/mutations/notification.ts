import { gql } from '@apollo/client'

export const MARK_NOTIFICATIONS_READ = gql`
    mutation markNotificationAsViewed($notificationId: ID!) {
        markNotificationAsViewed (notificationId: $notificationId) {
            success
        }
    }
`

export const MARK_ALL_NOTIFICATIONS_READ = gql`
    mutation markAllNotificationAsViewed {
        markAllNotificationAsViewed {
            success
        }
    }
`