import { gql } from '@apollo/client';
import {
  PaymentCardFragment,
  PaymentMethodFragment,
  ProcessingPaymentFragment,
  UnpaidSubmissionFragment,
  UnpaidGrantApplicationFragment,
  GrantApplicationPaymentFragment,
} from '../fragments/payment';

export const GET_PAYMENT_BY_ID = gql`
  query getPaymentById($paymentId: ID) {
    getPaymentById(paymentId: $paymentId) {
      createdAt
      id
      taskId
      submissionId
      grantId
      grantApplicationId
      orgId
      podId
      payeeId
      payerWalletId
      web3AddressId
      recipientAddress
      paymentMethodId
      txHash
      safeTxHash
      amount
      notes
      payedAt
      status
      type
      additionalData {
        manualExplorerLink
        utopiaLink
      }
      task {
        title
      }
      submission {
        description
      }
      payerWallet {
        name
        address
        type
        chain
      }
      payee {
        id
        username
        profilePicture
        thumbnailPicture
      }
      paymentMethod {
        tokenAddress
        chain
        tokenName
        symbol
        icon
      }
      grant {
        id
        title
      }
      grantApplication {
        id
        title
      }
      media {
        slug
        name
        type
      }
    }
  }
`;

export const GET_PAYMENT_METHODS_FOR_ORG = gql`
  query getPaymentMethodsForOrg($orgId: ID!, $includeDeactivated: Boolean) {
    getPaymentMethodsForOrg(orgId: $orgId, includeDeactivated: $includeDeactivated) {
      ...PaymentMethodFragment
    }
  }
  ${PaymentMethodFragment}
`;

export const GET_SUBMISSIONS_PAYMENT_INFO = gql`
  query getSubmissionsPaymentInfo($submissionIds: [ID]) {
    getSubmissionsPaymentInfo(submissionIds: $submissionIds) {
      submissionId
      paymentData {
        tokenAddress
        isEthTransfer
        amount
        recepientAddress
        decimal
      }
    }
  }
`;

export const GET_SUBMISSION_PAYMENT_INFO = gql`
  query getSubmissionPaymentInfo($submissionId: ID!) {
    getSubmissionPaymentInfo(submissionId: $submissionId) {
      submissionId
      paymentData {
        tokenAddress
        isEthTransfer
        amount
        recepientAddress
        chain
        decimal
      }
    }
  }
`;

export const GET_PAYMENTS_FOR_ORG = gql`
  query getPaymentsForOrg($input: OrgPaymentQueryInput) {
    getPaymentsForOrg(input: $input) {
      ...PaymentCardFragment
    }
  }
  ${PaymentCardFragment}
`;

export const GET_PAYMENTS_FOR_POD = gql`
  query getPaymentsForPod($input: PodPaymentQueryInput) {
    getPaymentsForPod(input: $input) {
      ...PaymentCardFragment
    }
  }
  ${PaymentCardFragment}
`;

export const GET_UNPAID_SUBMISSIONS_FOR_ORG = gql`
  query getUnpaidSubmissionsForOrg($input: OrgPaymentQueryInput) {
    getUnpaidSubmissionsForOrg(input: $input) {
      ...UnpaidSubmissionFragment
    }
  }
  ${UnpaidSubmissionFragment}
`;

export const GET_UNPAID_SUBMISSIONS_FOR_POD = gql`
  query getUnpaidSubmissionsForPod($input: PodPaymentQueryInput) {
    getUnpaidSubmissionsForPod(input: $input) {
      ...UnpaidSubmissionFragment
    }
  }
  ${UnpaidSubmissionFragment}
`;

export const GET_PROCESSING_PAYMENTS_FOR_ORG = gql`
  query getProcessingPaymentsForOrg($input: OrgPaymentQueryInput) {
    getProcessingPaymentsForOrg(input: $input) {
      ...ProcessingPaymentFragment
    }
  }
  ${ProcessingPaymentFragment}
`;

export const GET_PROCESSING_PAYMENTS_FOR_POD = gql`
  query getProcessingPaymentsForPod($input: PodPaymentQueryInput) {
    getProcessingPaymentsForPod(input: $input) {
      ...ProcessingPaymentFragment
    }
  }
  ${ProcessingPaymentFragment}
`;

export const GET_GRANT_APPLICATION_PAYMENT_INFO = gql`
  query getGrantApplicationPaymentInfo($grantApplicationId: ID!) {
    getGrantApplicationPaymentInfo(grantApplicationId: $grantApplicationId) {
      grantApplicationId
      paymentData {
        tokenAddress
        isEthTransfer
        amount
        recepientAddress
        chain
        decimal
      }
    }
  }
`;

export const GET_PAYMENTS_FOR_GRANT_APPLICATION = gql`
  query getPaymentsForGrantApplication($grantApplicationId: ID) {
    getPaymentsForGrantApplication(grantApplicationId: $grantApplicationId) {
      ...PaymentCardFragment
    }
  }
  ${PaymentCardFragment}
`;

export const GET_UNPAID_GRANT_APPLICATIONS_FOR_ORG = gql`
  query getUnpaidGrantApplicationsForOrg($input: OrgPaymentQueryInput) {
    getUnpaidSubmissionsForOrg(input: $input) {
      ...UnpaidGrantApplicationFragment
    }
  }
  ${UnpaidGrantApplicationFragment}
`;

export const GET_UNPAID_GRANT_APPLICATIONS_FOR_POD = gql`
  query getUnpaidGrantApplicationsForPod($input: PodPaymentQueryInput) {
    getUnpaidGrantApplicationsForPod(input: $input) {
      ...UnpaidGrantApplicationFragment
    }
  }
  ${UnpaidGrantApplicationFragment}
`;

export const GET_GRANT_APPLICATION_PAYMENTS_FOR_ORG = gql`
  query getGrantApplicationPaymentsForOrg($input: OrgPaymentQueryInput) {
    getGrantApplicationPaymentsForOrg(input: $input) {
      ...GrantApplicationPaymentFragment
    }
  }
  ${GrantApplicationPaymentFragment}
`;

export const GET_GRANT_APPLICATION_PAYMENTS_FOR_POD = gql`
  query getGrantApplicationPaymentsForPod($input: PodPaymentQueryInput) {
    getGrantApplicationPaymentsForPod(input: $input) {
      ...PaymentCardFragment
    }
  }
  ${GrantApplicationPaymentFragment}
`;
