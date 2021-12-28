export interface IUser {
	avatar: {
		id: string
		isOwnerOfPod: boolean
	}
	id: string
	initials: string
	name: string
}

export interface ITask {
	actions: {
		comments: number
		likes: number
		shares: number
	}
	compensation?: {
		amount: number | string
		currency: string
	}
	description: string
	id: number | string
	media: {
		id: string
		type: string
		url: string
	}
	priority: number
	status: string
	title: string
	users?: Array<IUser>
}
