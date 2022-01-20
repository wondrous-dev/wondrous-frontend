import { gql } from '@apollo/client'
import { PaymentMethodFragment } from '../fragments/payment'

export const GET_PAYMENT_METHODS_FOR_ORG = gql`
  query getPaymentMethodsForOrg($orgId: ID!) {
    getPaymentMethodsForOrg(orgId: $orgId) {
      ...PaymentMethodFragment
    }
  }
  ${PaymentMethodFragment}
`
