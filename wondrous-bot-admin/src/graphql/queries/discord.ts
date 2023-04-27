import { gql } from '@apollo/client';
export const GET_ORG_DISCORD_ROLES = gql`
  # get all discord roles associated with the guilds that org is connected to
  query getOrgDiscordRoles($orgId: ID!) {
    getOrgDiscordRoles(orgId: $orgId) {
      guildId
      guildInfo {
        guildName
      }
      roles {
        id
        name
        color
        permissions
      }
    }
  }
`;
