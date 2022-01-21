import { gql } from '@apollo/client';
import { OrgRoleFragment } from '../fragments/org';

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
