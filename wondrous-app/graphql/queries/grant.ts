import { gql } from '@apollo/client';
import { CommentFragment } from 'graphql/fragments/comments';
import { GrantCardFragment, GrantFragment } from 'graphql/fragments/grant';
import { GrantApplicationFragment } from 'graphql/fragments/grantApplication';
import { MediaFragment } from 'graphql/fragments/media';
import { OrgFragment } from 'graphql/fragments/org';

export const GET_ORG_GRANTS = gql`
  query getGrantOrgBoard($orgId: ID!, $status: String, $fromDate: String, $toDate: String, $limit: Int, $offset: Int) {
    getGrantOrgBoard(
      orgId: $orgId
      status: $status
      fromDate: $fromDate
      toDate: $toDate
      limit: $limit
      offset: $offset
    ) {
      ...GrantCardFragment
    }
  }
  ${GrantCardFragment}
`;

export const GET_POD_GRANTS = gql`
  query getGrantPodBoard($podId: ID!, $status: String, $limit: Int, $offset: Int) {
    getGrantPodBoard(podId: $podId, status: $status, limit: $limit, offset: $offset) {
      ...GrantCardFragment
    }
  }
  ${GrantCardFragment}
`;

export const GET_GRANT_BY_ID = gql`
  query getGrantById($grantId: ID!) {
    getGrantById(grantId: $grantId) {
      ...GrantFragment
    }
  }
  ${GrantFragment}
`;

export const GET_GRANT_COMMENTS = gql`
  query getGrantComments($grantId: ID!) {
    getGrantComments(grantId: $grantId) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const GET_GRANT_APPLICATIONS = gql`
  query getGrantApplicationsForGrant($grantId: ID!, $status: String, $limit: Int, $offset: Int) {
    getGrantApplicationsForGrant(grantId: $grantId, status: $status, limit: $limit, offset: $offset) {
      id
      createdAt
      createdBy
      grantId
      title
      description
      orgId
      podId
      userMentions
      approvedAt
      changeRequestedAt
      rejectedAt
      lastReviewedBy
      paymentStatus
      paymentAddress
      creator {
        id
        username
        profilePicture
      }
      commentCount
    }
  }
`;

export const GET_GRANT_APPLICATION_BY_ID = gql`
  query getGrantApplicationById($grantApplicationId: ID!) {
    getGrantApplicationById(grantApplicationId: $grantApplicationId) {
      ...GrantApplicationFragment
    }
  }
  ${GrantApplicationFragment}
`;

export const GET_GRANT_APPLICATION_COMMENTS = gql`
  query getGrantApplicationComments($grantApplicationId: String!) {
    getGrantApplicationComments(grantApplicationId: $grantApplicationId) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;
export const GET_ACTIVE_GRANT_APPLICATION_PODS = gql`
  query getActiveGrantApplicationPods($grantId: ID!, $limit: Int, $offset: Int) {
    getActiveGrantApplicationPods(grantId: $grantId, limit: $limit, offset: $offset) {
      id
      name
      username

      org {
        id
        username
        profilePicture
      }
      description
      profilePicture
      privacyLevel
      grantApplicationId
      color
      paymentData {
        rewardAmount
        paymentMethodId
        symbol
        icon
        tokenName
        chain
      }
    }
  }
`;

export const GET_GRANT_REVIEWERS = gql`
  query getGrantReviewers($taskId: ID!) {
    getGrantReviewers(taskId: $taskId) {
      id
      profilePicture
      firstName
      lastName
      username
    }
  }
`;
