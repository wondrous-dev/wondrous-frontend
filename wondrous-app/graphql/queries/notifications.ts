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
  query getOrgDiscordNotificationConfig($orgId: ID!) {
    getOrgDiscordNotificationConfig(orgId: $orgId) {
      id
      orgId
      channelId
      guildId
      disabledAt
      type
      channelInfo {
        channelName
        guildName
      }
    }
  }
`;

export const GET_POD_DISCORD_NOTIFICATION_CONFIGS = gql`
  query getPodDiscordNotificationConfig($podId: ID!) {
    getPodDiscordNotificationConfig(podId: $podId) {
      id
      orgId
      podId
      channelId
      guildId
      type
      disabledAt
      channelInfo {
        channelName
        guildName
      }
    }
  }
`;

export const GET_USER_DISCORD_NOTIFICATION_CONFIGS = gql`
  query getUserNotificationSetting {
    getUserNotificationSetting {
      id
      enabled
      discordEnabled
      emailEnabled
      onTaskAssign
      onComment
      onProposalSubmissionStatus
      onSubmissionsToReview
      onTaskClaim
      onPayment
      onJoinRequest
      onJoinRequestStatus
      onDueDate
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

export const CHECK_DISCORD_BOT_ADDED = gql`
  query checkDiscordBotAdded($guildId: String!) {
    checkDiscordBotAdded(guildId: $guildId) {
      botAdded
    }
  }
`;

export const GET_CHANNELS_FROM_DISCORD = gql`
  query getAvailableChannelsForDiscordGuild($guildId: String!) {
    getAvailableChannelsForDiscordGuild(guildId: $guildId) {
      id
      name
    }
  }
`;
