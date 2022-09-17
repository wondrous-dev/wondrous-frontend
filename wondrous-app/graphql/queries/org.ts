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

export const GET_ORG_FROM_USERNAME = gql`
  query getOrgFromUsername($username: String!) {
    getOrgFromUsername(username: $username) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const IS_ORG_USERNAME_TAKEN = gql`
  query isOrgUsernameTaken($username: String!) {
    isOrgUsernameTaken(username: $username) {
      exist
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
  query getUserOrgs($userId: String, $excludeSharedOrgs: Boolean) {
    getUserOrgs(userId: $userId, excludeSharedOrgs: $excludeSharedOrgs) {
      id
      username
      name
      profilePicture
      thumbnailPicture
      privacyLevel
    }
  }
`;

export const GET_ORG_USERS = gql`
  query getOrgUsers($orgId: String!, $limit: Int, $offset: Int, $searchString: String, $filterByRoles: [String]) {
    getOrgUsers(
      orgId: $orgId
      limit: $limit
      offset: $offset
      searchString: $searchString
      filterByRoles: $filterByRoles
    ) {
      user {
        id
        username
        profilePicture
        thumbnailPicture
        activeEthAddress
        firstName
        lastName
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

export const GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD = gql`
  query getOrgRolesWithTokenGate($orgId: ID) {
    getOrgRoles(orgId: $orgId) {
      id
      name
      default
      permissions
      tokenGatingCondition {
        id
        orgId
        podId
        name
        booleanLogic
        accessCondition {
          ... on AccessConditionModel {
            contractAddress
            type
            chain
            method
            minValue
            tokenIds
          }
          ... on GuildAccessConditionModel {
            guildId
            roleId
          }
        }
      }
      discordRolesInfo {
        id
        name
      }
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
      color
    }
  }
`;

export const SEARCH_ORG_USERS = gql`
  query searchOrgUsers($orgId: ID!, $searchString: String!) {
    searchOrgUsers(orgId: $orgId, searchString: $searchString) {
      id
      username
      profilePicture
      thumbnailPicture
      firstName
      lastName
      bio
    }
  }
`;
export const GET_JOIN_ORG_REQUESTS = gql`
  query getJoinOrgRequests($limit: Int, $offset: Int, $sortOrder: String, $orgId: ID, $podIds: [ID]) {
    getJoinOrgRequests(limit: $limit, offset: $offset, sortOrder: $sortOrder, orgId: $orgId, podIds: $podIds) {
      id
      userId
      orgId
      podId
      approvedAt
      message
      rejectedAt
      userUsername
      userProfilePicture
      orgProfilePicture
      orgName
      orgUsername
      podColor
      podName
      createdAt
      checkIsGr15Contributor {
        isGr15Contributor
      }
    }
  }
`;

export const GET_ORG_MEMBERSHIP_REQUEST = gql`
  query getOrgMembershipRequest($orgId: ID!, $limit: Int, $offset: Int) {
    getOrgMembershipRequest(orgId: $orgId, limit: $limit, offset: $offset) {
      id
      userId
      orgId
      approvedAt
      message
      rejectedAt
      userUsername
      userProfilePicture
      orgProfilePicture
      orgName
      orgUsername
      createdAt
      checkIsGr15Contributor {
        isGr15Contributor
      }
    }
  }
`;

export const GET_USER_JOIN_ORG_REQUEST = gql`
  query getUserJoinOrgRequest($orgId: ID!) {
    getUserJoinOrgRequest(orgId: $orgId) {
      id
      orgId
      approvedAt
      rejectedAt
    }
  }
`;

export const GET_TASKS_PER_TYPE = gql`
  query getPerTypeTaskCountForOrgBoard($orgId: ID!) {
    getPerTypeTaskCountForOrgBoard(orgId: $orgId) {
      bountyCount
      taskCount
      proposalCount
      milestoneCount
    }
  }
`;

export const GET_TASKS_PER_TYPE_FOR_POD = gql`
  query getPerTypeTaskCountForPodBoard($podId: ID!) {
    getPerTypeTaskCountForPodBoard(podId: $podId) {
      bountyCount
      taskCount
      proposalCount
      milestoneCount
    }
  }
`;

export const GET_ORG_LABELS = gql`
  query getOrgLabels($orgId: ID!) {
    getOrgLabels(orgId: $orgId) {
      id
      name
      color
    }
  }
`;

export const HAS_ORG_GITHUB_INTEGRATION = gql`
  query hasGithubOrgIntegration($orgId: ID!) {
    hasGithubOrgIntegration(orgId: $orgId) {
      exist
    }
  }
`;

export const GET_ORG_AVAILABLE_REPOSITORIES = gql`
  query getOrgAvailableRepositories($orgId: ID!) {
    getOrgAvailableRepositories(orgId: $orgId) {
      id
      fullName
    }
  }
`;

export const GET_PARENT_ORG_CONTRIBUTORS = gql`
  query getParentOrgsContributors($sharedOrgId: String!, $limit: Int, $offset: Int, $searchString: String) {
    getParentOrgsContributors(sharedOrgId: $sharedOrgId, limit: $limit, offset: $offset, searchString: $searchString) {
      id
      username
      profilePicture
      thumbnailPicture
      activeEthAddress
      firstName
      lastName
      bio
    }
  }
`;

export const GET_GR15_SPONSORS = gql`
  query getGr15Sponsors {
    getGr15Sponsors {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const GET_GR15_GRANTEES = gql`
  query getGr15Grantees {
    getGr15Grantees {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;
