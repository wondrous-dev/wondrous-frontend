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

export const GET_DISCORD_ROLE_INFO = gql`
	query getDiscordRoleInfo($discordGuildId: String!, $discordRoleId: String!) {
		getDiscordRoleInfo(discordGuildId: $discordGuildId, discordRoleId: $discordRoleId) {
			name
			id
			color
		}
	}
`;


export const GET_GUILD_EVENTS = gql`
	query getGuildEvents($guildId: String!) {
		getGuildEvents(guildId: $guildId) {
			eventId
			eventName
			description
			startTime
			endTime
			status
			guildId
			channelId
		}
	}
`


export const GET_GUILD_EVENT = gql`
	query getGuildEvent($eventId: String!) {
		getGuildEvent(eventId: $eventId) {
			eventId
			eventName
			description
			startTime
			endTime
			status
			guildId
			channelId
		}
	}
`
