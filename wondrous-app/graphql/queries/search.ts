import { gql } from '@apollo/client';

export const SEARCH_GLOBAL = gql`
  query globalSearch($searchString: String!) {
    globalSearch(searchString: $searchString) {
      users {
        id
        firstName
        lastName
        username
        profilePicture
      }
      orgs {
        id
        name
        username
        profilePicture
        thumbnailPicture
      }
      pods {
        id
        name
        username
        profilePicture
        thumbnailPicture
      }
    }
  }
`;
