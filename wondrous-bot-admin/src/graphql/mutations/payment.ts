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

//    linkCmtyPaymentsWithTransaction(input: linkCmtyPaymentsTransactionInput): SimpleResponse
export const LINK_CMTY_PAYMENTS_WITH_TRANSACTION = gql`
  mutation linkCmtyPaymentsWithTransaction($input: linkCmtyPaymentsTransactionInput) {
    linkCmtyPaymentsWithTransaction(input: $input) {
      success
    }
  }
`;

// markCmtyPaymentTransactionAsComplete(txHash: String!): SimpleResponse
export const MARK_CMTY_PAYMENT_TRANSACTION_AS_COMPLETE = gql`
  mutation markCmtyPaymentTransactionAsComplete($txHash: String!) {
    markCmtyPaymentTransactionAsComplete(txHash: $txHash) {
      success
    }
  }
`;
