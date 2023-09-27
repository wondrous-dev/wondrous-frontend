import { gql } from "@apollo/client";

export const GET_STORE_ITEMS_FOR_ORG = gql`
  query getStoreItemsForOrg($input: OrgStoreItemQueryInput) {
    getStoreItemsForOrg(input: $input) {
      id
      createdAt
      createdBy
      orgId
      name
      type
      description
      ptPrice
      price
      media {
        slug
        name
        type
        muxAssetId
        muxPlaybackId
        videoProcessingStatus
      }
      deliveryMethod
      url
      tokenInfo {
        contractAddress
        logoUrl
        name
        symbol
        type
      }
      deactivatedAt
    }
  }
`;
