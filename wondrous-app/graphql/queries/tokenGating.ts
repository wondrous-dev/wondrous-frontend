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
  query litSignatureExist($litSignature: String!) {
    litSignatureExist(litSignature: $litSignature) {
      exist
    }
  }
`;

export const CHECK_ORG_TOKEN_GATING_CONDITION = gql`
  query checkOrgTokenGatingCondition($orgId: ID!, $userId: ID!) {
    checkOrgTokenGatingCondition(orgId: $orgId, userId: $userId) {
      success
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
  query getNFTInfo($contractAddress: String!) {
    getNFTInfo(contractAddress: $contractAddress) {
      contractAddress
      type
		  logoUrl
		  name
		  symbol
    }
  }
`;

