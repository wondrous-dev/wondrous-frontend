import { gql } from '@apollo/client';

export const GET_ORG_COLLABS_FOR_ORG = gql`
  query getOrgCollabsForOrg($orgId: ID!) {
    getOrgCollabsForOrg(orgId: $orgId) {
      childOrgProfilePicture
      username
      name
      parentOrgProfilePicture
    }
  }
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
        name
      }
      recipientOrg {
        username
        profilePicture
        name
      }
      initiator {
        username
        profilePicture
      }
    }
  }
`;

export const GET_ORG_COLLAB_REQUESTS_FOR_INITIATOR = gql`
  query getOrgCollabRequestForInitiator($orgId: ID!) {
    getOrgCollabRequestForInitiator(orgId: $orgId) {
      id
      initiatorOrgId
      recipientOrgId
      title
      mission
      initiatorOrg {
        username
        name
        profilePicture
      }
      recipientOrg {
        username
        name
        profilePicture
      }
      initiator {
        username
        profilePicture
      }
    }
  }
`;
