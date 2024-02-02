import { gql } from "@apollo/client";
import { OrgFragment, OrgInviteFragment } from "graphql/fragments/org";

export const GET_CMTY_ORG_DISCORD_CONFIG = gql`
  query getCmtyOrgDiscordConfig($orgId: ID!) {
    getCmtyOrgDiscordConfig(orgId: $orgId) {
      id
      createdAt
      orgId
      guildId
      guildInfo {
        guildId
        guildName
      }
      additionalData {
        notificationChannelId
        stickyMessage
        welcomeMessage
        stickyMessageChannel
        welcomeMessageChannel
        generalNotificationsChannel
        generalNotificationsChannelActive
        stickyMessageChannelActive
        welcomeMessageChannelActive
        parentChannel
        submissionNotificationsChannel
        submissionNotificationsChannelActive
        leaderboardNotificationsChannel
        leaderboardNotificationsChannelActive
      }
    }
  }
`;

export const GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL = gql`
  query getCmtyOrgDiscordConfig($orgId: ID!) {
    getCmtyOrgDiscordConfig(orgId: $orgId) {
      id
      createdAt
      orgId
      guildId
      guildInfo {
        guildName
      }
    }
  }
`;

export const IS_ORG_USERNAME_TAKEN = gql`
  query isOrgUsernameTaken($username: String!) {
    isOrgUsernameTaken(username: $username) {
      exist
    }
  }
`;

export const GET_ORG_ADMINS = gql`
  query getOrgAdmins($orgId: ID!) {
    getOrgAdmins(orgId: $orgId) {
      id
      username
      thumbnailPicture
      profilePicture
      userInfo {
        email
      }
    }
  }
`;
export const GET_ORG_ROLES = gql`
  query getOrgRoles($orgId: ID) {
    getOrgRoles(orgId: $orgId) {
      id
      name
      default
      permissions
    }
  }
`;

export const GET_ORG_INVITE_ORG_INFO = gql`
  query getInvitedOrgInfo($token: String!) {
    getInvitedOrgInfo(token: $token) {
      ...OrgInviteFragment
    }
  }
  ${OrgInviteFragment}
`;

export const GET_ORG_DISCORD_INVITE_LINK = gql`
  query getOrgDiscordInviteLink($orgId: ID!) {
    getOrgDiscordInviteLink(orgId: $orgId) {
      link
    }
  }
`;

export const GET_ORG_BY_REFERRAL_CODE = gql`
  query getOrgByReferralCode($referralCode: String!) {
    getOrgByReferralCode(referralCode: $referralCode) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const EXPORT_USER_ROLE_SUBMISSIONS = gql`
  query exportUserRolesSubmissions($orgId: String, $startDate: String, $endDate: String, $cmtyUserId: String) {
    exportUserRolesSubmissions(orgId: $orgId, startDate: $startDate, endDate: $endDate, cmtyUserId: $cmtyUserId) {
      acceptedSubmissions
      rejectedSubmissions
      discordUserId
      discordUsername
      questTitleAccepted
      questTitleRejected
      roles
    }
  }
`;
