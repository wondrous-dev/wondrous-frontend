import { gql } from '@apollo/client';

export const TokenGatingConditionFragment = gql`
  fragment TokenGatingConditionFragment on TokenGatingCondition {
    id
    orgId
    podId
    name
    booleanLogic
    type
    tokenAccessCondition {
      contractAddress
      type
      chain
      method
      minValue
      tokenIds
    }
    guildAccessCondition {
      guildId
      roleId
    }
    otterspaceAccessCondition {
      raftId
      badgeSpecId
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

export const OtterspaceAccessConditionFragment = gql`
  fragment OtterspaceAccessConditionFragment on OtterspaceAccessCondition {
    id
    orgId
    podId
    name
    type
    accessCondition {
      raftId
      badgeSpecId
    }
  }
`;
