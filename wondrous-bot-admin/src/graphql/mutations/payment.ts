import { gql } from "@apollo/client";

export const CREATE_CMTY_PAYMENT_METHOD = gql`
  mutation createCmtyPaymentMethod($input: CmtyPaymentMethodInput) {
    createCmtyPaymentMethod(input: $input) {
      id
      orgId
      contractAddress
      chain
      name
      symbol
      icon
      decimal
      maxPayout
      notes
      type
    }
  }
`;

export const UPDATE_CMTY_PAYMENT_METHOD = gql`
  mutation updateCmtyPaymentMethod($paymentMethodId: ID!, $input: CmtyPaymentMethodInput) {
    updateCmtyPaymentMethod(paymentMethodId: $paymentMethodId, input: $input) {
      id
      orgId
      contractAddress
      chain
      name
      symbol
      icon
      decimal
      maxPayout
      notes
      type
    }
  }
`;

export const LINK_CMTY_PAYMENTS_WITH_TRANSACTION = gql`
  mutation linkCmtyPaymentsWithTransaction($input: linkCmtyPaymentsTransactionInput) {
    linkCmtyPaymentsWithTransaction(input: $input) {
      success
    }
  }
`;
export const MARK_CMTY_PAYMENT_AS_COMPLETE = gql`
  mutation markCmtyPaymentsAsComplete($paymentIds: [String]!) {
    markCmtyPaymentsAsComplete(paymentIds: $paymentIds) {
      success
    }
  }
`;

export const MARK_CMTY_PAYMENT_TRANSACTION_AS_COMPLETE = gql`
  mutation markCmtyPaymentTransactionAsComplete($txHash: String!) {
    markCmtyPaymentTransactionAsComplete(txHash: $txHash) {
      success
    }
  }
`;

export const CREATE_COMMUNITY_NFT = gql`
  mutation createCommunityNFT($input: CommunityNFTInput) {
    createCommunityNFT(input: $input) {
      id
      tokenId
      chain
      contractAddress
      name
      description
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
    }
  }
`;

export const IMPORT_COMMUNITY_NFT = gql`
  mutation importCommunityNFT($input: ImportNFTInput) {
    importCommunityNFT(input: $input) {
      id
      tokenId
      chain
      contractAddress
      name
      description
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
    }
  }
`;

export const LINK_TRANSACTION_TO_COMMUNITY_NFT = gql`
  mutation linkTransactionToCommunityNFT($cmtyUserId: String!, $signature: String!, $txHash: String!) {
    linkTransactionToCommunityNFT(cmtyUserId: $cmtyUserId, signature: $signature, txHash: $txHash) {
      success
    }
  }
`;

export const DEACTIVATE_CMTY_PAYMENT = gql`
  mutation deactivateCmtyPaymentMethod($paymentMethodId: ID!) {
    deactivateCmtyPaymentMethod(paymentMethodId: $paymentMethodId) {
      id
    }
  }
`;
