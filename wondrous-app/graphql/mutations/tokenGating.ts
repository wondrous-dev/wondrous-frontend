import { gql } from '@apollo/client';
import { TokenGatingConditionFragment } from 'graphql/fragments/tokenGating';

export const CREATE_LIT_SIGNATURE = gql`
  mutation createLitSignature($input: LitSignatureCreateInput!) {
    createLitSignature(input: $input) {
      success
    }
  }
`;

export const CREATE_TOKEN_GATING_CONDITION_FOR_ORG = gql`
  mutation createTokenGatingConditionForOrg($input: TokenGatingConditionInput!) {
    createTokenGatingConditionForOrg(input: $input) {
      ...TokenGatingConditionFragment
    }
  }
  ${TokenGatingConditionFragment}
`;

export const CREATE_GUILD_ACCESS_CONDITION_FOR_ORG = gql`
  mutation createGuildAccessConditionForOrg($input: GuildAccessConditionInput!) {
    createGuildAccessConditionForOrg(input: $input) {
      ...GuildAccessConditionFragment
    }
  }
  ${GuildAccessConditionFragment}
`;

export const DELETE_TOKEN_GATING_CONDITION = gql`
  mutation deleteTokenGatingCondition($tokenGatingConditionId: ID!) {
    deleteTokenGatingCondition(tokenGatingConditionId: $tokenGatingConditionId) {
      success
    }
  }
`;

export const UPDATE_TOKEN_GATING_CONDITION = gql`
  mutation updateTokenGatingCondition($tokenGatingConditionId: ID!, $input: TokenGatingConditionInput!) {
    updateTokenGatingCondition(tokenGatingConditionId: $tokenGatingConditionId, input: $input) {
      ...TokenGatingConditionFragment
    }
  }
  ${TokenGatingConditionFragment}
`;

export const UPDATE_GUILD_ACCESS_CONDITION = gql`
  mutation updateGuildAccessCondition($tokenGatingConditionId: ID!, $input: GuildAccessConditionInput!) {
    updateGuildAccessCondition(tokenGatingConditionId: $tokenGatingConditionId, input: $input) {
      ...TokenGatingConditionFragment
    }
  }
  ${TokenGatingConditionFragment}
`;

export const CLAIM_ORG_ROLE = gql`
  mutation claimOrgRole($orgRoleId: ID!) {
    claimOrgRole(orgRoleId: $orgRoleId) {
      success
    }
  }
`;

export const CLAIM_POD_ROLE = gql`
  mutation claimPodRole($podRoleId: ID!) {
    claimPodRole(podRoleId: $podRoleId) {
      success
    }
  }
`;

export const APPLY_TOKEN_GATING_TO_ORG_ROLE = gql`
  mutation applyTokenGatingToOrgRole($tokenGatingConditionId: ID!, $orgRoleId: ID!) {
    applyTokenGatingToOrgRole(tokenGatingConditionId: $tokenGatingConditionId, orgRoleId: $orgRoleId) {
      id # these returns probably not needed
      name
      default
      permissions
    }
  }
`;

export const APPLY_TOKEN_GATING_TO_POD_ROLE = gql`
  mutation applyTokenGatingToPodRole($tokenGatingConditionId: ID!, $podRoleId: ID!) {
    applyTokenGatingToPodRole(tokenGatingConditionId: $tokenGatingConditionId, podRoleId: $podRoleId) {
      id # these returns probably not needed
      name
      default
      permissions
    }
  }
`;

export const REMOVE_TOKEN_GATING_FROM_ORG_ROLE = gql`
  mutation removeTokenGatingFromOrgRole($orgRoleId: ID!) {
    removeTokenGatingFromOrgRole(orgRoleId: $orgRoleId) {
      id # these returns probably not needed
      name
      default
      permissions
    }
  }
`;

export const REMOVE_TOKEN_GATING_FROM_POD_ROLE = gql`
  mutation removeTokenGatingFromPodRole($podRoleId: ID!) {
    removeTokenGatingFromPodRole(podRoleId: $podRoleId) {
      id # these returns probably not needed
      name
      default
      permissions
    }
  }
`;
