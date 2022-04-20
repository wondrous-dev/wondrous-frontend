import { gql } from '@apollo/client';

export const DocFragment = gql`
  fragment DocFragment on Document {
    id
    podId
    documentCategoryId
    title
    description
    visibility
    previewPicure
    thumbnailPicture
    pinned
    link
    googleDriveLink
    notionPageId
    documentCategory
  }
`;
