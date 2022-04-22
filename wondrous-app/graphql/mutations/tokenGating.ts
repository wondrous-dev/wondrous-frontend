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
