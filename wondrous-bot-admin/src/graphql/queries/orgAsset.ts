import { gql } from "@apollo/client";
import { OrgAssetFragment } from "graphql/fragments/orgAsset";

export const GET_ORG_CUSTOM_ASSETS = gql`
  query getOrgCustomAssets($orgId: ID!) {
    getOrgCustomAssets(orgId: $orgId) {
      ...OrgAssetFragment
    }
  }
  ${OrgAssetFragment}
`;
