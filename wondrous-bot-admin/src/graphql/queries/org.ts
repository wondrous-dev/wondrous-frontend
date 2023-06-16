import { gql } from "@apollo/client";
import { OrgInviteFragment } from "graphql/fragments/org";

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
