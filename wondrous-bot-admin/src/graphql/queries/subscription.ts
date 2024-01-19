import { gql } from "@apollo/client";

export const GET_ORG_SUBSCRIPTION = gql`
  query getOrgSubscription($orgId: ID!) {
    getOrgSubscription(orgId: $orgId) {
      id
      status
      tier
      additionalData {
        cancelAtPeriodEnd
        currentPeriodEnd
        purchasedUserId
      }
    }
  }
`;

export const GET_CHECKOUT_LINK = gql`
  query getCheckoutLink($orgId: ID!, $tier: String!) {
    getCheckoutLink(orgId: $orgId, tier: $tier) {
      url
    }
  }
`;