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
  mutation createTokenGatingConditionForOrg($input: TokenGatinConditionInput!) {
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
  mutation updateTokenGatingCondition($tokenGatingConditionId: ID!, $input: TokenGatinConditionInput!) {
    updateTokenGatingCondition(tokenGatingConditionId: $tokenGatingConditionId, input: $input) {
      ...TokenGatingConditionFragment
    }
  }
  ${TokenGatingConditionFragment}
`;

export const ACTIVATE_TOKEN_GATING_CONDITION_FOR_ORG = gql`
  mutation activateTokenGatingConditionForOrg($tokenGatingConditionId: ID!, $orgId: ID!) {
    activateTokenGatingConditionForOrg(tokenGatingConditionId: $tokenGatingConditionId, orgId: $orgId) {
      success
    }
  }
`;

export const DEACTIVATE_TOKEN_GATING_CONDITION_FOR_ORG = gql`
  mutation deactivateTokenGatingConditionForOrg($tokenGatingConditionId: ID!, $orgId: ID!) {
    deactivateTokenGatingConditionForOrg(tokenGatingConditionId: $tokenGatingConditionId, orgId: $orgId) {
      success
    }
  }
`;
