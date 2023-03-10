import { gql } from '@apollo/client';
import { TokenGatingConditionFragment } from 'graphql/fragments/tokenGating';

export const GET_TOKEN_GATING_CONDITION = gql`
  query getTokenGatingCondition($tokenGatingConditionId: ID!) {
    getTokenGatingCondition(tokenGatingConditionId: $tokenGatingConditionId) {
      ...TokenGatingConditionFragment
    }
  }
  ${TokenGatingConditionFragment}
`;

export const GET_TOKEN_GATING_CONDITIONS_FOR_ORG = gql`
  query getTokenGatingConditionsForOrg($orgId: ID!) {
    getTokenGatingConditionsForOrg(orgId: $orgId) {
      ...TokenGatingConditionFragment
    }
  }
  ${TokenGatingConditionFragment}
`;

export const LIT_SIGNATURE_EXIST = gql`
  query litSignatureExist {
    litSignatureExist {
      exist
    }
  }
`;


export const GET_TOKEN_INFO = gql`
  query getTokenInfo($contractAddress: String!, $chain: String) {
    getTokenInfo(contractAddress: $contractAddress, chain: $chain) {
      contractAddress
      decimals
      logoUrl
      name
      symbol
    }
  }
`;

export const GET_NFT_INFO = gql`
  query getNFTInfo($contractAddress: String!, $tokenType: String, $chain: String, $tokenId: String) {
    getNFTInfo(contractAddress: $contractAddress, tokenType: $tokenType, chain: $chain, tokenId: $tokenId) {
      contractAddress
      type
      logoUrl
      name
      symbol
    }
  }
`;


export const GET_OTTERSPACE_RAFTS = gql`
  query availableOtterspaceRaftsToConnect($walletAddress: String!) {
    availableOtterspaceRaftsToConnect(walletAddress: $walletAddress) {
      raftId
      raftName
    }
  }
`;
