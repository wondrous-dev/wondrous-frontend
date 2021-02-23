import { gql } from '@apollo/client'

import { PublicReviewFragment } from '../fragments/review'

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput) {
    createReview(input: $input) {
      success
    }
  }
`

export const CREATE_REVIEW_COMMENT = gql`
  mutation CreateReviewComment($input: ReviewCommentInput) {
    createReviewComment(input: $input) {
      content
      weeklyReviewId
      commenterId
      commenterProfilePicture
      commenterFirstName
      commenterLastName
      commenterUsername
    }
  }
`
