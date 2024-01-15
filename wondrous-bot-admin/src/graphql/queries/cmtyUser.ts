import { gql } from "@apollo/client";
import { CmtyUserFragment } from "graphql/fragments";
import { OrgFragment } from "graphql/fragments/org";

export const GET_INTEGRATION_CMTY_USER = gql`
  query getIntegrationCmtyUser($telegramUserId: String) {
    getIntegrationCmtyUser(telegramUserId: $telegramUserId) {
      ...CmtyUserFragment
    }
  }

  ${CmtyUserFragment}
`;

export const GET_CMTY_USER_INFO = gql`
  query getCmtyUserInfo($cmtyUserId: String) {
    getCmtyUserInfo(cmtyUserId: $cmtyUserId) {
      cmtyUserId
      googleInfo {
        expireAt
      }
    }
  }
`;

export const GET_COMMUNITY_USERS_FOR_ORG = gql`
  query getCmtyUsersForOrg($input: OrgIdInput!) {
    getCmtyUsersForOrg(input: $input) {
      ...CmtyUserFragment
    }
  }
  ${CmtyUserFragment}
`;

export const SEARCH_COMMUNITY_USERS_FOR_ORG = gql`
  query searchCmtyUsersForOrg($input: OrgIdInput!) {
    searchCmtyUsersForOrg(input: $input) {
      ...CmtyUserFragment
    }
  }
  ${CmtyUserFragment}
`;

export const GET_CMTY_USER_FROM_CODE = gql`
  query getCmtyUserFromCode($code: String!) {
    getCmtyUserFromCode(code: $code) {
      cmtyUserId
      orgId
      cmtyUser {
        ...CmtyUserFragment
      }
      org {
        ...OrgFragment
      }
    }
  }
  ${CmtyUserFragment}
  ${OrgFragment}
`;

export const GET_CMTY_USER_ACTIVITY_STATS = gql`
  query getCmtyUserActivityStats($cmtyUserId: String!, $orgId: String!) {
    getCmtyUserActivityStats(cmtyUserId: $cmtyUserId, orgId: $orgId) {
      totalPoints
      level
      totalPointsBalance
      submissions
      badges
      purchases
    }
  }
`;

export const GET_CMTY_USER_BADGES = gql`
  query getCmtyUserBadges($cmtyUserId: String!, $orgId: String!, $limit: Int, $offset: Int) {
    getCmtyUserBadges(cmtyUserId: $cmtyUserId, orgId: $orgId, limit: $limit, offset: $offset) {
      id
      tokenId
      chain
      contractAddress
      name
      mediaUrl
      externalUrl
      attributes
      maxSupply
      unlockableContent
      media {
        slug
        name
        type
      }
      type
      signature
      mintedAt
      txHash
    }
  }
`;

export const GET_CMTY_USER_PURCHASES = gql`
  query getCmtyUserPurchases($cmtyUserId: ID!, $orgId: ID!, $limit: Int, $offset: Int) {
    getCmtyUserPurchases(cmtyUserId: $cmtyUserId, orgId: $orgId, limit: $limit, offset: $offset) {
      purchase {
        createdAt
        discountCode {
          code
          discount
        }
      }
      item {
        name
        type
        nftMetadataId
        ptPrice
        price
        deliveryMethod
        additionalData {
          discordRoleName
          discordRoleId
          discordGuildId
        }
        cmtyPaymentMethodId
      }
    }
  }
`;
