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
    previewPicure
    pinned
    link
    googleDriveLink
    notionPageId
    documentCategory {
      orgId
      podId
      name
    }
  }
`;

export const documentInputFragment = gql`
  fragment documentInputFragment on DocumentInput {
    orgId
    categoryId
    title
    description
    visibility
    previewPicure
    pinned
    link
    googleDriveLink
    notionPageId
  }
`;
