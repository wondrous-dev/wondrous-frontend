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

// Wonder GraphQL API

export const SET_SPACE = gql`
  mutation SetSpace(
    $orgId: ID!,
    $key: String!,
    $url: String!,
    $displayName: String!
  ) {
    updateOrg(
      orgId: $orgId,
      input: {
        integrations: {
          type: "snapshot"
          key: $key
          url: $url
          displayName: $displayName
        }
      }
    ) {
      integrations {
        key
        type
        url
        displayName
      }
    }
  }
`;

export const GET_SNAPSHOT = gql`
  query GetSnapshot ($orgId: ID!) {
    getOrgById(orgId: $orgId) {
      integrations {
        key
        type
        url
        displayName
      }
    }
  }
`

export const SET_SNAPSHOT_PROPOSAL = gql`
  mutation SetSnapshotProposal(
    $proposalId: ID!,
    $snapshotProposal: String!
  ) {
    updateTaskProposal(proposalId: $proposalId, input:{
      snapshotProposal: $snapshotProposal
    }) {
      snapshotProposal
    }
  }
`
