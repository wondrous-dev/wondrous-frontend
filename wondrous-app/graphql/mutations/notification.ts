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

export const ENABLE_ORG_DISCORD_NOTIFICATION_CONFIG = gql`
  mutation enableOrgDiscordNotificationConfig($orgId: ID!) {
    enableOrgDiscordNotificationConfig(orgId: $orgId) {
      success
    }
  }
`;

export const DISABLE_ORG_DISCORD_NOTIFICATION_CONFIG = gql`
  mutation disableOrgDiscordNotificationConfig($orgId: ID!) {
    disableOrgDiscordNotificationConfig(orgId: $orgId) {
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
  mutation manualDiscordOrgSetup($orgId: ID!, $guildId: String!, $channelId: String!) {
    manualDiscordOrgSetup(orgId: $orgId, guildId: $guildId, channelId: $channelId) {
      success
    }
  }
`;
