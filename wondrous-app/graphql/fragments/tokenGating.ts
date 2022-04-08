import { gql } from '@apollo/client';

export const TokenGatingConditionFragment = gql`
  fragment TokenGatingConditionFragment on TokenGatinCondition {
    id
    orgId
    podId
    name
    booleanLogic
    accessCondition {
      contracAddress
      type
      chain
      method
      minValue
      tokenIds
    }
  }
`;
