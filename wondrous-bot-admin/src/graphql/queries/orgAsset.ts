import { gql } from "@apollo/client";
import { OrgBannersFragment } from "graphql/fragments/orgAsset";

export const GET_ORG_BANNERS = gql`
  query getOrgBanners($orgId: ID!) {
    getOrgBanners(orgId: $orgId) {
      ...OrgBannerFragment
    }
  }
  ${OrgBannersFragment}
`;
