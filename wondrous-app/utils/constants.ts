export const spacingUnit = 8

// Task Status
export const TASK_STATUS_IN_PROGRESS = 'in_progress'
export const TASK_STATUS_TODO = 'created'
export const TASK_STATUS_IN_REVIEW = 'in_review'
export const TASK_STATUS_DONE = 'completed'
export const TASK_STATUS_REQUESTED = 'REQUESTED'
export const TASK_STATUS_ARCHIVED = 'archived'

// Max avatar user list count
export const AVATAR_LIST_OVERFLOW_MAX = 5
export const AVATAR_LIST_LARGE_OVERFLOW_MAX = 2

// Social media
export const SOCIAL_MEDIA_FACEBOOK = 'facebook'
export const SOCIAL_MEDIA_TWITTER = 'twitter'
export const SOCIAL_MEDIA_LINKEDIN = 'linkedin'
export const SOCIAL_MEDIA_DISCORD = 'discord'

// Supported Chains (ETHEREUM, POLYGON)
export const SUPPORTED_CHAINS = {
	1: 'ETH',
	137: 'MATIC',
}

export const CHAIN_IDS = {
	ETH: 1,
	MATIC: 137,
}

export const SUPPORTED_CURRENCIES = [
	{
		symbol: 'ETH',
		chains: [1],
	},
	{
		symbol: 'MATIC',
		chains: [137],
	},
	{
		symbol: 'WONDER',
		chains: [1, 137],
		contracts: {
			1: '',
			137: '',
		},
	},
	{
		symbol: 'USDC',
		chains: [1, 137],
		contracts: {
			1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
		},
	},
]

export const CURRENCY_KEYS = {
	ETH: 'ETH',
	WONDER: 'WONDER',
	MATIC: 'MATIC',
	USDC: 'USDC',
}

export const SIDEBAR_WIDTH = '80px'
export const ENTITIES_TYPES = {
	TASK: 'task',
	MILESTONE: 'milestone',
	POD: 'pod',
	DAO: 'dao',
}

export const MEDIA_TYPES = {
	IMAGE: 'image',
	TEXT: 'text',
	AUDIO: 'audio',
	CODE: 'code',
	LINK: 'link',
	VIDEO: 'video',
}

export const DEFAULT_STATUS_ARR = [
	'created',
	'in_progress',
	'in_review',
	'completed',
	'archived',
]
