import { gql } from '@apollo/client';

export const OrgFragment = gql`
  fragment OrgFragment on Org {
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
    contributorCount
    podCount
    category
    shared
    cmtyEnabled
    parentOrgs {
      id
      profilePicture
      username
      thumbnailPicture
      name
    }
    links {
      url
      displayName
      type
    }
    hasGr15TasksAndBounties {
      hasGr15Tasks
      hasGr15Bounties
    }
  }
`;
