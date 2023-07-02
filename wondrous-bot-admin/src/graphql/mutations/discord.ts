import { gql } from "@apollo/client";

export const PUSH_QUEST_DISCORD_NOTFICATION = gql`
  mutation postQuestToDiscord(
    $questId: ID!
    $channelId: String!
    $orgId: ID!
    $mentionChannel: Boolean
    $message: String
  ) {
    postQuestToDiscord(
      orgId: $orgId
      questId: $questId
      channelId: $channelId
      mentionChannel: $mentionChannel
      message: $message
    ) {
      success
    }
  }
`;

export const UPDATE_ORG_DISCORD_ADDITIONAL_DATA = gql`
  mutation updateOrgDiscordAdditionalData($orgId: ID!, $additionalData: JSON) {
    updateOrgDiscordAdditionalData(orgId: $orgId, additionalData: $additionalData) {
      success
    }
  }
`;
