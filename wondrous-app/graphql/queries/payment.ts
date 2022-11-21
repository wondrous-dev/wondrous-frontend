import { gql } from '@apollo/client';
import {
  PaymentCardFragment,
  PaymentMethodFragment,
  ProcessingPaymentFragment,
  UnpaidSubmissionFragment,
} from '../fragments/payment';

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
