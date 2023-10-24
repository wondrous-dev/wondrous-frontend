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

export const GET_MINIMAL_QUEST_BY_ID = gql`
  query getQuestById($questId: ID!) {
    getQuestById(questId: $questId) {
      title
      id
    }
  }
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
        type
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

export const SEARCH_COMMUNITY_USERS_FOR_ORG = gql`
  query searchCmtyUsersForOrg($input: OrgIdInput!) {
    searchCmtyUsersForOrg(input: $input) {
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
  query getQuestSubmissionStats($questId: ID, $cmtyUserId: String, $orgId: ID) {
    getQuestSubmissionStats(questId: $questId, cmtyUserId: $cmtyUserId, orgId: $orgId) {
      in_review
      approved
      rejected
    }
  }
`;

export const GET_QUEST_REWARDS = gql`
  query getQuestRewards($questId: ID!, $includeConditionalRewards: Boolean) {
    getQuestRewards(questId: $questId, includeConditionalRewards: $includeConditionalRewards) {
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
      storeItemId
      storeItem {
        name
        id
      }
      paymentMethod {
        name
        contractAddress
        type
        nftMetadataId
        nftMetadata {
          mediaUrl
        }
      }
    }
  }
`;

export const EXPORT_QUEST_SUBMISSIONS = gql`
  query exportQuestSubmissions($questId: ID!) {
    exportQuestSubmissions(questId: $questId) {
      questSteps {
        id
        order
        type
        prompt
        additionalData {
          discordChannelName
          discordChannelId
          tweetHandle
          tweetLink
          tweetPhrase
          snapshotProposalLink
          snapshotSpaceLink
          snapshotVoteTimes
          discordMessageType
          dataCollectionType
          tokenAddress
          tokenSymbol
          tokenLogoUrl
          tokenDecimals
          tokenChain
          tokenAmount
          tokenType
          tokenId
          tokenName
          ytVideoLink
          ytChannelLink
          linkClickUrl
          discordEventId
          minDuration
        }
      }
      questSubmissions {
        createdAt
        orgId
        approvedAt
        rejectedAt
        reviewedBy
        stepsData {
          order
          content
          attachments {
            slug
          }
          additionalData {
            txHash
            tweetId
          }
          selectedValues
          stepId
        }
        creator {
          discordUsername
          discordDiscriminator
          web3Address
          twitterInfo {
            twitterUsername
          }
          level
          point
        }
      }
    }
  }
`;

export const GET_POAP_EVENT = gql`
  query getQuestRewardPoapEvent($eventId: ID!) {
    getQuestRewardPoapEvent(eventId: $eventId) {
      id
      name
      description
      endDate
      eventUrl
      imageUrl
      expiryDate
    }
  }
`;

export const USER_CAN_START_QUEST = gql`
  query userCanStartQuest($telegramUserId: String, $telegramUsername: String, $questId: String) {
    userCanStartQuest(telegramUserId: $telegramUserId, telegramUsername: $telegramUsername, questId: $questId) {
      canStart
      error
      failReasons {
        reason
        level
        questId
        questTitle
        discordRoleId
      }
    }
  }
`;

export const GET_INTEGRATION_CMTY_USER = gql`
  query getIntegrationCmtyUser($telegramUserId: String) {
    getIntegrationCmtyUser(telegramUserId: $telegramUserId) {
      ...CmtyUserFragment
    }
  }

  ${CmtyUserFragment}
`;

export const GET_CMTY_USER_INFO = gql`
  query getCmtyUserInfo($cmtyUserId: String) {
    getCmtyUserInfo(cmtyUserId: $cmtyUserId) {
      cmtyUserId
      googleInfo {
        expireAt
      }
    }
  }
`;
export const VERIFY_LINK_CLICKED = gql`
  query verifyLinkClicked($cmtyUserId: String, $questStepId: String, $url: String) {
    verifyLinkClicked(cmtyUserId: $cmtyUserId, questStepId: $questStepId, url: $url) {
      success
    }
  }
`;

export const VERIFY_YT_SUBSCRIPTION = gql`
  query verifyYoutubeSubscription($cmtyUserId: String, $channelId: String, $channelHandle: String) {
    verifyYoutubeSubscription(cmtyUserId: $cmtyUserId, channelId: $channelId, channelHandle: $channelHandle) {
      subscribed
    }
  }
`;

export const VERIFY_YT_LIKED = gql`
  query verifyYoutubeVideoLike($cmtyUserId: String, $videoId: String) {
    verifyYoutubeVideoLike(cmtyUserId: $cmtyUserId, videoId: $videoId) {
      liked
    }
  }
`;

export const VERIFY_SNAPSHOT_PROPOSAL_VOTE = gql`
  query verifySnapshotProposalVote($telegramUserId: String, $proposalId: String) {
    verifySnapshotProposalVote(telegramUserId: $telegramUserId, proposalId: $proposalId) {
      userVotedProposal
    }
  }
`;

export const VERIFY_SNAPSHOT_SPACE_VOTE = gql`
  query verifySnapshotSpaceVote($telegramUserId: String, $stepId: String, $voteTimes: Int) {
    verifySnapshotSpaceVote(telegramUserId: $telegramUserId, stepId: $stepId, voteTimes: $voteTimes) {
      userVotedSpace
    }
  }
`;

export const VERIFY_TOKEN_HOLDING = gql`
  query verifyTokenHolding(
    $telegramUserId: String
    $tokenChain: String
    $tokenAddress: String
    $tokenAmount: String
    $tokenType: String
    $tokenDecimals: String
  ) {
    verifyTokenHolding(
      telegramUserId: $telegramUserId
      tokenChain: $tokenChain
      tokenAddress: $tokenAddress
      tokenAmount: $tokenAmount
      tokenType: $tokenType
      tokenDecimals: $tokenDecimals
    ) {
      userHasTokens
    }
  }
`;
export const GET_QUEST_REFERRAL_LEADERBOARD = gql`
  query getQuestReferralLeaderBoard($questId: ID!) {
    getQuestReferralLeaderBoard(questId: $questId) {
      referrerName
      referrerDiscordUsername
      referralCount
      referralCode
      referrerId
    }
  }
`;

export const GET_PERMISSION_TO_REWARD_ROLE = gql`
  query getPermissionToRewardRole($roleId: String!, $guildId: String!) {
    getPermissionToRewardRole(roleId: $roleId, guildId: $guildId) {
      success
    }
  }
`;

export const GET_CMTY_USER_TOKEN_EXPIRE_CHECK = gql`
  query getCmtyUserTokenExpireCheck {
    getCmtyUserTokenExpireCheck {
      success
    }
  }
`;

export const GET_QUEST_CATEGORIES = gql`
  query getOrgQuestCategories($orgId: ID!) {
    getOrgQuestCategories(orgId: $orgId) {
      id
      category
    }
  }
`;