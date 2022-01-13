import React from 'react'

import PostCard from './post'
import Posts from './data'
import Wrapper from '../wrapper/wrapper'

const Activities = () => {
	const source = {
		name: 'Wonder',
		icon: '/images/wonder-token.png',
	}

	return (
		<Wrapper>
			{Posts.map((post) => (
				<PostCard key={post.id} source={source} post={post} />
			))}
		</Wrapper>
	)
}

export default Activities
