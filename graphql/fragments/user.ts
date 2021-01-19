import { gql } from '@apollo/client'

export const PublicUserFragment = gql`
  fragment PublicUser on User {
    id
    email
    profilePicture
    bio
    username
    firstName
    lastName
    privacyLevel
    reactedFeedComments
    usageProgress {
      projectCreated
      projectCategorySelected
      signupCompleted
      goalCreated
      taskCreated
    }
  }
`