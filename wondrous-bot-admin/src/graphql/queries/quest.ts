import { gql } from '@apollo/client';
import { QuestFragment } from 'graphql/fragments/quest';

export const GET_QUESTS_FOR_ORG = gql`
  query getQuestsForOrg($input: OrgQuestQueryInput) {
    getQuestsForOrg(input: $input) {
      ...QuestFragment
    }
  }
  ${QuestFragment}
`;

export const GET_ORG_QUESTS_LEVELS = gql`
  query getOrgQuestsLevels($orgId: ID!) {
    getOrgQuestsLevels(orgId: $orgId) {
      key
      value
    }
  }
`;

export const GET_QUEST_BY_ID = gql`
  query getQuestById($questId: ID!) {
    getQuestById(questId: $questId) {
      ...QuestFragment
    }
  }
  ${QuestFragment}
`;

export const GET_ORG_LEVEL_REWARDS = gql`
  query getOrgLevelsRewards($orgId: ID!) {
    getOrgLevelsRewards(orgId: $orgId) {
      id
      orgId
      level
      type
      discordRewardData {
        discordRoleId
        discordGuildId
      }
    }
  }
`;