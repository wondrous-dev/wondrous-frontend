import { gql } from '@apollo/client';
import { DocFragment, DocCategoryFragment } from 'graphql/fragments/documents';

export const GET_ORG_DOCS = gql`
  query getOrgDocs($orgId: ID!) {
    getOrgDocuments(orgId: $orgId) {
      ...DocFragment
    }
  }
  ${DocFragment}
`;

export const GET_ORG_DOCS_CATEGORIES = gql`
  query getOrgDocumentCategories($orgId: ID!) {
    getOrgDocumentCategories(orgId: $orgId) {
      ...DocCategoryFragment
    }
  }
  ${DocCategoryFragment}
`;

export const GET_POD_DOCS = gql`
  query getPodDocs($podId: ID!) {
    getPodDocuments(podId: $podId) {
      ...DocFragment
    }
  }
  ${DocFragment}
`;

export const GET_POD_DOCS_CATEGORIES = gql`
  query getOrgDocumentCategories($podId: ID!) {
    getPodDocumentCategories(podId: $podId) {
      ...DocCategoryFragment
    }
  }
  ${DocCategoryFragment}
`;
