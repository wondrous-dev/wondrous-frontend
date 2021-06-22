import { gql } from '@apollo/client'

export const UserListFragment = gql`
  fragment UserList on User {
    id
    profilePicture
    thumbnailPicture
    firstName
    lastName
    username
    bio
  }
`

export const UserSignupRecommendationFragment = gql`
  fragment PublicUserSignupRecommendation on UserSignupRecommendation {
    id
    username
    bio
    firstName
    lastName
    profilePicture
    thumbnailPicture
    groupName
  }
`

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
    blockedUsers
    blockedByUsers
  }
  ${PublicUserFragment}
`

export const LoggedinUserWithTokenFragment = gql`
  fragment LoggedinUserWithToken on User {
    ...LoggedinUser
    notificationToken {
      token
    }
  }
  ${LoggedinUserFragment}
`