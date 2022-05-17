import { gql } from '@apollo/client';


export const CREATE_PAYMENT_METHOD = gql`
  mutation createPaymentMethod($input: PaymentMethodInput) {
    createPaymentMethod(input: $input) {
      id
      orgId
		  tokenAddress
		  chain
		  tokenName
		  symbol
		  icon
		  decimal
		  maxPayout
		  notes
    }
  }
`;

export const PROPOSE_GNOSIS_MULTISEND_FOR_SUBMISSIONS = gql`
  mutation proposeGnosisMultisendForSubmissions($input: GnosisBatchPaymentInput) {
    proposeGnosisMultisendForSubmissions(input: $input) {
        success
    }
  }
`;

export const PROPOSE_GNOSIS_TX_FOR_SUBMISSION = gql`
  mutation proposeGnosisTxForSubmission($input: GnosisSinglePaymentInput) {
    proposeGnosisTxForSubmission(input: $input) {
        success
    }
  }
`

export const LINK_OFF_PLATFORM_PAYMENT = gql`
  mutation linkOffPlatformPayment($input: OffPlatformPaymentInput) {
    linkOffPlatformPayment(input: $input) {
        success
    }
  }
`