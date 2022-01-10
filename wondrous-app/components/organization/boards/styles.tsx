import React from 'react'
import styled from 'styled-components'
import { MenuItem, TextField } from '@material-ui/core'

export const BoardsContainer = styled.div`
	width: 100%;
	height: 100%;
	margin-top: 22px;
`

export const BoardsActivity = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	max-width: 1038px;
	margin: 0 auto;
`

export const BoardsActivityInput = styled(TextField)({
	'&.MuiTextField-root': {
		width: '100%',
		maxWidth: '100%',
		height: 40,
		backgroundColor: '#0F0F0F',
		borderRadius: 6,
		padding: 10,
		display: 'flex',
		justifyContent: 'center',
		border: '1px solid #4B4B4B',
		marginRight: '8px',
	},
	'& .MuiInputBase-input': {
		fontSize: 14,
		lineHeight: 19,
		letterSpacing: '0.01em',
		color: '#C4C4C4',
	},
	'& .MuiInput-underline:before': {
		display: 'none',
	},
	'& .MuiInput-underline:after': {
		display: 'none',
	},
})

export const BoardsActivityFilterMenuItem = styled(MenuItem)`
	background-color: blue;
	border-radius: 4px;
`
