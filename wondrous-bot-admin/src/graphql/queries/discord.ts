import { gql } from "@apollo/client"
export const GET_ORG_DISCORD_ROLES = gql`
	# get all discord roles associated with the guilds that org is connected to
	query getCmtyOrgDiscordRoles($orgId: ID!) {
		getCmtyOrgDiscordRoles(orgId: $orgId) {
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
`

export const GET_GUILD_DISCORD_CHANNELS = gql`
	# get all discord roles associated with the guilds that org is connected to
	query getAvailableChannelsForDiscordGuild($guildId: String) {
		getAvailableChannelsForDiscordGuild(guildId: $guildId) {
			id
			name
		}
	}
`
