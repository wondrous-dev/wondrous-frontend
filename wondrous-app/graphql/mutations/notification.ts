import { gql } from '@apollo/client';

export const MARK_NOTIFICATIONS_READ = gql`
  mutation markNotificationAsViewed($notificationId: ID!) {
    markNotificationAsViewed(notificationId: $notificationId) {
      success
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation markAllNotificationAsViewed {
    markAllNotificationAsViewed {
      success
    }
  }
`;

export const DISCONNECT_ORG_DISCORD_NOTIFICATION_CONFIG = gql`
  mutation disconnectOrgDiscordNotificationConfig($orgId: ID!, $type: String!, $discordConfigId: String) {
    disconnectOrgDiscordNotificationConfig(orgId: $orgId, type: $type, discordConfigId: $discordConfigId) {
      success
    }
  }
`;

export const DISCONNECT_POD_DISCORD_NOTIFICATION_CONFIG = gql`
  mutation disconnectPodDiscordNotificationConfig($podId: ID!, $type: String!, $discordConfigId: String) {
    disconnectPodDiscordNotificationConfig(podId: $podId, type: $type, discordConfigId: $discordConfigId) {
      success
    }
  }
`;

export const ENABLE_USER_DISCORD_NOTIFICATION_CONFIG = gql`
  mutation enableUserDiscordNotification {
    enableUserDiscordNotification {
      success
    }
  }
`;

export const DISABLE_USER_DISCORD_NOTIFICATION_CONFIG = gql`
  mutation disableUserDiscordNotification {
    disableUserDiscordNotification {
      success
    }
  }
`;

export const MANUAL_DISCORD_ORG_SETUP = gql`
  mutation manualDiscordOrgSetup($orgId: ID!, $guildId: String!, $channelId: String!, $type: String) {
    manualDiscordOrgSetup(orgId: $orgId, guildId: $guildId, channelId: $channelId, type: $type) {
      success
    }
  }
`;

export const MANUAL_DISCORD_POD_SETUP = gql`
  mutation manualDiscordPodSetup($podId: ID!, $guildId: String!, $channelId: String!, $type: String) {
    manualDiscordPodSetup(podId: $podId, guildId: $guildId, channelId: $channelId, type: $type) {
      success
    }
  }
`;

export const SET_USER_NOTIFICATION_SETTINGS = gql`
  mutation setUserNotificationSettings($settings: NotificationSettings) {
    setUserNotificationSettings(settings: $settings) {
      success
    }
  }
`;

export const MANUAL_DISCORD_COLLAB_SETUP = gql`
  mutation manualDiscordCollabSetup($orgId: ID!, $guildId: String!, $channelId: String!, $type: String) {
    manualDiscordCollabSetup(orgId: $orgId, guildId: $guildId, channelId: $channelId, type: $type) {
      success
    }
  }
`;

export const UPDATE_ORG_DISCORD_NOTIFICATION_CONFIG_CHANNEL = gql`
  mutation updateOrgDiscordNotificationChannel($orgId: ID!, $discordConfigId: String!, $channelId: String!) {
    updateOrgDiscordNotificationChannel(orgId: $orgId, discordConfigId: $discordConfigId, channelId: $channelId) {
      success
    }
  }
`;

export const UPDATE_POD_DISCORD_NOTIFICATION_CONFIG_CHANNEL = gql`
  mutation updateOrgDiscordNotificationChannel($podId: ID!, $discordConfigId: String!, $channelId: String!) {
    updatePodDiscordNotificationChannel(podId: $podId, discordConfigId: $discordConfigId, channelId: $channelId) {
      success
    }
  }
`;
