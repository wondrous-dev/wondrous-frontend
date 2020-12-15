import { gql } from '@apollo/client'

export const GET_PRESIGNED_IMAGE_URL = gql`
  query GetPresignedImageUrl($filename: String!) {
    getPresignedImageUrl(filename: $filename) {
      url
    }
  }
`
