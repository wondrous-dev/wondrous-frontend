import { gql } from "@apollo/client";

export const GET_ORG_SUBSCRIPTION = gql`
  query getOrgSubscription($orgId: ID!) {
    getOrgSubscription(orgId: $orgId) {
      id
      status
      type
      additionalData {
        cancelAtPeriodEnd
        currentPeriodEnd
      }
    }
  }
`;
