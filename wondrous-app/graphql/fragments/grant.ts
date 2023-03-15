import { gql } from '@apollo/client';
import { MediaFragment } from './media';
import { OrgFragment } from './org';

export const GrantFragment = gql`
  fragment GrantFragment on Grant {
    id
    title
    description
    status
    numOfGrant
    commentCount
    orgId
    podId
    createdBy
    applyPolicy
    privacyLevel
    applicationsCount
    approvedApplicationsCount
    categories
    reviewers {
      id
      profilePicture
      firstName
      lastName
      username
    }
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
  ${MediaFragment}
  ${OrgFragment}
`;

export const GrantCardFragment = gql`
  fragment GrantCardFragment on GrantCard {
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
    startDate
  }
  ${MediaFragment}
`;
