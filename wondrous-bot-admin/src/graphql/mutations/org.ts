import {gql} from '@apollo/client'
import { OrgFragment } from 'graphql/fragments/org';

export const UPDATE_ORG = gql`
  mutation updateOrg($orgId: ID!, $input: OrgInput) {
    updateOrg(orgId: $orgId, input: $input) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;


export const CONNECT_DISCORD_TO_CMTY_ORG = gql`
  mutation connectDiscordToCmtyOrg($orgId: ID!, $guildId: String!) {
    connectDiscordToCmtyOrg(orgId: $orgId, guildId: $guildId) {
      success
    }
  }
`;