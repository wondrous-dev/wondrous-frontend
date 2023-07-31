import { gql } from "@apollo/client";

export const GET_CMTY_ENTITIES_COUNT = gql`
  query getCmtyEntitiesCount($orgId: String, $startDate: String, $endDate: String) {
    getCmtyEntitiesCount(orgId: $orgId, startDate: $startDate, endDate: $endDate) {
      date
      counts {
        discordInteraction
        discordMessage
        discordReaction
      }
    }
  }
`;

export const GET_SUBMISSION_REPORTS = gql`
  query getQuestsSubmissionsReport($orgId: String, $startDate: String, $endDate: String, $questId: String) {
    getQuestsSubmissionsReport(orgId: $orgId, startDate: $startDate, endDate: $endDate, questId: $questId) {
      date
      counts {
        total
        approved
      }
    }
  }
`;

export const GET_ONBOARDED_USERS_DATA = gql`
  query getOnboardedUsersCount($orgId: String, $startDate: String, $endDate: String) {
    getOnboardedUsersCount(orgId: $orgId, startDate: $startDate, endDate: $endDate) {
      date
      total
    }
  }
`;

export const GET_CMTY_PRESENCE_ANALYTICS = gql`
  query getCmtyPresenceAnalytics($orgId: String, $startDate: String, $endDate: String) {
    getCmtyPresenceAnalytics(orgId: $orgId, startDate: $startDate, endDate: $endDate) {
      date
      hour
      counts {
        total
        active
      }
    }
  }
`;

export const GET_QUEST_LEADERBOARD = gql`
  query getQuestsAnalyticsLeaderboard($orgId: String, $startDate: String, $endDate: String, $limit: Int, $offset: Int, $sortKey: String, $order: String) {
    getQuestsAnalyticsLeaderboard(orgId: $orgId, startDate: $startDate, endDate: $endDate, limit: $limit, offset: $offset, sortKey:$sortKey, order: $order) {
      id
      createdAt
      createdBy
      title
      orgId
      status
      totalPointReward
      totalNumOfRewards
      totalNumOfSubmissions
      approvedSubsNum
      completion
      rewards {
        id
        type
        discordRewardData {
          discordRoleId
          discordGuildId
          discordRoleName
        }
        poapRewardData {
          id
          name
          description
          startDate
          endDate
          eventUrl
          imageUrl
          expiryDate
          eventSecret
        }
        paymentMethodId
        amount
        paymentMethod {
          name
          contractAddress
        }
      }
    }
  }
`;

export const GET_CMTY_ANALYTICS_CARDS = gql`
  query getCmtyAnalyticsCards($orgId: String, $startDate: String, $endDate: String) {
    getCmtyAnalyticsCards(orgId: $orgId, startDate: $startDate, endDate: $endDate) {
      cmtyMembers
      allTimeCmtyMembers
      questCompletions
      allTimeQuestCompletions
      rewards,
      allTimeRewards
    }
  }
`;