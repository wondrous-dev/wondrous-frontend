import { gql } from "@apollo/client";
import { CmtyPaymentFragment, CmtyPaymentMethodFragment } from "graphql/fragments/payment";

export const GET_CMTY_PAYMENT_METHODS_FOR_ORG = gql`
  query getCmtyPaymentMethodsForOrg($orgId: ID!, $includeDeactivated: Boolean) {
    getCmtyPaymentMethodsForOrg(orgId: $orgId, includeDeactivated: $includeDeactivated) {
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
  query getUnpaidCmtyPaymentsForQuests($input: CmtyPaymentQueryInput) {
    getUnpaidCmtyPaymentsForQuests(input: $input) {
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


//getUnpaidCmtyPaymentsForOrg
export const GET_UNPAID_CMTY_PAYMENTS_FOR_ORG = gql`
  query getUnpaidCmtyPaymentsForOrg($input: CmtyPaymentQueryInput) {
    getUnpaidCmtyPaymentsForOrg(input: $input) {
      ...CmtyPaymentFragment
    }
  }
  ${CmtyPaymentFragment}
`;
