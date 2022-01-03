import { Button, IconButton, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Background } from '../../../theme/colors'
import { BaseCard } from '../../Common/card'
import { ProfileImage } from '../../Common/profile'
import { LinkIcon } from '../../Icons/linkIcon'

export const OverviewComponent = styled.section`
	width: 100vw;
	height: 100%;
	//background-color: ${Background};
	background-color: #0f0f0f;
	transition: 0.15s all ease;
	padding-bottom: 40px;
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
	margin-bottom: 30px;
`

export const TokenLogo = styled(ProfileImage)`
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
	//max-width: 680px;
	max-width: 1037px;
	display: flex;
	//justify-content: center;
	align-items: center;
	flex-direction: column;
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
	max-width: 295px;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
`

export const HeaderFollowButton = styled(Button)`
	& {
		width: 120px;
		height: 40px;
		border-radius: 204px;
		background: linear-gradient(
			268.5deg,
			#ccbbff -84.02%,
			#7427ff 4.04%,
			#00baff 101.77%
		);
		z-index: 1;
	}

	& > * {
		z-index: 1;
	}

	&:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: -1;
		margin: 0.05em;
		border-radius: inherit;
		background: rgba(15, 15, 15, 1);
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
		border-radius: 204px;
		position: relative;
	}
`

export const HeaderFollowButtonIcon = styled.img`
	width: 31px;
	height: 31px;
`

export const HeaderEditProfileButton = styled(Button)`
	&& {
		background: linear-gradient(
			267.08deg,
			#ccbbff -2.92%,
			#7427ff 81.21%,
			#00baff 174.59%
		);
		border-radius: 204px;
		padding: 8px 12px;
		width: 159px;
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
	max-width: 447px;
	width: 100%;
	min-height: 23px;
	height: 23px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const HeaderActivityLink = styled.a`
	font-weight: 500;
	font-size: 16px;
	line-height: 16px;
	display: flex;
	align-items: center;
	text-decoration: none;
	color: #ccbbff;
	text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	text-decoration-line: underline;
`

export const HeaderActivityLinkIcon = styled(LinkIcon)`
	height: 23px;
	width: 23px;
	margin-right: 8px;
	margin-top: 8px;
`

export const HeaderFollowers = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
`

export const HeaderFollowersAmount = styled(Typography)`
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

export const HeaderFollowersText = styled(HeaderFollowersAmount)`
	&& {
		color: #6c6c6c;
	}
`

export const HeaderFollowing = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
`

export const HeaderFollowingAmount = styled(Typography)`
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

export const HeaderFollowingText = styled(HeaderFollowingAmount)`
	&& {
		color: #6c6c6c;
	}
`

export const HeaderProjects = styled(HeaderFollowers)``

export const HeaderProjectsAmount = styled(HeaderFollowersAmount)``

export const HeaderProjectsText = styled(HeaderFollowersAmount)`
	&& {
		color: #6c6c6c;
	}
`

//cardStyles
export const PostsContainer = styled.div`
	max-width: 680px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
`

//cardStyles
export const PostComponent = styled(BaseCard)`
	margin-top: 22px;
	height: 540px;
`

export const PostBlock = styled.div`
	position: relative;
	padding: 0 26px 18px;
	border-left: 1px solid #4b4b4b;
	margin-bottom: 0 !important;
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
	//margin-top: 20px;
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
