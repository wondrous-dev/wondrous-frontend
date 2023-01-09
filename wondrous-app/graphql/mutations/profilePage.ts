import { gql } from '@apollo/client';

export const UPSERT_ORG_PROFILE_PAGE = gql`
  mutation upsertOrgProfileLayout($input: LayoutInput!) {
    upsertOrgProfileLayout(input: $input)
  }
`;

export const UPSERT_POD_PROFILE_PAGE = gql`
  mutation upsertPodProfileLayout($input: LayoutInput!) {
    upsertPodProfileLayout(input: $input)
  }
`;
