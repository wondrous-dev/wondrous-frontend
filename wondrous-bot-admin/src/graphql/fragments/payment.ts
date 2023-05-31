import { gql } from "@apollo/client";

export const CmtyPaymentMethodFragment = gql`
  fragment CmtyPaymentMethodFragment on CmtyPaymentMethod {
    id
    type
    createdAt
    deactivatedAt
    orgId
    contractAddress
    chain
    tokenName
    symbol
    icon
    decimal
  }
`;
