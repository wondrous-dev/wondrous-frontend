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

export const GET_GRANT_BY_ID = gql`
  query getGrantById($grantId: ID!) {
    getGrantById(grantId: $grantId) {
      id
      title
      description
      status
      numOfGrant
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
  query getGrantApplicationsForGrant($grantId: ID!, $status: String) {
    getGrantApplicationsForGrant(grantId: $grantId, status: $status) {
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
