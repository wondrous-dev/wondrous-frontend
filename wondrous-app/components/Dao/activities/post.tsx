import React, { useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core'

import CheckedIcon from '../../Icons/checkedIcon'
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
	PostTaskHeaderButton,
	PostTaskHeaderButtonImg,
	PostTaskHeaderButtons,
	PostTaskHeaderCheckedButton,
	PostTaskHeaderCheckedIcon,
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
	PostActivityIcon,
	PostSetting,
} from './styles'

export const PostCard = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
	const open = Boolean(anchorEl)
	const handleClose = () => {
		setAnchorEl(null)
	}
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	return (
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
					Mia absolutely killed the pitch deck. We had investors comment on how
					clean all of the data is. Great work!
				</PostAuthorText>
			</PostBlock>
			<PostTask>
				<PostTaskHeader>
					<PostTaskHeaderAuthor>
						<PostTaskHeaderImage src="/images/overview/logoSquare.png" />
						<PostTaskHeaderImage src="/images/overview/postAuthor2.png" />
						<PostTaskHeaderText>
							<PostTaskHeaderAuthorNickname>
								Mia Elekai
							</PostTaskHeaderAuthorNickname>
							completed a task
						</PostTaskHeaderText>
					</PostTaskHeaderAuthor>
					<PostTaskHeaderButtons>
						<PostTaskHeaderCheckedButton>
							<PostTaskHeaderCheckedIcon />
						</PostTaskHeaderCheckedButton>
						<PostTaskHeaderButton>
							<PostTaskHeaderButtonImg src="/images/overview/rhombus.png" />
							2.1k
						</PostTaskHeaderButton>
					</PostTaskHeaderButtons>
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
					<PostActivityIcon src="/images/overview/like.png" alt="" />
					54
				</PostLikes>
				<PostComments>
					<PostActivityIcon src="/images/overview/comments.png" alt="" />
					23
				</PostComments>
				<PostShares>
					<PostActivityIcon src="/images/overview/share.png" alt="" />
					12
				</PostShares>
			</PostActivity>
		</PostComponent>
	)
}
