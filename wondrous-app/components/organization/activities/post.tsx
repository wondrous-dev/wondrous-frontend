import React from 'react'

import {
	PostComponent,
	PostActivity,
	PostLikes,
	PostComments,
	PostShares,
	PostsContainer,
} from './styles'
import LikeIcon from '../../Icons/like'
import CommentsIcon from '../../Icons/comments'
import ShareIcon from '../../Icons/share'
import { POST_TYPES } from '../../../utils/constants'
import PostAnnouncementContent from './postAnnouncementContent'
import PostQuoteContent from './postQuoteContent'
import PostActivityContent from './postActivityContent'

const PostCard = ({ source, post }) => {
	const { post_type, comment_count = 0, reaction_count = 0 } = post

	const postContentComponents = {
		[POST_TYPES.ANNOUNCEMENT]: (
			<PostAnnouncementContent source={source} post={post} />
		),
		[POST_TYPES.QUOTE]: <PostQuoteContent post={post} />,
		[POST_TYPES.ACTIVITY]: <PostActivityContent post={post} />,
	}
	const postContent = postContentComponents[post_type] || <></>

	const outlinedStyle = post_type == POST_TYPES.ACTIVITY

	return (
		<PostsContainer>
			<PostComponent outlined={outlinedStyle}>
				{postContent}
				<PostActivity>
					<PostLikes>
						<LikeIcon />
						{reaction_count}
					</PostLikes>
					<PostComments>
						<CommentsIcon />
						{comment_count}
					</PostComments>
					<PostShares>
						<ShareIcon />
						12
					</PostShares>
				</PostActivity>
			</PostComponent>
		</PostsContainer>
	)
}

export default PostCard
