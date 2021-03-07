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
    thumbnailPicture
    links {
      website
      linkedin
      github
      twitter
      instagram
      __typename
    }
    usageProgress {
      projectCreated
      projectCategorySelected
      signupCompleted
      goalCreated
      taskCreated
      askCreated
      taskCompleted
      goalCompleted
      __typename @skip(if: true)
    }
    __typename
  }
`

export const LoggedinUserFragment = gql`
  fragment LoggedinUser on User {
    ...PublicUser
    reactedFeedItems
    usersFollowing
    projectsFollowing
  }
  ${PublicUserFragment}
`
