import { Card, IconButton, Typography } from '@material-ui/core'
import { LogoSquare } from '../../ci'
import UserAvatar from '../../../Icons/userAvatar'
import styled from 'styled-components'

export const TaskCardWrapper = styled(Card)`
	&.MuiCard-root {
		width: 100%;
		min-height: 273px;
		background: linear-gradient(
			169.47deg,
			rgba(75, 75, 75, 0.6) 7.84%,
			rgba(35, 35, 35, 0.6) 108.71%
		);
		border-radius: 6px;
		padding: 15px;
		margin-top: 30px;
		position: relative;
		z-index: 1;
	}

	&.MuiCard-root:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: 0.05em;
		z-index: -1;
		border-radius: inherit;
		background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
	}
`

export const TaskCardHeader = styled.div`
	width: 100%;
	min-height: 30px;
	height: 30px;
	display: flex;
`

export const TaskCardLogo = styled(LogoSquare)`
  width: 48px;
  height: 27px;
`

export const TaskCardContent = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
	margin: 20px 0;
`

export const TaskCardContentTitle = styled(Typography)`
	&& {
		width: 100%;
		font-weight: bold;
		font-size: 16px;
		line-height: 20px;
		color: #ffffff;
	}
`

export const TaskCardContentText = styled(Typography)`
	&& {
		font-size: 14px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #c4c4c4;
		margin: 12px 0;
	}
`

export const TaskCardFooter = styled.div`
	width: 100%;
	height: 25px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const TaskCardFooterActivity = styled.div`
	max-width: 185px;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const TaskCardFooterLike = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
`

export const TaskCardFooterLikeCount = styled(Typography)`
	&& {
		margin-left: 10px;
		font-weight: 500;
		font-size: 13px;
		line-height: 17px;
		color: #ffffff;
	}
`

export const TaskCardFooterComment = styled(TaskCardFooterLike)``
export const TaskCardFooterCommentCount = styled(TaskCardFooterLikeCount)``

export const TaskCardFooterShare = styled(TaskCardFooterLike)``
export const TaskCardFooterShareCount = styled(TaskCardFooterLikeCount)``

export const TaskCardFooterSettings = styled(IconButton)`
	&& {
		width: 24px;
		height: 24px;
		background-color: #0f0f0f;
		padding: 0;
	}
`
