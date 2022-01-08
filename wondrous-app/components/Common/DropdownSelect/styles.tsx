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
		padding: '0 15px',

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

		font-size: 14px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #c4c4c4;
	}
`

export const CreateFormSelectArrowIcon = styled(SelectDownIcon)``

export const CreateFormMenuItem = styled(MenuItem)`
	&& {
		font-size: 14px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #c4c4c4;

		& span {
			margin-left: 5px;
			opacity: 0.5;
		}
	}
`
