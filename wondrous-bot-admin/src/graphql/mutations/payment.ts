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
