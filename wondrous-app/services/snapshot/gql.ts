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

export const GET_SNAPSHOT_PROPOSALS = gql`
  query Proposals($spaceName: String, $state: String, $skip: Int) {
    proposals(
      first: 10
      skip: $skip
      where: { space_in: [$spaceName], state: $state }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      scores
      scores_by_strategy
      scores_total
      scores_updated
    }
  }
`;
