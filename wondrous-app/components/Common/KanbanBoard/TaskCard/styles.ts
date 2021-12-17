import {Card, IconButton, Typography} from "@material-ui/core";
import {LogoSquare} from "../../ci";
import UserAvatar from "../../../Icons/userAvatar";
import styled from "styled-components";

export const TaskCardWrapper = styled(Card)({
  '&.MuiCard-root': {
    width: '100%',
    minHeight: 273,
    background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 100%)',
    borderRadius: 6,
    padding: 15,
    marginTop: 30,
  },
})

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