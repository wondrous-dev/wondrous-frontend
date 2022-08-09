import { gql } from '@apollo/client';

// Snapshot GraphQL API
export const GET_SPACE = gql`
  query Space($id: String!) {
    space(id: $id) {
      id
      name
      about
      network
      symbol
      strategies {
        name
        network
        params
      }
      admins
      members
      filters {
        minScore
        onlyMembers
      }
      plugins
    }
  }
`;
