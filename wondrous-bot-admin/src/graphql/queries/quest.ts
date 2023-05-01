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
export const GET_ORG_QUEST_STATS = gql`
  query getOrgQuestStats($orgId: ID!) {
    getOrgQuestStats(orgId: $orgId) {
      totalMembers
      totalQuests
      totalSubmissions
    }
  }
`;

export const GET_COMMUNITY_USERS_FOR_ORG = gql`
  query getCmtyUsersForOrg($input: OrgIdInput!) {
    getCmtyUsersForOrg(input: $input) {
      id
      createdAt
      point
      level
      username
      twitterInfo {
        twitterUsername
      }
      discordUsername
      discordId
      discordDiscriminator
    }
  }
`;

export const GET_SUBMISSIONS_FOR_QUEST = gql`
  query getSubmissionsForQuest($questId: ID!) {
    getQuestSubmissions(questId: $questId) {
      id
      createdAt
      orgId
      approvedAt
      rejectedAt
      reviewedBy
      media {
        slug
        name
        type
        muxAssetId
        muxPlaybackId
        videoProcessingStatus
      }
      stepsData {
        stepId
        order
        content
        selectedValues
        attachments {
          slug
          name
          type
          muxAssetId
          muxPlaybackId
          videoProcessingStatus
        }
        additionalData {
          txHash
          tweetId
        }
      }
    }
  }
`;
