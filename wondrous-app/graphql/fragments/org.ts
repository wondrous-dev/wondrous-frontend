import { gql } from '@apollo/client';

export const OrgInviteFragment = gql`
  fragment OrgInviteFragment on Org {
    id
    name
    username
    profilePicture
    contributorCount
  }
`;

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
    membershipRequestsCount
    podCount
    category
    shared
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

export const OrgRoleFragment = gql`
  fragment OrgRoleFragment on OrgRole {
    id
    createAt
    createdBy
    default
    permissions
    orgId
    name
  }
`;

// TODO: Move to another folder
export const LabelFragment = gql`
  fragment LabelFragment on Label {
    id
    createdAt
    orgId
    name
    color
  }
`;
