import { gql } from '@apollo/client';

export const DocFragment = gql`
  fragment DocFragment on Document {
    id
    orgId
    podId
    categoryId
    title
    description
    visibility
    previewPicture
    pinned
    link
    googleDriveLink
    notionPageId
    documentCategory {
      id
      orgId
      podId
      name
    }
  }
`;

export const DocCategoryFragment = gql`
  fragment DocCategoryFragment on DocumentCategory {
    orgId
    podId
    name
    id
  }
`;
