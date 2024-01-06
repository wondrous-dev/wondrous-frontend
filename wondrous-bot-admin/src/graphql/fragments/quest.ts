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
    order
    category
    maxSubmission
    submissionCooldownPeriod
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

export const MinimalQuestFragment = gql`
  fragment MinimalQuestFragment on Quest {
    id
    title
    description
    status
    level
    startAt
    endAt
    maxSubmission
    submissionCooldownPeriod
    requireReview
    maxApproval
    pointReward
    conditionLogic
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
    submissionCooldownPeriod
    maxSubmission
    category
    isOnboarding
    maxApproval
    maxedAt
    requireReview
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
        exclusiveQuest
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
          storeItem {
            name
            id
          }
          storeItemId
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
            nftMetadataId
            nftMetadata {
              mediaUrl
            }
          }
        }
      }
      additionalData {
        discordChannelName
        discordChannelId
        discordChannelIds
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
