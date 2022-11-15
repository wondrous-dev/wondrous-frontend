import { gql } from '@apollo/client';
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
