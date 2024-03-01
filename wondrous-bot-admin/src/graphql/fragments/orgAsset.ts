import { gql } from "@apollo/client";

export const OrgBannersFragment = gql`
  fragment OrgBannersFragment on OrgBanner {
    id
    url
    command
    position
  }
`;
