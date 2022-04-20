import { gql } from '@apollo/client';
import { DocFragment } from 'graphql/fragments/documents';

export const GET_ORG_DOCS = gql`
  query getOrgDocs($orgId: ID!) {
    getOrgDocuments(orgId: $orgId) {
      ...DocFragment
    }
  }
  ${DocFragment}
`;
