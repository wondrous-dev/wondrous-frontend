import { gql } from '@apollo/client'

export const PodFragment = gql`
  fragment PodFragment on Pod {
    id
    name
    username
    description
    privacyLevel
    headerPicture
    profilePicture
    thumbnailPicture
    createdBy
    createdAt
    orgId
    tags
    contributorCount
    tasksCompletedCount
    links {
      url
      name
      type
    }
  }
`
