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
      stats {
        totalPurchases
      }
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
        name
        type
        chain
      }
      additionalData {
        discordRoleId
        discordGuildId
        discordRoleName
      }
      deactivatedAt
    }
  }
`;

export const GET_STORE_ITEM_BY_ID = gql`
  query getStoreItem($storeItemId: ID!) {
    getStoreItem(storeItemId: $storeItemId) {
      id
      orgId
      name
      type
      description
      deactivatedAt
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
        name
        type
        chain
      }
      additionalData {
        discordRoleId
        discordGuildId
        discordRoleName
      }
    }
  }
`;