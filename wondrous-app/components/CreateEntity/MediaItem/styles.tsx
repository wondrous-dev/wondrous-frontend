import { Typography } from '@material-ui/core'
import styled from 'styled-components'
import { White } from '../../../theme/colors'

export const MediaItemWrapper = styled.div`
	background: #0f0f0f;
	border-radius: 4px;
	position: relative;
	margin-right: 8px;
	display: flex;
	align-items: center;
	width: fit-content;
	padding-right: 8px;
	margin-bottom: 8px;
`

export const Filename = styled(Typography)`
	&& {
		font-size: 14px;
		color: ${White};
		margin-right: 8px;
		margin-left: 8px;
	}
`
