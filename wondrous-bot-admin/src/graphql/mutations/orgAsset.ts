import { gql } from "@apollo/client";

export const UPDATE_ORG_BANNER = gql`
  mutation updateOrgBanner($orgId: ID!, $input: OrgBannerInput) {
    updateOrgBanner(orgId: $orgId, input: $input) {
      success
    }
  }
`;
