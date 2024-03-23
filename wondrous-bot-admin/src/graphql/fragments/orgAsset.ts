import { gql } from "@apollo/client";

export const OrgAssetFragment = gql`
  fragment OrgAssetFragment on OrgAsset {
    id
    orgId
    purpose
    mediaType
    slug
    publicUrl
    cdnUrl
    removedAt
  }
`;
