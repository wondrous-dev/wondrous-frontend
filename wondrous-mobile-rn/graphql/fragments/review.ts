import { gql } from '@apollo/client'

export const PublicReviewFragment = gql`
  fragment PublicReview on Review {
    id
    createdAt
    userId
    reviewScore
    description
    weekStartDate
  }
`
