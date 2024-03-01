import { gql } from "@apollo/client";

export const UPDATE_ORG_BANNER = gql`
  mutation updateOrgBanner($orgId: ID!, $input: OrgBannerInput) {
    updateOrgBanner(orgId: $orgId, input: $input) {
      success
    }
  }
`;

export const DELETE_ORG_BANNER = gql`
  mutation deleteOrgBanner($orgId: ID!, $input: OrgBannerDeleteInput) {
    deleteOrgBanner(orgId: $orgId, input: $input) {
      success
    }
  }
`;
