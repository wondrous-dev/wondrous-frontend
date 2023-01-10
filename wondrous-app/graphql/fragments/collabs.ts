import { gql } from '@apollo/client';

export const CollabsFragment = gql`
  fragment CollabsFragment on OrgCollab {
    id
    childOrgProfilePicture
    parentOrgProfilePicture
    parentOrgName
    childOrgName
    username
    description
    name
  }
`;
