import { gql } from '@apollo/client';

export const PaymentMethodFragment = gql`
  fragment PaymentMethodFragment on PaymentMethod {
    id
    createdAt
    deactivatedAt
    orgId
    tokenAddress
    chain
    tokenName
    symbol
    icon
    decimal
  }
`;

export const PaymentCardFragment = gql`
  fragment PaymentCardFragment on PaymentCard {
    id
    taskTitle
    taskId
    submissionId
    payeeId
    payeeUsername
    payeeProfilePicture
    payeeActiveEthAddress
    chain
    safeAddress
    txHash
    safeTxHash
    payedAt
    paymentStatus
    notes
    amount
    symbol
    icon
    tokenName
    additionalData {
      manualExplorerLink
      utopiaLink
    }
  }
`;

export const GrantApplicationPaymentFragment = gql`
  fragment GrantApplicationPaymentFragment on GrantApplicationPaymentCard {
    id
    grantTitle
    grantId
    grantApplicationId
    grantApplicationTitle
    payeeId
    payeeUsername
    payeeProfilePicture
    paymentAddress
    chain
    safeAddress
    txHash
    safeTxHash
    payedAt
    status
    notes
    amount
    symbol
    icon
    tokenName
    additionalData {
      manualExplorerLink
      utopiaLink
    }
  }
`;

export const UnpaidSubmissionFragment = gql`
  fragment UnpaidSubmissionFragment on UnpaidSubmission {
    taskTitle
    taskId
    submissionId
    payeeId
    payeeUsername
    payeeProfilePicture
    payeeActiveEthAddress
    submissionApprovedAt
    paymentStatus
    chain
    amount
    symbol
    icon
    tokenName
    decimal
    tokenAddress
    safeAddress
    txHash
    safeTxHash
  }
`;

export const UnpaidGrantApplicationFragment = gql`
  fragment UnpaidGrantApplicationFragment on UnpaidGrantApplication {
    grantTitle
    grantId
    grantApplicationId
    grantApplicationTitle
    payeeId
    payeeUsername
    payeeProfilePicture
    paymentAddress
    grantApplicationApprovedAt
    paymentStatus
    chain
    amount
    symbol
    icon
    tokenName
    tokenAddress
    decimal
    safeAddress
    txHash
    safeTxHash
  }
`;

export const ProcessingPaymentFragment = gql`
  fragment ProcessingPaymentFragment on ProcessingPayment {
    taskTitle
    taskId
    submissionId
    payeeId
    payeeUsername
    payeeProfilePicture
    payeeActiveEthAddress
    submissionApprovedAt
    paymentStatus
    chain
    amount
    symbol
    icon
    tokenName
    decimal
    tokenAddress
    safeAddress
    txHash
    safeTxHash
  }
`;
