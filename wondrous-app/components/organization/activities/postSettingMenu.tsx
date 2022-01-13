import React, { useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core'

import DotsIcon from '../../Icons/dots'

import { PostSetting } from './styles'

const PostSettingIcon = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
	const open = Boolean(anchorEl)
	const handleClose = () => {
		setAnchorEl(null)
	}
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	return (
		<>
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
		</>
	)
}

export default PostSettingIcon
