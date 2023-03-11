import { gql } from '@apollo/client';

export const GET_GPT_ENTITY_DESCRIPTION = gql`
  query getGptEntityDescription($orgId: ID, $podId: ID) {
    getGptEntityDescription(orgId: $orgId, podId: $podId) {
      description
    }
  }
`;
