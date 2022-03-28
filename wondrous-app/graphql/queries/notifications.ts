import { gql } from '@apollo/client';
import { NotificationFragment } from '../fragments/notification';

export const GET_NOTIFICATIONS = gql`
  query getNotifications($limit: Int, $offset: Int) {
    getNotifications(limit: $limit, offset: $offset) {
      ...NotificationFragment
    }
  }
  ${NotificationFragment}
`;

export const GET_ORG_DISCORD_NOTIFICATION_CONFIGS = gql`
  query getOrgDiscordNotificationConfig($orgId: ID) {
    getOrgDiscordNotificationConfig(orgId: $orgId) {
      id
      orgId
      podId
      channelId
      guildId
      disabledAt
      channelInfo {
        channelName
        guildName
      }
    }
  }
`;

export const GET_DISCORD_GUILD_FROM_INVITE_CODE = gql`
  query getDiscordGuildFromInviteCode($inviteCode: String!) {
    getDiscordGuildFromInviteCode(inviteCode: $inviteCode) {
      guildId
    }
  }
`;
