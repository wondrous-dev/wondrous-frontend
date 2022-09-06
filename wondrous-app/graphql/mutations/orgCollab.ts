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
