import React from 'react'
import styled from 'styled-components'
import { AppBar, Badge, Button, IconButton, TextField } from '@material-ui/core'
import {Logo} from "../Common/ci";

export const Header = styled(AppBar)`
	&& {
		height: 70px;
		background: #141414;
		display: flex;
		align-items: center;
		//padding: 15px 20px;
		//display: flex;
		//justify-content: space-between;
		//align-items: center;
		z-index: 200;
		border-bottom: 2px solid rgba(75, 75, 75, 0.5);
	}
`

export const HeaderContainer = styled.div`
	//max-width: 1388px;
	padding: 15px 20px;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 auto;
`

export const HeaderLeftBlock = styled.div`
	max-width: 440px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const HeaderLogo = styled(Logo)`
	width: 41px;
	height: 31px;
`

export const HeaderHomeButton = styled(IconButton)`
	&& {
		background: #363636;
		border-radius: 4px;
		width: 40px;
		height: 40px;
		border: 1px solid deepskyblue;
	}
`

export const HeaderInput = styled(TextField)({
	'&.MuiTextField-root': {
		width: 310,
		maxWidth: '100%',
		height: 40,
		backgroundColor: '#0F0F0F',
		borderRadius: 6,
		padding: 10,
		display: 'flex',
		justifyContent: 'center',
	},
	'& .MuiInputBase-input': {
		fontSize: 14,
		lineHeight: 19,
		letterSpacing: '0.01em',
		color: '#C4C4C4',
	},
	'& .MuiInput-underline:after': {
		borderBottom: '2px solid violet',
	},
})

export const HeaderRightBlock = styled.div`
	max-width: 171px;
	width: 100%;
	display: flex;
	justify-content: space-between;
`

export const HeaderNotificationsButton = styled(IconButton)`
	&& {
		width: 40px;
		height: 40px;
		background: #1e1e1e;
		border-radius: 4px;
	}
`

export const StyledBadge = styled(Badge)({
	'& .MuiBadge-badge': {
		minWidth: 16,
		fontWeight: 500,
		fontSize: 8,
		lineHeight: 10,
		color: '#FFFFFF',
	},
	'& .MuiBadge-anchorOriginTopRightRectangle': {
		top: 5,
		right: 5,
		height: 16,
		width: 16,
		backgroundColor: '#FF5C00',
	},
})

export const HeaderCreateButton = styled(Button)`
	&& {
		width: 110px;
		height: 44px;
		border: 2px solid deepskyblue;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 1px;
		padding-top: 4px;

		//text
		font-weight: 500;
		font-size: 16px;
		line-height: 150%;
		color: #ffffff;
	}
`
