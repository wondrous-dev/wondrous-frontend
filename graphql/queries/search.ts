import { gql } from '@apollo/client'

export const GET_USERS_AND_PROJECTS = gql`
  query GetUsersAndProjects($searchString: String) {
    getUsersAndProjects(searchString: $searchString) {
      projects {
        id
        profilePicture
        name
        description
      }
      users {
        id
        firstName
        lastName
        username
        profilePicture
      }
    }
  }
`
