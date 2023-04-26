import { gql } from '@apollo/client';

export const GET_LOGGED_IN_USER_FULL_ACCESS_ORGS = gql`
  query getLoggedInUserFullAccessOrgs {
    getLoggedInUserFullAccessOrgs {
      id
      username
      name
      profilePicture
      thumbnailPicture
      privacyLevel
      shared
    }
  }
`;
