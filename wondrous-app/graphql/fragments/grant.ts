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
    createdBy
    applyPolicy
    privacyLevel
    applicationsCount
    approvedApplicationsCount
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
  ${MediaFragment}
  ${OrgFragment}
`;
