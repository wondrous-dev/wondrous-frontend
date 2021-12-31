export const spacingUnit = 8

// Task Status
export const TASK_STATUS_IN_PROGRESS = 'IN_PROGRESS'
export const TASK_STATUS_TODO = 'TODO'
export const TASK_STATUS_IN_REVIEW = 'IN_REVIEW'
export const TASK_STATUS_DONE = 'DONE'
export const TASK_STATUS_REQUESTED = 'REQUESTED'
export const TASK_STATUS_ARCHIVED = 'ARCHIVED'

// Max avatar user list count
export const AVATAR_LIST_OVERFLOW_MAX = 5

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

export const SUPPORTED_CURRENCIES = [
	{ 
		symbol: 'ETH',
		chains: [1] 
	},
	{ 
		symbol: 'MATIC',
		chains: [137] 
	},
	{ 
		symbol: 'WONDER',
		chains: [1, 137], 
		contracts: { 
			1: '', 
			137: '' 
		} 
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
