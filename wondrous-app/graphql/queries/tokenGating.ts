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

export const CHECK_ORG_TOKEN_GATING_CONDITION = gql`
  query checkOrgTokenGatingCondition($orgId: ID!, $userId: ID!) {
    checkOrgTokenGatingCondition(orgId: $orgId, userId: $userId) {
      success
    }
  }
`;

export const CHECK_ORG_ROLE_TOKEN_GATING_CONDITION = gql`
  query checkOrgRoleTokenGatingCondition($orgRoleId: ID!, $userId: ID!) {
    checkOrgRoleTokenGatingCondition(orgRoleId: $orgRoleId, userId: $userId) {
      success
    }
  }
`;

export const CHECK_POD_ROLE_TOKEN_GATING_CONDITION = gql`
  query checkPodRoleTokenGatingCondition($podRoleId: ID!, $userId: ID!) {
    checkPodRoleTokenGatingCondition(podRoleId: $podRoleId, userId: $userId) {
      success
    }
  }
`;

export const GET_TOKEN_GATED_ROLES_FOR_ORG = gql`
  query getTokenGatedRolesForOrg($orgId: ID!) {
    getTokenGatedRolesForOrg(orgId: $orgId) {
      id
      default
      permissions
      name
      orgId
      tokenGatingCondition {
        id
        orgId
        podId
        name
        booleanLogic
        accessCondition {
          ... on AccessConditionModel {
            contractAddress
            type
            chain
            method
            minValue
            tokenIds
          }
          ... on GuildAccessConditionModel {
            guildId
            roleId
          }
        }
      }
    }
  }
`;

export const GET_TOKEN_GATED_ROLES_FOR_POD = gql`
  query getTokenGatedRolesForPod($podId: ID!) {
    getTokenGatedRolesForPod(podId: $podId) {
      id
      default
      permissions
      name
      podId
      tokenGatingCondition {
        id
        orgId
        podId
        name
        booleanLogic
        accessCondition {
          ... on AccessConditionModel {
            contractAddress
            type
            chain
            method
            minValue
            tokenIds
          }
          ... on GuildAccessConditionModel {
            guildId
            roleId
          }
        }
      }
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
