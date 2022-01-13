import React from 'react'

import {
	PostAuthor,
	PostAuthorNickname,
	PostAuthorPhoto,
	PostAuthorText,
	PostBlock,
	PostContent,
	PostAuthorPlaceHolder,
} from './styles'
import PostSettingIcon from './postSettingMenu'
import { PostSubtitle } from './postSubtitle'
import PostActivityIcon from './postActivityIcon'

const PostActivityContent = ({ post }) => {
	const {
		item_content,
		actor_username,
		actor_profile_picture,
		verb,
		object_type,
	} = post

	return (
		<PostContent>
			<PostBlock quoted>
				<PostSettingIcon />
				<PostAuthor>
					<PostAuthorPlaceHolder>
						<PostAuthorPhoto src={actor_profile_picture} />
					</PostAuthorPlaceHolder>
					<PostAuthorNickname>{actor_username}</PostAuthorNickname>
					<PostSubtitle verb={verb} object_type={object_type} />
				</PostAuthor>
				<PostAuthorText>{item_content}</PostAuthorText>
			</PostBlock>
			<PostBlock>
				<PostAuthor>
					<PostAuthorPlaceHolder>
						<PostActivityIcon verb={verb} />
					</PostAuthorPlaceHolder>
					Lorem ipsum dolor sit amet
				</PostAuthor>
			</PostBlock>
		</PostContent>
	)
}

export default PostActivityContent
