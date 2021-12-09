import React from 'react'
import styled from 'styled-components'
import { Button, IconButton, Tabs, Typography } from '@material-ui/core'
import { Black80 } from '../../services/colors'

export const OverviewComponent = styled.section`
	width: 100vw;
	height: 100%;
	//background-color: ${Black80};
	background-color: #0f0f0f;
`

export const HeaderImage = styled.div`
	width: 100%;
	height: 220px;
	background-image: url('/images/overview/background.png');
	//background-repeat: no-repeat;
	background-position: center;
	margin-top: 70px;
`
export const TokenHeader = styled.div`
	position: relative;
	max-width: 680px;
	width: 100%;
	min-height: 190px;
	height: 190px;
	padding-top: 65px;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	//background-color: red;
`

export const TokenLogo = styled.img`
	position: absolute;
	width: 103px;
	height: 103px;
	top: -50px;
	left: -20px;
`

export const Content = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
`

export const ContentContainer = styled.div`
	max-width: 680px;
	width: 100%;
`

export const HeaderMainBlock = styled.div`
	width: 100%;
	min-height: 40px;
	height: 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const HeaderTitle = styled(Typography)`
	&& {
		font-weight: 500;
		font-size: 28px;
		line-height: 36px;
		display: flex;
		align-items: center;
		color: #ffffff;
		text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	}
`

export const HeaderButtons = styled.div`
	max-width: 252px;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	//background-color: green;
`

export const HeaderFollowButton = styled(Button)`
	&& {
		width: 100px;
		height: 40px;
		filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
		border-radius: 204px;
		border: 1px solid deepskyblue;
	}
`

export const HeaderFollowButtonText = styled(Typography)`
	&& {
		font-weight: 500;
		font-size: 16px;
		line-height: 150%;
		display: flex;
		align-items: center;
		color: #ffffff;
	}
`

export const HeaderFollowButtonIcon = styled.img`
	width: 22px;
	height: 22px;
`

export const HeaderContributeButton = styled(Button)`
	&& {
		background: linear-gradient(
			267.08deg,
			#ccbbff -2.92%,
			#7427ff 81.21%,
			#00baff 174.59%
		);
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		border-radius: 204px;
		padding: 8px 10px;
		width: 135px;
		height: 40px;

		//button text
		font-weight: 500;
		font-size: 16px;
		line-height: 150%;
		display: flex;
		align-items: center;
		text-align: center;
		color: #ffffff;
	}
`

export const HeaderText = styled(Typography)`
	&& {
		font-size: 15px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #ffffff;
	}
`

export const HeaderActivity = styled.div`
	max-width: 390px;
	width: 100%;
	min-height: 23px;
	height: 23px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	//background-color: blue;
`

export const HeaderActivityLink = styled.a`
	font-weight: 500;
	font-size: 16px;
	line-height: 16px;
	display: flex;
	align-items: center;
	text-decoration-line: underline;
	color: #ccbbff;
	text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

export const HeaderActivityLinkIcon = styled.img`
	width: 14px;
	height: 14px;
	margin-right: 8px;
`

export const HeaderContributors = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
`

export const HeaderContributorsAmount = styled(Typography)`
	&& {
		font-weight: 500;
		font-size: 15px;
		line-height: 150%;
		display: flex;
		align-items: center;
		color: #ffffff;
		text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		margin-right: 5px;
	}
`

export const HeaderContributorsText = styled(HeaderContributorsAmount)`
	color: #6c6c6c;
`

export const HeaderPods = styled(HeaderContributors)``

export const HeaderPodsAmount = styled(HeaderContributorsAmount)``

export const HeaderPodsText = styled(HeaderContributorsAmount)`
	color: #6c6c6c;
`

//tabs
export const StyledTabs = styled((props) => (
	<Tabs
		{...props}
		TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
	/>
))({
	'&.MuiTabs-root': {
		marginTop: 30,
		width: '100%',
	},
	'& .MuiTabs-flexContainer': {
		display: 'flex',
		justifyContent: 'space-between',
	},
	'& .MuiButtonBase-root': {
		position: 'relative',
		width: 210,
		borderBottom: '2px solid #4B4B4B',

		//text
		fontWeight: 600,
		fontSize: '16px',
		lineHeight: '19px',
		textAlign: 'center',
		color: '#FFFFFF',
	},
	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	'& .MuiTabs-indicatorSpan': {
		maxWidth: 210,
		width: '100%',
		backgroundColor: '#7427FF',
	},
})

//cardStyles
export const PostComponent = styled.div`
	margin-top: 22px;
	width: 100%;
	height: 540px;
	padding: 18px 28px;
	background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
	border-radius: 6px;
`

export const PostBlock = styled.div`
	position: relative;
	padding: 0 26px 18px;
	border-left: 1px solid #4b4b4b;
`

export const PostSetting = styled(IconButton)`
	&& {
		position: absolute;
		right: -12px;
		top: -4px;
		width: 24px;
		height: 24px;
		background: #0f0f0f;
		padding: 0;
	}
`

export const PostAuthor = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	//background-color: blue;
`

export const PostAuthorPhoto = styled.img`
	position: absolute;
	left: -40px;
	width: 28px;
	height: 28px;
	margin-right: 10px;
`

export const PostAuthorNickname = styled(Typography)`
	&& {
		font-weight: bold;
		font-size: 16px;
		line-height: 20px;
		color: #ffffff;
	}
`

export const PostAuthorText = styled(Typography)`
	&& {
		font-size: 14px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #c4c4c4;
	}
`

export const PostTask = styled.div`
	max-width: 625px;
	width: 100%;
	padding: 14px 14px 18px;

	border: 1px solid #4b4b4b;
	border-top-right-radius: 6px;
	border-bottom-left-radius: 6px;
	border-bottom-right-radius: 6px;
`

export const PostTaskHeader = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const PostTaskHeaderText = styled(PostAuthorText)`
	display: flex;
	align-items: flex-end;
	max-width: 380px;
	width: 100%;
`

export const PostTaskHeaderAuthor = styled(PostAuthor)`
	display: flex;
	justify-content: space-between;
	max-width: 460px;
	width: 100%;
`

export const PostTaskHeaderAuthorNickname = styled(PostAuthorNickname)`
	padding-right: 5px;
`

export const PostTaskHeaderImage = styled.img`
	width: 28px;
	height: 28px;
`

export const PostTaskHeaderButtons = styled.div`
	max-width: 90px;
	width: 100%;
	display: flex;
	align-items: center;
`

export const PostTaskHeaderCheckedButton = styled(IconButton)`
	&& {
		width: 28px !important;
		height: 28px !important;
		background-color: #0f0f0f;
		border: 1px solid #474747;
		padding: 0;
	}
`

export const PostTaskHeaderButton = styled(Button)`
	&& {
		width: 60px;
		height: 28px;
		padding: 7px 10px;
		background: #363636;
		border-radius: 300px;

		//text
		color: #fff;
		font-weight: 500;
		display: flex;
		justify-content: space-between;
	}
`

export const PostTaskHeaderButtonImg = styled.img`
	width: 10px;
	height: 10px;
`

export const PostTaskContent = styled.div``

export const PostTaskTextBlock = styled.div`
	width: 100%;
	min-height: 50px;
	height: 50px;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	margin-bottom: 10px;
`

export const PostTaskTitle = styled(Typography)`
	&& {
		width: 100%;
		font-weight: bold;
		font-size: 16px;
		line-height: 20px;
		color: #ffffff;
	}
`

export const PostTaskText = styled(Typography)`
	&& {
		font-size: 14px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #c4c4c4;
	}
`

export const PostTaskImageBlock = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const PostTaskImage = styled.img`
	width: 290px;
	height: auto;
`

export const PostLeftImage = styled.div`
	width: 290px;
	height: 240px;
	background-image: url('/images/overview/gradient.png');
	background-repeat: no-repeat;
	background-position: center;
	display: flex;
	justify-content: center;
	align-items: center;
`

export const PostActivity = styled.div`
	margin-top: 20px;
	max-width: 190px;
	width: 100%;
	height: 18px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const PostLikes = styled(Typography)`
	&& {
		//width: 45px;
		font-weight: 500;
		font-size: 13px;
		line-height: 17px;
		display: flex;
		align-items: center;
		color: #ffffff;

		& img {
			margin-right: 10px;
		}
	}
`

export const PostActivityIcon = styled.img`
	width: auto;
	height: auto;
`

export const PostComments = styled(PostLikes)``
export const PostShares = styled(PostLikes)``
