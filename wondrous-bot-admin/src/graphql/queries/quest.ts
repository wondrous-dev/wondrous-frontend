import { gql } from "@apollo/client";
import { QuestFragment, QuestListFragment } from "graphql/fragments/quest";
import { CmtyUserFragment } from "graphql/fragments/user";

export const GET_QUESTS_FOR_ORG = gql`
  query getQuestsForOrg($input: OrgQuestQueryInput) {
    getQuestsForOrg(input: $input) {
      ...QuestListFragment
    }
  }
  ${QuestListFragment}
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
      ...CmtyUserFragment
    }
  }
  ${CmtyUserFragment}
`;

export const GET_SUBMISSIONS_FOR_QUEST = gql`
  query getQuestSubmissions($questId: ID!, $status: String, $limit: Int, $offset: Int) {
    getQuestSubmissions(questId: $questId, status: $status, limit: $limit, offset: $offset) {
      id
      createdAt
      orgId
      approvedAt
      rejectedAt
      reviewedBy
      createdBy
      creator {
        ...CmtyUserFragment
      }
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
  ${CmtyUserFragment}
`;

export const GET_QUEST_SUBMISSION_STATS = gql`
  query getQuestSubmissionStats($questId: ID!) {
    getQuestSubmissionStats(questId: $questId) {
      in_review
      approved
      rejected
    }
  }
`;

export const GET_QUEST_REWARDS = gql`
  query getQuestRewards($questId: ID!) {
    getQuestRewards(questId: $questId) {
      id
      type
      discordRewardData {
        discordRoleId
        discordGuildId
        discordRoleName
      }
    }
  }
`;
