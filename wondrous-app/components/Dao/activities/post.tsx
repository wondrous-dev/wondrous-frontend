import React, { useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core'

import DotsIcon from '../../Icons/dots'
import { LogotypeWithText } from '../../Common/ci'

import {
	PostLeftImage,
	PostAuthor,
	PostAuthorNickname,
	PostAuthorPhoto,
	PostAuthorText,
	PostBlock,
	PostComponent,
	PostTask,
	PostTaskContent,
	PostTaskHeader,
	PostTaskHeaderAuthor,
	PostTaskHeaderAuthorNickname,
	PostTaskHeaderImage,
	PostTaskHeaderText,
	PostTaskImage,
	PostTaskImageBlock,
	PostTaskText,
	PostTaskTextBlock,
	PostTaskTitle,
	PostActivity,
	PostLikes,
	PostComments,
	PostShares,
	PostSetting,
	PostsContainer, PostTaskHeaderLogo
} from './styles'
import { CardHeaderCategory } from '../../CardHeaderCategory'
import LikeIcon from '../../Icons/like'
import CommentsIcon from '../../Icons/comments'
import ShareIcon from '../../Icons/share'
import {TASK_STATUS_DONE} from "../../../utils/constants";

const PostCard = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
	const open = Boolean(anchorEl)
	const handleClose = () => {
		setAnchorEl(null)
	}
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	return (
		<PostsContainer>
			<PostComponent>
				<PostBlock>
					<PostSetting
						id="basic-button"
						aria-controls="basic-menu"
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClick}
					>
						<DotsIcon />
					</PostSetting>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}
					>
						<MenuItem onClick={handleClose}>Edit</MenuItem>
						<MenuItem onClick={handleClose}>Share</MenuItem>
						<MenuItem onClick={handleClose}>Delete</MenuItem>
					</Menu>

					<PostAuthor>
						<PostAuthorPhoto src="/images/overview/postAuthor.png" />
						<PostAuthorNickname>0xAndros</PostAuthorNickname>
					</PostAuthor>
					<PostAuthorText>
						Mia absolutely killed the pitch deck. We had investors comment on
						how clean all of the data is. Great work!
					</PostAuthorText>
				</PostBlock>
				<PostTask>
					<PostTaskHeader>
						<PostTaskHeaderAuthor>
							<PostTaskHeaderLogo />
							<PostTaskHeaderImage src="/images/overview/postAuthor2.png" />
							<PostTaskHeaderText>
								<PostTaskHeaderAuthorNickname>
									Mia Elekai
								</PostTaskHeaderAuthorNickname>
								completed a task
							</PostTaskHeaderText>
						</PostTaskHeaderAuthor>

						<CardHeaderCategory
							compensation={{ amount: 3200, currency: 'wonder' }}
							status={TASK_STATUS_DONE}
						/>

					</PostTaskHeader>
					<PostTaskContent>
						<PostTaskTextBlock>
							<PostTaskTitle>Complete investment deck</PostTaskTitle>
							<PostTaskText>
								Maecenas hendrerit porttitor integer viverra lorem metus et in.
							</PostTaskText>
						</PostTaskTextBlock>
						<PostTaskImageBlock>
							<PostLeftImage>
								<LogotypeWithText
									width={256}
									height={132}
								/>
							</PostLeftImage>
							<PostTaskImage src="/images/overview/graphs.png" />
						</PostTaskImageBlock>
					</PostTaskContent>
				</PostTask>
				<PostActivity>
					<PostLikes>
						<LikeIcon />
						54
					</PostLikes>
					<PostComments>
						<CommentsIcon />
						23
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