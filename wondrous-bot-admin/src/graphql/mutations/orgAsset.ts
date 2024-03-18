import { gql } from "@apollo/client";

export const UPSERT_ORG_CUSTOM_BANNER = gql`
  mutation upsertOrgCustomAsset($input: OrgAssetInput!) {
    upsertOrgCustomAsset(input: $input) {
      id
      orgId
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
