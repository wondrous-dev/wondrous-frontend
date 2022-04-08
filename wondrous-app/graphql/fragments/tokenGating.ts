import { gql } from '@apollo/client';

export const TokenGatingConditionFragment = gql`
  fragment TokenGatingConditionFragment on TokenGatingCondition {
    id
    orgId
    podId
    name
    booleanLogic
    accessCondition
  }
`;
