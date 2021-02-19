import { gql } from '@apollo/client'

import { PublicReviewFragment } from '../fragments/review'

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput) {
    createReview(input: $input) {
      success
    }
  }
`
