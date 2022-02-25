import { gql } from '@apollo/client';
import { OrgFragment, OrgRoleFragment } from '../fragments/org';

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
  mutation createJoinOrgRequest($orgId: ID!) {
    createJoinOrgRequest(orgId: $orgId) {
      success
    }
  }
`;

export const APPROVE_JOIN_ORG_REQUEST = gql`
  mutation approveJoinOrgRequest($userId: ID!, $orgId: ID!) {
    approveJoinOrgRequest(userId: $userId, orgId: $orgId) {
      success
    }
  }
`;

export const REJECT_JOIN_ORG_REQUEST = gql`
  mutation rejectJoinOrgRequest($userId: ID!, $orgId: ID!) {
    rejectJoinOrgRequest(userId: $userId, orgId: $orgId) {
      success
    }
  }
`;
