import { gql } from '@apollo/client'

export const PaymentMethodFragment = gql`
  fragment PaymentMethodFragment on PaymentMethod {
    id
    orgId
    tokenAddress
    chain
    tokenName
    symbol
    icon
    decimal
  }
`
