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
  mutation connectDiscordToCmtyOrg($orgId: ID!, $guildId: String!, $code: String) {
    connectDiscordToCmtyOrg(orgId: $orgId, guildId: $guildId, code: $code) {
      success
    }
  }
`;

export const CREATE_ORG = gql`
  mutation createOrg($input: OrgInput) {
    createOrg(input: $input) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const CREATE_ORG_INVITE_LINK = gql`
  mutation createOrgInviteLink($input: OrgInviteLinkInput) {
    createOrgInviteLink(input: $input) {
      token
    }
  }
`;



export const REDEEM_ORG_INVITE_LINK = gql`
  mutation redeemOrgInviteLink($token: String!) {
    redeemOrgInviteLink(token: $token) {
      success
    }
  }
`;
