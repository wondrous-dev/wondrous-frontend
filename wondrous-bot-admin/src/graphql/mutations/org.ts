import { gql } from "@apollo/client";
import { OrgFragment } from "graphql/fragments/org";

export const UPDATE_ORG = gql`
  mutation updateOrg($orgId: ID!, $input: OrgInput) {
    updateOrg(orgId: $orgId, input: $input) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const CONNECT_DISCORD_TO_CMTY_ORG = gql`
  mutation connectDiscordToCmtyOrg($orgId: ID!, $guildId: String!, $code: String) {
    connectDiscordToCmtyOrg(orgId: $orgId, guildId: $guildId, code: $code) {
      success
    }
  }
`;

export const DISCONNECT_DISCORD_TO_CMTY_ORG = gql`
  mutation disconnectDiscordToCmtyOrg($orgId: ID!) {
    disconnectDiscordToCmtyOrg(orgId: $orgId) {
      success
    }
  }
`;

export const CREATE_ORG = gql`
  mutation createOrg($input: OrgInput) {
    createOrg(input: $input) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const CREATE_ORG_INVITE_LINK = gql`
  mutation createOrgInviteLink($input: OrgInviteLinkInput) {
    createOrgInviteLink(input: $input) {
      token
    }
  }
`;

export const REDEEM_ORG_INVITE_LINK = gql`
  mutation redeemOrgInviteLink($token: String!) {
    redeemOrgInviteLink(token: $token) {
      success
    }
  }
`;

export const KICK_ORG_USER = gql`
  mutation kickOrgUser($userId: ID!, $orgId: ID!) {
    kickOrgUser(userId: $userId, orgId: $orgId) {
      success
    }
  }
`;

export const RESET_ORG_CMTY_USER_POINT_BALANCE = gql`
  mutation resetOrgCmtyUserPointBalance($orgId: ID!) {
    resetOrgCmtyUserPointBalance(orgId: $orgId) {
      success
    }
  }
`;

export const RESET_ORG_CMTY_USER_POINTS = gql`
  mutation resetOrgCmtyUserPoints($orgId: ID!) {
    resetOrgCmtyUserPoints(orgId: $orgId) {
      success
    }
  }
`;

export const UPDATE_ORG_MODULES = gql`
  mutation updateOrgModules($orgId: ID!, $input: ModulesInput) {
    updateOrgModules(orgId: $orgId, input: $input) {
      success
    }
  }
`;

export const CREATE_CMTY_ORG = gql`
  mutation createCmtyOrg($code: String!, $guildId: String!) {
    createCmtyOrg(code: $code, guildId: $guildId) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;