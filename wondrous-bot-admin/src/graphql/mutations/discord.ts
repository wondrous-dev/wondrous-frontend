import { gql } from "@apollo/client";

export const PUSH_QUEST_DISCORD_NOTFICATION = gql`
  mutation postQuestToDiscord($questId: ID!, $channelId: String!, $orgId: ID!, $mentionChannel: Boolean) {
    postQuestToDiscord(orgId: $orgId, questId: $questId, channelId: $channelId, mentionChannel: $mentionChannel) {
      success
    }
  }
`;
