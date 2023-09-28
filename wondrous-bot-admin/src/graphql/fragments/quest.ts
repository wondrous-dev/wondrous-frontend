import { gql } from "@apollo/client";

export const QuestListFragment = gql`
  fragment QuestListFragment on Quest {
    id
    createdAt
    createdBy
    title
    description
    orgId
    status
    level
    startAt
    endAt
    maxSubmission
    requireReview
    maxApproval
    submissionsCount {
      inReview
      approved
      rejected
    }
    pointReward
    conditionLogic
  }
`;

export const QuestFragment = gql`
  fragment QuestFragment on Quest {
    id
    createdAt
    createdBy
    title
    description
    orgId
    status
    level
    startAt
    endAt
    maxSubmission
    isOnboarding
    maxApproval
    requireReview
    submissionsCount {
      inReview
      approved
      rejected
    }
    org {
      id
      name
      username
      profilePicture
    }
    pointReward
    conditionLogic
    conditions {
      type
      conditionData {
        discordRoleId
        discordGuildId
        questId
        excludeQuest
      }
    }
    steps {
      type
      id
      order
      prompt
      required
      media {
        slug
        name
        type
      }
      options {
        position
        text
        correct
      }
      conditionalRewards {
        optionText
        rewardData {
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
            type
          }
        }
      }
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
        usdValue
      }
    }
  }
`;
