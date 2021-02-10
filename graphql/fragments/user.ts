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
    links {
      website
      linkedin
      github
      twitter
      instagram
    }
    usageProgress {
      projectCreated
      projectCategorySelected
      signupCompleted
      goalCreated
      taskCreated
      askCreated
    }
    streak {
      currentStreak
      lastActivityAt
      lastActiveTimezone
    }
  }
`

export const LoggedinUserFragment = gql`
  fragment LoggedinUser on User {
    ...PublicUser
    reactedFeedComments
    usersFollowing
    projectsFollowing
  }
  ${PublicUserFragment}
`
