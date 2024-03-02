import { gql } from "@apollo/client";
import { OrgBannerFragment } from "graphql/fragments/orgAsset";

export const GET_ORG_BANNERS = gql`
  query getOrgBanners($orgId: ID!) {
    getOrgBanners(orgId: $orgId) {
      ...OrgBannerFragment
    }
  }
  ${OrgBannerFragment}
`;
