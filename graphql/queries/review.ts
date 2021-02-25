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
  query GetReviewsFromUser($userId: ID, $limit: Int, $offset: Int) {
    getReviewsFromUser(userId: $userId, limit: $limit, offset: $offset) {
      ...PublicReview
    }
  }
  ${PublicReviewFragment}
`

export const GET_REVIEW_BY_ID = gql`
  query GetReviewById($reviewId: ID!) {
    getReviewById(reviewId: $reviewId) {
      ...PublicReview
    }
  }
  ${PublicReviewFragment}
`

export const GET_REVIEW_COMMENTS = gql`
  query GetReviewComments($reviewId: ID!) {
    getReviewComments(reviewId: $reviewId) {
      createdAt
      commenterId
      weeklyReviewId
      content
      commenterProfilePicture
      commenterFirstName
      commenterLastName
      commenterUsername
    }
  }
`

export const GET_REVIEW_FROM_REVIEW_COMMENT = gql`
  query GetReviewFromReviewComment($commentId: ID!) {
    getReviewFromReviewComment(commentId: $commentId) {
      ...PublicReview
    }
  }
  ${PublicReviewFragment}
`