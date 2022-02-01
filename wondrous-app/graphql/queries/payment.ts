import { gql } from '@apollo/client';
import { PaymentMethodFragment, PayoutFragment } from '../fragments/payment';

export const GET_PAYMENT_METHODS_FOR_ORG = gql`
  query getPaymentMethodsForOrg($orgId: ID!) {
    getPaymentMethodsForOrg(orgId: $orgId) {
      ...PaymentMethodFragment
    }
  }
  ${PaymentMethodFragment}
`


export const GET_SUBMISSIONS_PAYMENT_INFO = gql`
  query getSubmissionsPaymentInfo($submissionIds: [ID]) {
    getSubmissionsPaymentInfo(submissionIds: $submissionIds) {
      submissionId
      paymentData {
        tokenAddress
        isEthTransfer
        amount
        recepientAddress
      }
    }
  }
`


export const GET_SUBMISSION_PAYMENT_INFO = gql`
  query getSubmissionPaymentInfo($submissionId: ID!) {
    getSubmissionPaymentInfo(submissionId: $submissionId) {
		    submissionId
		    paymentData {
          tokenAddress
    	    isEthTransfer
    	    amount
    	    recepientAddress
        }
    }
  }
`
