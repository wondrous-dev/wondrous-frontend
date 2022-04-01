import { gql } from '@apollo/client';

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

export const SET_SPACE = gql`
  mutation SetSpace(
    $orgId: ID!,
    $url: String!,
    $displayName: String
  ) {
    updateOrg(
      orgId: $orgId,
      input: {
        integrations: {
          displayName: $displayName
          url: $url
          type: "snapshot"
        }
      }
    ) {
      integrations {
        type
        displayName
        url
      }
    }
  }
`
