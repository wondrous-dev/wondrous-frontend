import { gql } from '@apollo/client'

export const GET_ORG_WALLET = gql`
  query getOrgWallet($orgId: ID!) {
    getOrgWallet(orgId: $orgId) {
		id
		createdAt
		orgId
		name
		address
		type
		chain
		deactivatedAt
    }
  }
`


export const GET_POD_WALLET = gql`
  query getPodWallet($podId: ID!) {
    getPodWallet(podId: $podId) {
		id
		createdAt
		podId
		name
		address
		type
		chain
		deactivatedAt
    }
  }
`
