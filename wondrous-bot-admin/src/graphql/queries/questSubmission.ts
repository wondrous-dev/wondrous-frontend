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
