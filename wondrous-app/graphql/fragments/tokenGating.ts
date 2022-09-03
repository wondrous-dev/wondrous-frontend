import { gql } from '@apollo/client';

export const TokenGatingConditionFragment = gql`
  fragment TokenGatingConditionFragment on TokenGatingCondition {
    id
    orgId
    podId
    name
    booleanLogic
    accessCondition {
      contractAddress
      type
      chain
      method
      minValue
      tokenIds
    }
  }
`;

export const GuildAccessConditionFragment = gql`
    fragment GuildAccessConditionFragment on GuildAccessCondition {
        id
        orgId
        podId
        name
        type
        accessCondition {
            guildId
            roleId
        }
    }
`;
