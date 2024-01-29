import { gql } from "@apollo/client";
import { CmtyPaymentFragment, CmtyPaymentMethodFragment, CommunityNFTFragment } from "graphql/fragments/payment";

export const GET_CMTY_PAYMENT_METHODS_FOR_ORG = gql`
  query getCmtyPaymentMethodsForOrg($orgId: ID!, $includeDeactivated: Boolean, $types: [String]) {
    getCmtyPaymentMethodsForOrg(orgId: $orgId, includeDeactivated: $includeDeactivated, types: $types) {
      ...CmtyPaymentMethodFragment
    }
  }
  ${CmtyPaymentMethodFragment}
`;

export const GET_TOKEN_INFO = gql`
  query getTokenInfo($contractAddress: String!, $chain: String) {
    getTokenInfo(contractAddress: $contractAddress, chain: $chain) {
      contractAddress
      decimals
      logoUrl
      name
      symbol
    }
  }
`;

export const GET_NFT_INFO = gql`
  query getNFTInfo($contractAddress: String!, $tokenType: String, $chain: String, $tokenId: String) {
    getNFTInfo(contractAddress: $contractAddress, tokenType: $tokenType, chain: $chain, tokenId: $tokenId) {
      contractAddress
      type
      logoUrl
      name
      symbol
    }
  }
`;

export const GET_UNPAID_CMTY_PAYMENTS_FOR_QUESTS = gql`
  query getUnpaidCmtyPaymentsForQuest($input: CmtyPaymentQueryInput) {
    getUnpaidCmtyPaymentsForQuest(input: $input) {
      ...CmtyPaymentFragment
    }
  }
  ${CmtyPaymentFragment}
`;

export const GET_PAID_CMTY_PAYMENTS_FOR_QUESTS = gql`
  query getPaidCmtyPaymentsForQuest($input: CmtyPaymentQueryInput) {
    getPaidCmtyPaymentsForQuest(input: $input) {
      ...CmtyPaymentFragment
    }
  }
  ${CmtyPaymentFragment}
`;

export const GET_PROCESSING_CMTY_PAYMENTS_FOR_QUESTS = gql`
  query getProcessingCmtyPaymentsForQuest($input: CmtyPaymentQueryInput) {
    getProcessingCmtyPaymentsForQuest(input: $input) {
      ...CmtyPaymentFragment
    }
  }
  ${CmtyPaymentFragment}
`;

export const GET_CMTY_PAYMENT_COUNTS = gql`
  query getCmtyPaymentsCountForOrg($input: CmtyPaymentQueryInput) {
    getCmtyPaymentsCountForOrg(input: $input) {
      count
    }
  }
`;

export const GET_UNPAID_CMTY_PAYMENTS_FOR_ORG = gql`
  query getUnpaidCmtyPaymentsForOrg($input: CmtyPaymentQueryInput) {
    getUnpaidCmtyPaymentsForOrg(input: $input) {
      ...CmtyPaymentFragment
    }
  }
  ${CmtyPaymentFragment}
`;

export const GET_COMPLETED_CMTY_PAYMENTS_FOR_ORG = gql`
  query getCompletedCmtyPaymentsForOrg($input: CmtyPaymentQueryInput) {
    getCompletedCmtyPaymentsForOrg(input: $input) {
      ...CmtyPaymentFragment
    }
  }
  ${CmtyPaymentFragment}
`;

export const GET_PROCESSING_CMTY_PAYMENTS_FOR_ORG = gql`
  query getProcessingCmtyPaymentsForOrg($input: CmtyPaymentQueryInput) {
    getProcessingCmtyPaymentsForOrg(input: $input) {
      ...CmtyPaymentFragment
    }
  }
  ${CmtyPaymentFragment}
`;

export const GET_COMMUNITY_NFTS_FOR_ORG = gql`
  query getCommunityNFTsForOrg($orgId: ID!) {
    getCommunityNFTsForOrg(orgId: $orgId) {
      ...CommunityNFTFragment
    }
  }
  ${CommunityNFTFragment}
`;

export const GET_COMMUNITY_NFT_BY_TOKEN_ID = gql`
  query getCommunityNFTByTokenID($tokenId: ID!) {
    getCommunityNFTByTokenID(tokenId: $tokenId) {
      ...CommunityNFTFragment
    }
  }
  ${CommunityNFTFragment}
`;

export const GET_CMTY_USER_NFT_METADATA = gql`
  query getCmtyUserNftMetadata($cmtyUserId: String!, $tokenId: String!) {
    getCmtyUserNftMetadata(cmtyUserId: $cmtyUserId, tokenId: $tokenId) {
      orgId
      chain
      receiverAddress
      name
      signature
      nftMetadataId
      mediaUrl
      cmtyUserUsername
      cmtyUserDiscordUsername
      nonce
      org {
        name
        profilePicture
      }
    }
  }
`;

export const GET_COMMUNITY_NFT_BY_METADATA_ID = gql`
  query getCmtyNFTByMetadataId($nftMetadataId: ID!) {
    getCmtyNFTByMetadataId(nftMetadataId: $nftMetadataId) {
      ...CommunityNFTFragment
    }
  }
  ${CommunityNFTFragment}
`;
