import React from 'react'

import {
	PostAuthor,
	PostAuthorNickname,
	PostAuthorPhoto,
	PostAuthorText,
	PostBlock,
	PostTask,
	PostTaskContent,
	PostTaskHeader,
	PostTaskHeaderAuthor,
	PostTaskHeaderAuthorNickname,
	PostTaskHeaderImage,
	PostTaskHeaderText,
	PostTaskText,
	PostTaskTextBlock,
	PostTaskTitle,
	PostTaskHeaderLogo,
	PostContent,
	PostAuthorPlaceHolder,
} from './styles'
import { CardHeaderCategory } from '../../CardHeaderCategory'
import { TASK_STATUS_DONE } from '../../../utils/constants'
import PostSettingIcon from './postSettingMenu'
import { PostSubtitle } from './postSubtitle'
import PostMedia from './postMedia'

const PostQuoteContent = ({ post }) => {
	const {
		item_content,
		actor_username,
		actor_profile_picture,
		verb,
		object_type,
		referenced_object,
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
			<PostTask>
				<PostTaskHeader>
					<PostTaskHeaderAuthor>
						<PostTaskHeaderLogo />
						<PostTaskHeaderImage
							src={referenced_object.actor_profile_picture}
						/>
						<PostTaskHeaderText>
							<PostTaskHeaderAuthorNickname>
								{referenced_object.actor_username}
							</PostTaskHeaderAuthorNickname>
							<PostSubtitle
								verb={referenced_object.verb}
								object_type={referenced_object.object_type}
							/>
						</PostTaskHeaderText>
					</PostTaskHeaderAuthor>

					<CardHeaderCategory
						compensation={{ amount: 3200, currency: 'wonder' }}
						status={TASK_STATUS_DONE}
					/>
				</PostTaskHeader>
				<PostTaskContent>
					<PostTaskTextBlock>
						<PostTaskTitle>{referenced_object.title}</PostTaskTitle>
						<PostTaskText>{referenced_object.item_content}</PostTaskText>
					</PostTaskTextBlock>
					<PostMedia media={referenced_object.media} />
				</PostTaskContent>
			</PostTask>
		</PostContent>
	)
}

export default PostQuoteContent
