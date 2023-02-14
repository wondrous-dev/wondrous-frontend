import { gql } from '@apollo/client';
import { OrgFragment, OrgRoleFragment, LabelFragment } from '../fragments/org';

export const CREATE_ORG_INVITE_LINK = gql`
  mutation createOrgInviteLink($input: OrgInviteLinkInput) {
    createOrgInviteLink(input: $input) {
      token
    }
  }
`;

export const CREATE_ORG_ROLE = gql`
  mutation createOrgRole($input: OrgRoleInput) {
    createOrgRole(input: $input) {
      ...OrgRoleFragment
    }
  }
  ${OrgRoleFragment}
`;

export const UPDATE_ORG_ROLE = gql`
  mutation updateOrgRole($input: OrgRoleUpdateInput) {
    updateOrgRole(input: $input) {
      ...OrgRoleFragment
    }
  }
  ${OrgRoleFragment}
`;

export const DELETE_ORG_ROLE = gql`
  mutation deleteOrgRole($id: ID!) {
    deleteOrgRole(id: $id) {
      success
    }
  }
`;

export const UPDATE_USER_ORG_ROLE = gql`
  mutation updateUserOrgRole($input: UserOrgRoleUpdateInput) {
    updateUserOrgRole(input: $input) {
      success
    }
  }
`;

export const UPDATE_ORG = gql`
  mutation updateOrg($orgId: ID!, $input: OrgInput) {
    updateOrg(orgId: $orgId, input: $input) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const CREATE_JOIN_ORG_REQUEST = gql`
  mutation createJoinOrgRequest($orgId: ID!, $message: String, $roleId: ID!) {
    createJoinOrgRequest(orgId: $orgId, message: $message, roleId: $roleId) {
      success
    }
  }
`;

export const APPROVE_JOIN_ORG_REQUEST = gql`
  mutation approveJoinOrgRequest($joinOrgRequestId: ID!) {
    approveJoinOrgRequest(joinOrgRequestId: $joinOrgRequestId) {
      success
    }
  }
`;

export const REJECT_JOIN_ORG_REQUEST = gql`
  mutation rejectJoinOrgRequest($joinOrgRequestId: ID!) {
    rejectJoinOrgRequest(joinOrgRequestId: $joinOrgRequestId) {
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

export const LEAVE_ORG = gql`
  mutation leaveOrg($orgId: ID!) {
    leaveOrg(orgId: $orgId) {
      success
    }
  }
`;

export const CREATE_LABEL = gql`
  mutation createLabel($input: LabelInput) {
    createLabel(input: $input) {
      ...LabelFragment
    }
  }
  ${LabelFragment}
`;

export const CONNECT_ORG_GITHUB = gql`
  mutation connectOrgGithub($orgId: ID!, $githubAuthCode: String!, $installationId: String!) {
    connectOrgGithub(orgId: $orgId, githubAuthCode: $githubAuthCode, installationId: $installationId) {
      success
    }
  }
`;

export const DELETE_ORG_GITHUB = gql`
  mutation deleteOrgGithubIntegration($orgId: ID!) {
    deleteOrgGithubIntegration(orgId: $orgId) {
      success
    }
  }
`;

export const CONNECT_NOTION_TO_ORG = gql`
  mutation connectNotionToOrg($orgId: ID!, $authorizationCode: String!) {
    connectNotionToOrg(orgId: $orgId, authorizationCode: $authorizationCode) {
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

export const CLAIM_ORG_ROLE = gql`
  mutation claimOrgRole($orgRoleId: ID!) {
    claimOrgRole(orgRoleId: $orgRoleId) {
      success
    }
  }
`;

export const SEND_ORG_EMAIL_INVITES = gql`
  mutation sendOrgRoleInviteEmails($input: OrgInviteLinkInput) {
    sendOrgRoleInviteEmails(input: $input) {
      success
    }
  }
`;
