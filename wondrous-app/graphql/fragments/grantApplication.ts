import { gql } from '@apollo/client';
import { MediaFragment } from './media';

export const GrantApplicationFragment = gql`
  fragment GrantApplicationFragment on GrantApplication {
    id
    paymentAddress
    approvedAt
    createdBy
    creator {
      username
      profilePicture
    }
    changeRequestedAt
    commentCount
    rejectedAt
    lastReviewedBy
    paymentStatus
    description
    orgId
    podId
    pod {
      color
      name
      id
    }
    grantId
    media {
      ...MediaFragment
    }
    org {
      username
      profilePicture
      name
      id
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
        id
      }
      pod {
        color
        name
      }
    }
  }
  ${MediaFragment}
`;
