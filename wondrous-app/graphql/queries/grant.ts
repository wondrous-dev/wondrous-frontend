import { gql } from '@apollo/client';
import { CommentFragment } from 'graphql/fragments/comments';
import { MediaFragment } from 'graphql/fragments/media';
import { OrgFragment } from 'graphql/fragments/org';

export const GET_ORG_GRANTS = gql`
  query getGrantOrgBoard($orgId: ID!, $status: String, $limit: Int, $offset: Int) {
    getGrantOrgBoard(orgId: $orgId, status: $status, limit: $limit, offset: $offset) {
      id
      title
      description
      status
      orgId
      podId
      privacyLevel
      numOfGrant
      applicationsCount
      reward {
        paymentMethodId
        rewardAmount
        chain
        icon
        tokenName
        symbol
      }
      media {
        ...MediaFragment
      }
      commentCount
      endDate
    }
  }
  ${MediaFragment}
`;

export const GET_POD_GRANTS = gql`
  query getGrantPodBoard($podId: ID!, $status: String, $limit: Int, $offset: Int) {
    getGrantPodBoard(podId: $podId, status: $status, limit: $limit, offset: $offset) {
      id
      title
      description
      status
      orgId
      podId
      privacyLevel
      numOfGrant
      applicationsCount
      reward {
        paymentMethodId
        rewardAmount
        chain
        icon
        tokenName
        symbol
      }
      media {
        ...MediaFragment
      }
      commentCount
      endDate
    }
  }
  ${MediaFragment}
`;

export const GET_GRANT_BY_ID = gql`
  query getGrantById($grantId: ID!) {
    getGrantById(grantId: $grantId) {
      id
      title
      description
      status
      numOfGrant
      commentCount
      createdBy
      applyPolicy
      privacyLevel
      applicationsCount
      categories
      reward {
        paymentMethodId
        rewardAmount
        chain
        icon
        tokenName
        symbol
      }
      media {
        ...MediaFragment
      }
      commentCount
      startDate
      endDate
      org {
        ...OrgFragment
      }
      pod {
        id
        name
        color
        privacyLevel
      }
    }
  }
  ${MediaFragment}
  ${OrgFragment}
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
      id
      paymentAddress
      approvedAt
      createdBy
      changeRequestedAt
      commentCount
      rejectedAt
      lastReviewedBy
      paymentStatus
      description
      grantId
      media {
        ...MediaFragment
      }
      title
      grant {
        privacyLevel
        orgId
        podId
        createdBy
        title
        reward {
          paymentMethodId
          rewardAmount
          chain
          icon
          tokenName
          symbol
        }
        id
        org {
          username
          profilePicture
          name
        }
        pod {
          color
          name
        }
      }
    }
  }
  ${MediaFragment}
`;

export const GET_GRANT_APPLICATION_COMMENTS = gql`
  query getGrantApplicationComments($grantApplicationId: String!) {
    getGrantApplicationComments(grantApplicationId: $grantApplicationId) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;
