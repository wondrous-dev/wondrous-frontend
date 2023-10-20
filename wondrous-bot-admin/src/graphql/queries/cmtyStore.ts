import { gql } from "@apollo/client";
import { CmtyUserFragment } from "graphql/fragments";

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
      deliveryMessage
      url
      nftMetadataId
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
      maxPurchase
      stats {
        totalPurchases
      }
      price
      conditions {
        type
        conditionData {
          minLevel
          discordGuildId
          discordRoleId
        }
      }
      media {
        slug
        name
        type
        muxAssetId
        muxPlaybackId
        videoProcessingStatus
      }
      deliveryMethod
      deliveryMessage
      url
      nftMetadataId
      additionalData {
        discordRoleId
        discordGuildId
        discordRoleName
      }
    }
  }
`;

export const GET_STORE_ITEM_DISCOUNT_CODE_INFO = gql`
  query getStoreItemDiscountCodeInfo($storeItemId: ID!) {
    getStoreItemDiscountCodeInfo(storeItemId: $storeItemId) {
      itemId
      type
      scheme
      discount
    }
  }
`;

export const GET_STORE_ITEM_PURCHASES = gql`
  query getStoreItemPurchases($storeItemId: ID!, $orgId: ID!, $limit: Int, $offset: Int) {
    getStoreItemPurchases(storeItemId: $storeItemId, orgId: $orgId, limit: $limit, offset: $offset) {
      id
      createdAt
      itemId
      orgId
      cmtyUser {
        ...CmtyUserFragment
      }
      type
      pointAmount
      discountCodeId
      discountCode {
        code
      }
    }
  }
  ${CmtyUserFragment}
`;
