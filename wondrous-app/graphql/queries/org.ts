import { gql } from '@apollo/client';
import { OrgFragment, OrgInviteFragment } from '../fragments/org';

export const GET_ORG_BY_ID = gql`
  query getOrgById($orgId: ID!) {
    getOrgById(orgId: $orgId) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;
export const GET_ORG_ID_FROM_USERNAME = gql`
  query getOrgIdFromUsername($username: String!) {
    getOrgIdFromUsername(username: $username) {
      orgId
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

export const GET_USER_ORGS = gql`
  query getUserOrgs($userId: String) {
    getUserOrgs(userId: $userId) {
      id
      username
      name
      profilePicture
      thumbnailPicture
    }
  }
`;

export const GET_ORG_USERS = gql`
  query getOrgUsers($orgId: String!, $limit: Int, $offset: Int) {
    getOrgUsers(orgId: $orgId, limit: $limit, offset: $offset) {
      user {
        id
        username
        profilePicture
        bio
      }
      role {
        id
        permissions
        name
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

export const GET_ORG_REVIEWERS = gql`
  query getOrgReviewers($orgId: String!) {
    getOrgReviewers(orgId: $orgId) {
      profilePicture
      id
      username
      name
    }
  }
`;

export const GET_ORG_PODS = gql`
  query getOrgPods($orgId: String) {
    getOrgPods(orgId: $orgId) {
      id
      name
      username
      description
      privacyLevel
      headerPicture
      profilePicture
      thumbnailPicture
      createdBy
      createdAt
      orgId
      tags
      contributorCount
      tasksCompletedCount
    }
  }
`;
