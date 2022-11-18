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

export const ACTIVATE_PAYMENT_METHOD = gql`
  mutation activatePaymentMethod($paymentMethodId: ID!) {
    activatePaymentMethod(paymentMethodId: $paymentMethodId) {
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

export const DEACTIVATE_PAYMENT_METHOD = gql`
  mutation deactivatePaymentMethod($paymentMethodId: ID!) {
    deactivatePaymentMethod(paymentMethodId: $paymentMethodId) {
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
`;

export const LINK_OFF_PLATFORM_PAYMENT = gql`
  mutation linkOffPlatformPayment($input: OffPlatformPaymentInput) {
    linkOffPlatformPayment(input: $input) {
      success
    }
  }
`;
export const LINK_BATCH_OFF_PLATFORM_PAYMENT = gql`
  mutation linkBatchOffPlatformPayment($input: LinkBatchOffPlatformPaymentInput) {
    linkBatchOffPlatformPayment(input: $input) {
      success
    }
  }
`;

export const LINK_METAMASK_PAYMENT = gql`
  mutation linkMetamaskPayment($input: MetamaskPaymentInput) {
    linkMetamaskPayment(input: $input) {
      success
    }
  }
`;

export const PROPOSE_GNOSIS_TX_FOR_APPLICATION = gql`
  mutation proposeGnosisTxForGrantApplication($input: GnosisSinglePaymentGrantInput) {
    proposeGnosisTxForGrantApplication(input: $input) {
      success
    }
  }
`;

export const LINK_METAMASK_PAYMENT_FOR_APPLICATION = gql`
  mutation linkMetamaskPaymentforGrantApplication($input: MetamaskGrantPaymentInput) {
    linkMetamaskPaymentforGrantApplication(input: $input) {
      success
    }
  }
`;

export const LINK_OFF_PLATFORM_PAYMENT_FOR_APPLICATION = gql`
  mutation linkOffPlatformGrantApplicationPayment($input: OffPlatformApplicationInput) {
    linkOffPlatformGrantApplicationPayment(input: $input) {
      success
    }
  }
`;

export const LINK_BATCH_OFF_PLATFORM_FOR_APPLICATION = gql`
  mutation linkBatchOffPlatformGrantApplicationPayment($input: LinkBatchOffPlatformPaymentInput) {
    linkBatchOffPlatformGrantApplicationPayment(input: $input) {
      success
    }
  }
`;

export const PROPOSE_GNOSIS_MULTISEND_FOR_APPLICATIONS = gql`
  mutation proposeGnosisMultisendForGrantApplications($input: GnosisBatchPaymentInput) {
    proposeGnosisMultisendForGrantApplications(input: $input) {
      success
    }
  }
`;
