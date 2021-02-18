import { gql } from '@apollo/client'

import { PublicReviewFragment } from '../fragments/review'

export const GET_REVIEW_STATS = gql`
  query {
    getReviewStats {
      tasksCompleted
      goalsCompleted
      differenceInAverageComplete
    }
  }
`

export const GET_USER_REVIEWS = gql`
  query GetReviewsFromUser($userId: ID) {
    getReviewsFromUser(userId: $userId) {
      ...PublicReview
    }
  }
  ${PublicReviewFragment}
`
