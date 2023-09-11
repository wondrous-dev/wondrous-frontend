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

export const CONFIGURE_ORG_DISCORD_NOTIFICATION = gql`
  mutation configureOrgDiscordNotification($orgId: ID!, $channelId: String, $newChannel: String) {
    configureOrgDiscordNotification(orgId: $orgId, channelId: $channelId, newChannel: $newChannel) {
      success
    }
  }
`;

export const UPDATE_DISCORD_PARENT_CHANNEL_NAME = gql`
  mutation updateDiscordParentChannelName($orgId: ID!, $newName: String) {
    updateDiscordParentChannelName(orgId: $orgId, newName: $newName) {
      success
    }
  }
`;