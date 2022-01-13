import React from 'react'

import {
	PostAuthor,
	PostAuthorNickname,
	PostAuthorSubtitle,
	PostBlock,
	PostTaskContent,
	PostTaskText,
	PostTaskTextBlock,
	PostTaskTitle,
	PostContent,
	PostAuthorPlaceHolder,
	PostTaskHeaderLogo,
} from './styles'
import PostSettingIcon from './postSettingMenu'
import PostMedia from './postMedia'

const PostAnnouncementContent = ({ source, post }) => {
	const { item_name, item_content, media } = post

	return (
		<PostContent>
			<PostBlock>
				<PostSettingIcon />
				<PostAuthor>
					<PostAuthorPlaceHolder>
						<PostTaskHeaderLogo />
					</PostAuthorPlaceHolder>
					<PostAuthorNickname>{source.name}</PostAuthorNickname>
					<PostAuthorSubtitle>made an announcement</PostAuthorSubtitle>
				</PostAuthor>
			</PostBlock>
			<PostTaskContent>
				<PostTaskTextBlock>
					<PostTaskTitle>{item_name}</PostTaskTitle>
					<PostTaskText>{item_content}</PostTaskText>
				</PostTaskTextBlock>
				<PostMedia media={media} />
			</PostTaskContent>
		</PostContent>
	)
}

export default PostAnnouncementContent
