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

export const PayoutFragment = gql`
  fragment PayoutFragment on Payment {
    id
		taskId
		submissionId
		orgId
		podId
		payeeId
		web3AddressId
		address
		paymentMethodId
		transactionHash
		amount
		notes
		payedAt
		status
  }
`
