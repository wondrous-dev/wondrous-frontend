import React from 'react'
import styled from 'styled-components'
import { IconButton, InputAdornment, InputBase } from '@material-ui/core'
import { White } from '../../../theme/colors'

export const SearchInputBlock = styled.div`
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	background: #0f0f0f;
	border-radius: 6px;
	margin-bottom: ${(props) => (props.margin ? '28px' : '0')};
`

export const SearchInput = styled(InputBase)`
	&& {
		width: 100%;
		height: 100%;
		padding-left: 10px;
		display: flex;
		align-items: center;

		//text
		font-size: 14px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: ${White};
	}
`

export const SearchInputIcon = styled(InputAdornment)`
	&& {
	}
`

export const SearchInputIconButton = styled(IconButton)`
	&& {
	}
`
