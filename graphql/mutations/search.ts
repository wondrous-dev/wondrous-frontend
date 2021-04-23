import { gql } from '@apollo/client'

export const CLICK_USER_SEARCH = gql`
  mutation ClickUserSearch($searchedUserId: ID!, $username: String, $firstName: String, $lastName: String) {
    clickUserSearch(searchedUserId: $searchedUserId, username: $username, firstName: $firstName, lastName: $lastName) {
      success
    }
  }
`
export const CLICK_PROJECT_SEARCH = gql`
  mutation ClickProjectSearch($searchedProjectId: ID!, $projectName: String) {
    clickProjectSearch(searchedProjectId: $searchedProjectId, projectName: $projectName) {
      success
    }
  }
`
