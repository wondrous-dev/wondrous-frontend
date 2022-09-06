import { gql } from '@apollo/client';
import { OrgFragment } from '../fragments/org';

export const GET_ORG_COLLABS_FOR_ORG = gql`
  query getOrgCollabsForOrg($orgId: ID!) {
    getOrgCollabsForOrg(orgId: $orgId) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const GET_ORG_COLLAB_REQUESTS_FOR_RECIPIENT = gql`
  query getOrgCollabRequestForRecipient($orgId: ID!) {
    getOrgCollabRequestForRecipient(orgId: $orgId) {
      id
      initiatorOrgId
      recipientOrgId
      title
      mission
      initiatorOrg {
        username
        profilePicture
      }
      recipientOrg {
        username
        profilePicture
      }
    }
  }
`;
