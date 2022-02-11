import { gql } from '@apollo/client';

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