import { gql } from '@apollo/client';
import { OrgFragment } from 'graphql/fragments/org';

export const CREATE_COLLAB_REQUST = gql`
  mutation requestOrgCollab($input: OrgCollabRequestInput) {
    requestOrgCollab(input: $input) {
      initiatorOrgId
      recipientOrgId
      title
      mission
      initiatorOrg {
        ...OrgFragment
      }
      recipientOrg {
        ...OrgFragment
      }
    }
  }
  ${OrgFragment}
`;

export const DECLINE_ORG_COLLAB_REQUEST = gql`
  mutation declineOrgCollabRequest($orgCollabRequestId: ID!) {
    declineOrgCollabRequest(orgCollabRequestId: $orgCollabRequestId) {
      success
    }
  }
`;

export const APPROVE_ORG_COLLAB_REQUEST = gql`
  mutation approveOrgCollabRequest($orgCollabRequestId: ID!) {
    approveOrgCollabRequest(orgCollabRequestId: $orgCollabRequestId) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const BATCH_ADD_MEMBERS = gql`
  mutation batchAddUsers($input: BatchAddUsersInput) {
    batchAddUsers(input: $input) {
      success
    }
  }
`;
