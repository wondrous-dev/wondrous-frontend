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
