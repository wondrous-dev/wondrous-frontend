import { gql } from "@apollo/client";

export const OrgBannerFragment = gql`
  fragment OrgBannerFragment on OrgBanner {
    id
    orgId
    slug
    additionalData {
      command
      position
    }
  }
`;
