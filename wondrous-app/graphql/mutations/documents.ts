import { gql } from '@apollo/client';
import { DocFragment, DocCategoryFragment } from 'graphql/fragments/documents';

export const CREATE_ORG_DOCUMENT = gql`
  mutation createOrgDocument($input: DocumentInput) {
    createOrgDocument(input: $input) {
      ...DocFragment
    }
  }
  ${DocFragment}
`;

export const UPDATE_ORG_DOCUMENT = gql`
  mutation updateDocument($documentId: ID!, $input: DocumentInput) {
    updateDocument(documentId: $documentId, input: $input) {
      ...DocFragment
    }
  }
  ${DocFragment}
`;

export const DELETE_ORG_DOCUMENT = gql`
  mutation deleteDocument($documentId: ID!) {
    deleteDocument(documentId: $documentId) {
      success
    }
  }
`;

export const CREATE_ORG_DOCUMENT_CATEGORY = gql`
  mutation createOrgDocumentCategory($input: DocumentCategoryInput) {
    createOrgDocumentCategory(input: $input) {
      ...DocCategoryFragment
    }
  }
  ${DocCategoryFragment}
`;

export const UPDATE_ORG_DOCUMENT_CATEGORY = gql`
  mutation updateDocumentCategory($documentCategoryId: ID!, $input: DocumentCategoryInput) {
    updateDocumentCategory(documentCategoryId: $documentCategoryId, input: $input) {
      ...DocCategoryFragment
    }
  }
  ${DocCategoryFragment}
`;

export const DELETE_ORG_DOCUMENT_CATEGORY = gql`
  mutation deleteDocumentCategory($documentCategoryId: ID!) {
    deleteDocumentCategory(documentCategoryId: $documentCategoryId) {
      success
    }
  }
`;
