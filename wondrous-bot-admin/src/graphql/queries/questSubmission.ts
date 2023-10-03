import { gql } from "@apollo/client";

export const VERIFY_TWEET_LIKED = gql`
  query verifyTweetLiked($cmtyUserId: ID!, $tweetId: String) {
    verifyTweetLiked(cmtyUserId: $cmtyUserId, tweetId: $tweetId) {
      userLikedTweet
    }
  }
`;

export const VERIFY_TWEET_RETWEETED = gql`
  query verifyTweetRetweeted($cmtyUserId: ID!, $tweetId: String) {
    verifyTweetRetweeted(cmtyUserId: $cmtyUserId, tweetId: $tweetId) {
      userRetweetedTweet
    }
  }
`;

export const VERIFY_TWITTER_FOLLOW = gql`
  query verifyTwitterFollow($cmtyUserId: ID!, $tweetHandle: String) {
    verifyTwitterFollow(cmtyUserId: $cmtyUserId, tweetHandle: $tweetHandle) {
      userFollowed
    }
  }
`;

export const VERIFY_TWEET_REPLIED = gql`
  query verifyTweetReplied($cmtyUserId: ID!, $tweetId: String) {
    verifyTweetReplied(cmtyUserId: $cmtyUserId, tweetId: $tweetId) {
      userRepliedToTweet
    }
  }
`;

export const VERIFY_TWEET_WITH_PHRASE = gql`
  query verifyTweetWithPhrase($cmtyUserId: ID!, $tweetPhrase: String) {
    verifyTweetWithPhrase(cmtyUserId: $cmtyUserId, tweetPhrase: $tweetPhrase) {
      userTweetedWithPhrase
    }
  }
`;

export const GET_USER_QUEST_SUBMISSION_ANALYTICS = gql`
  query getUserQuestSubmissionAnalytics($cmtyUserId: ID!, $orgId: ID!) {
    getUserQuestSubmissionAnalytics(cmtyUserId: $cmtyUserId, orgId: $orgId) {
      approvalsCount
      completionRate
      totalNumOfRewards
      totalPointReward
      totalSubmissions
    }
  }
`;

export const GET_USER_QUEST_SUBMISSIONS = gql`
  query getUserQuestSubmissions($cmtyUserId: ID!, $orgId: ID!, $limit: Int, $offset: Int, $questId: String, $status: String) {
    getUserQuestSubmissions(cmtyUserId: $cmtyUserId, orgId: $orgId, limit: $limit, offset: $offset, questId: $questId, status: $status) {
      id
      createdAt
      orgId
      approvedAt
      rejectedAt
      reviewedBy
      createdBy
      media {
        slug
        name
        type
        muxAssetId
        muxPlaybackId
        videoProcessingStatus
      }
      stepsData {
        selectedValues
        stepId
        attachments {
          slug
          name
          type
          muxAssetId
          muxPlaybackId
          videoProcessingStatus
        }
        content
        additionalData {
          txHash
          tweetId
        }
      }
      quest {
        title
        pointReward
        steps {
          type
          id
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
            category
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
    }
  }
`;


export const GET_ONBOARDING_QUEST_SUBMISSIONS = gql`
  query getQuestSubmissionsOnboarding($cmtyUserId: ID!, $orgId: ID!, $limit: Int, $offset: Int) {
    getQuestSubmissionsOnboarding(cmtyUserId: $cmtyUserId, orgId: $orgId, limit: $limit, offset: $offset) {
      id
      createdAt
      orgId
      approvedAt
      rejectedAt
      reviewedBy
      createdBy
      media {
        slug
        name
        type
        muxAssetId
        muxPlaybackId
        videoProcessingStatus
      }
      stepsData {
        selectedValues
        stepId
        attachments {
          slug
          name
          type
          muxAssetId
          muxPlaybackId
          videoProcessingStatus
        }
        content
        additionalData {
          txHash
          tweetId
        }
      }
      quest {
        title
        pointReward
        steps {
          type
          id
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
            category
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
    }
  }
`;
