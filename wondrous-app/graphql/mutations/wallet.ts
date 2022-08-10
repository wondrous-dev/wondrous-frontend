import { gql } from '@apollo/client';

export const CREATE_ORG_WALLET = gql`
  mutation createOrgWallet($input: WalletInput) {
    createOrgWallet(input: $input) {
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
`;

export const CREATE_POD_WALLET = gql`
  mutation createPodWallet($input: WalletInput) {
    createPodWallet(input: $input) {
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
`;
