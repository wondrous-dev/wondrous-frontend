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
