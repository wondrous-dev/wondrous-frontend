import React from 'react'
import styled from 'styled-components'
import { InputLabel, MenuItem, Select, Typography } from '@material-ui/core'
import SelectDownIcon from '../../Icons/selectDownIcon'

export const CreateFormSelectBlock = styled.div`
	max-width: 260px;
	width: 100%;
	height: 70px;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
`

export const CreateFormSelectBlockTitle = styled(Typography)`
	&& {
		font-weight: 500;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.01em;
		color: #ccbbff;
		margin-bottom: 0;
	}
`

export const CreateFormInputLabel = styled(InputLabel)({
	'&.MuiFormLabel-root': {
		fontSize: 14,
		lineHeight: '19px',
		letterSpacing: '0.01em',
		color: '#C4C4C4',
		zIndex: 10,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '4px 15px',

		'& svg': {
			marginRight: 7,
		},
	},

	'&.MuiInputLabel-animated': {
		color: '#C4C4C4 !important',
	},
})

export const CreateFormSelect = styled(Select)`
	&& {
		background: #0f0f0f;
		border-radius: 6px;
		width: 100%;
		height: 40px;
		padding: 0 15px;
		position: relative;
		font-size: 14px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #c4c4c4;
		margin-top: 20px;
		.MuiSelect-select.MuiSelect-select {
			display: flex;
			align-items: center;
		}

		svg {
			color: #c4c4c4;
		}
	}
`

export const CreateFormSelectArrowIcon = styled(SelectDownIcon)`
	&& {
		cursor: pointer;
	}
`

export const CreateFormMenuItem = styled(MenuItem)`
	&& {
		font-size: 14px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #c4c4c4;
		display: flex;
		align-items: center;
		& span {
			margin-left: 5px;
			opacity: 0.5;
		}
	}
`

export const CreateFormMenuItemIcon = styled.div`
	display: flex;
	margin: 0 8px 0 0;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`
