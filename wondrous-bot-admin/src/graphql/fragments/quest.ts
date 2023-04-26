import { gql } from '@apollo/client';

export const QuestFragment = gql`
  fragment QuestFragment on Quest {
    id
    createdAt
    createdBy
    title
    description
    orgId
    status

    pointReward
    conditionLogic
    conditions {
      type
      conditionData {
        minLevel
        discordRoleId
        discordGuildId
      }
    }
    # id: ID!
    # createdAt: String
    # createdBy: String
    # title: String
    # description: String
    # orgId: String
    # status: String
    # pointReward: Int
    # conditionLogic: String
    # media: [Media]

    # org: Org
    # creator: User
    # conditions: [QuestCondition]
    # steps: [QuestStep]
  }
`;
