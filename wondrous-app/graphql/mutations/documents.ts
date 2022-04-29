import { gql } from '@apollo/client';
import { DocFragment } from 'graphql/fragments/documents';

export const CREATE_ORG_DOCUMENT = gql`
  mutation createOrgDocument($input: DocumentInput) {
    createOrgDocument(input: $input) {
      ...DocFragment
    }
  }
  ${DocFragment}
`;
