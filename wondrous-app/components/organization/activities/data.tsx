import * as Constants from '../../../utils/constants'

const AnnoucementPost = {
	id: '0',
	post_type: Constants.POST_TYPES.ANNOUNCEMENT,
	item_name: 'Behold! This is an announcement',
	item_content:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	media: [
		{
			type: 'image',
			url: '/images/overview/graphs.png',
		},
		{
			type: 'image',
			url: '/images/overview/graphs.png',
		},
	],
}

const ActivityPost = {
	id: '1',
	post_type: Constants.POST_TYPES.ACTIVITY,
	actor_username: '0xAndros',
	actor_profile_picture: '/images/overview/postAuthor.png',
	verb: Constants.VERBS.COMPLETE,
	object_type: Constants.OBJECT_TYPE.TASK,
	object_id: '123',
	additional_data: {
		text: 'This is the task name',
	},
}

const AwardPost = {
	id: '2',
	post_type: Constants.POST_TYPES.QUOTE,
	actor_username: '0xAndros',
	actor_profile_picture: '/images/overview/postAuthor.png',
	verb: Constants.VERBS.AWARD,
	object_type: Constants.OBJECT_TYPE.KUDOS,
	item_content: "it's lit",
	referenced_object: {
		actor_username: 'Mia Elekai',
		actor_profile_picture: '/images/overview/postAuthor2.png',
		title: 'Complete investment deck',
		item_content:
			'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
		verb: Constants.VERBS.COMPLETE,
		object_type: Constants.OBJECT_TYPE.TASK,
		object_id: '123',
		media: [
			{
				type: 'video',
				url: 'https://www.youtube.com/watch?v=HmpP7e9gLYs',
			},
		],
	},
}

const ActivityPost2 = {
	id: '3',
	post_type: Constants.POST_TYPES.ACTIVITY,
	actor_username: '0xAndros',
	actor_profile_picture: '/images/overview/postAuthor.png',
	verb: Constants.VERBS.CREATE,
	object_type: Constants.OBJECT_TYPE.TASK,
	object_id: '123',
	additional_data: {
		text: 'This is the task name',
	},
}

const AwardPost2 = {
	id: '4',
	post_type: Constants.POST_TYPES.QUOTE,
	actor_username: '0xAndros',
	actor_profile_picture: '/images/overview/postAuthor.png',
	item_content: 'Thanks for create the task!',
	referenced_object: {
		actor_username: 'Mia Elekai',
		actor_profile_picture: '/images/overview/postAuthor2.png',
		title: 'Complete investment deck',
		item_content:
			'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
		verb: Constants.VERBS.CREATE,
		object_type: Constants.OBJECT_TYPE.TASK,
		object_id: '123',
		media: [
			{
				type: 'image',
				url: '/images/overview/graphs.png',
			},
		],
	},
}

const AnnoucementPost2 = {
	id: '5',
	post_type: Constants.POST_TYPES.ANNOUNCEMENT,
	item_name: 'Behold! This is an announcement',
	item_content:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	media: [
		{
			type: 'video',
			url: 'https://www.youtube.com/watch?v=HmpP7e9gLYs',
		},
	],
}

const Posts = [
	AnnoucementPost,
	ActivityPost,
	AwardPost,
	ActivityPost2,
	AwardPost2,
	AnnoucementPost2,
]

export default Posts
