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
      quantity
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
      cmtyPaymentMethodId
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
      conditionLogic
      stats {
        totalPurchases
      }
      price
      quantity
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
      cmtyPaymentMethodId
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

export const GET_ALL_STORE_ITEM_DISCOUNT_CODES = gql`
  query getAllStoreItemDiscountCodes($storeItemId: ID!, $limit: Int, $offset: Int, $all: Boolean) {
    getAllStoreItemDiscountCodes(storeItemId: $storeItemId, limit: $limit, offset: $offset, all: $all) {
      itemId
      type
      scheme
      code
      discount
      deliveredAt
      receiverId
      receiver {
        discordUsername
        username
        telegramUsername
      }
    }
  }
`;

export const GET_STORE_ITEM_DISCOUNT_CODE_COUNT = gql`
  query getStoreItemDiscountCodeCount($storeItemId: ID!) {
    getStoreItemDiscountCodeCount(storeItemId: $storeItemId) {
      totalCount
      unavailableCount
    }
  }
`;

export const GET_STORE_ITEM_PURCHASES_EXPORT = gql`
  query getStoreItemPurchasesExport($storeItemId: ID!, $orgId: ID!) {
    getStoreItemPurchasesExport(storeItemId: $storeItemId, orgId: $orgId) {
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
