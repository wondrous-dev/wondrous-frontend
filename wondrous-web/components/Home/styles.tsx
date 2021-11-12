import { Button, Typography, Grid } from '@material-ui/core'
import styled from 'styled-components'
import {
	Green200,
	Orange,
	Orange100,
	Purple,
	Purple100,
	White,
	Yellow400,
} from '../../services/colors'
import { createSpacingUnit } from '../../utils'
import { device } from '../../utils/device'
import { FunkyButton } from '../Button'

export const HeaderContainer = styled.div`
	&& {
		width: 100%;
		height: 100%;
		min-height: 125vh;
		display: flex;
		align-items: center;
		background-color: ${Purple};
		background-image: url('/images/homepage/homepage-header-graphic.png');
		background-position: 0 0 center; /* Center the image */
		background-repeat: no-repeat; /* Do not repeat the image */
		background-size: cover; /* Resize the background image to cover the entire container */

		@media ${device.tablet} {
			background-image: url('/images/homepage/header-no-background.png');
			background-position-x: 100%;
			background-position-y: 50vh;
			align-items: baseline;
			padding-top: ${createSpacingUnit(30)}px;
			min-height: 125vh;
		}

		@media (max-width: 600px) {
			background-position-y: 60vh;
		}

		@media ${device.mobileL} {
			background-image: url('/images/homepage/header-no-background.png');
			background-position-x: 100%;
			background-position-y: 80vh;
			align-items: baseline;
			padding-top: ${createSpacingUnit(30)}px;
			min-height: 130vh;
		}
	}
`

export const LeftImage = styled.img`
	&& {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		@media ${device.mobileL} {
			left: -${createSpacingUnit(4)}px;
		}
	}
`

export const RightImage = styled.img`
	&& {
		position: absolute;
		right: 0;
		bottom: 0;
		@media ${device.tablet} {
			bottom: -${createSpacingUnit(3)}px;
		}

		@media ${device.mobileL} {
			bottom: -${createSpacingUnit(5)}px;
		}

		@media ${device.mobileM} {
			bottom: -${createSpacingUnit(8)}px;
		}

		@media ${device.mobileS} {
			bottom: -${createSpacingUnit(15)}px;
		}
	}
`

export const Title = styled(Typography)`
	&& {
		position: relative;
		z-index: 10;
		max-width: ${createSpacingUnit(60.6)}px;
		display: inline;
		font-weight: bold;
		background: linear-gradient(267.33deg, #ffffff 12.13%, #7000ff 89.1%);

		box-sizing: content-box;
		padding-left: ${createSpacingUnit(12)}px;
		background-size: 200% auto;
		background-clip: text;
		-webkit-background-clip: text;
		-moz-background-clip: text;
		-moz-text-fill-color: transparent;
		-webkit-text-fill-color: transparent;
		@media ${device.tablet} {
			text-align: center;
			padding-left: 0;
		}

		@media ${device.mobileL} {
			font-size: 42px;
			line-height: 55px;
		}

		@media ${device.mobileM} {
			font-size: 30px;
			line-height: 38px;
		}
	}
`

export const EmphasisSpan = styled.span`
	font-family: Faktum Bold;
`

export const Subtext = styled(Typography)`
	&& {
		margin-top: ${createSpacingUnit(3)}px;
		color: ${White};
		font-size: 16px;
		font-family: Faktum;
		line-height: 27.5px;
		position: relative;
		z-index: 10;
		padding-left: ${createSpacingUnit(12)}px;
		@media ${device.mobileS} {
			font-size: 14px;
			line-height: 24px;
		}
	}
`

export const ContentDiv = styled.div`
	&& {
		display: flex;
		flex-direction: column;
		padding: ${createSpacingUnit(2)}px;
		margin-top: -${createSpacingUnit(10)}px;
		@media ${device.tablet} {
			justify-content: center;
			align-items: center;
			width: 100%;
		}
	}
`

export const HomeSubtext = styled(Subtext)`
	&& {
		max-width: ${createSpacingUnit(60)}px;
		box-sizing: content-box;
		@media ${device.tablet} {
			text-align: center;
			padding-left: 0;
		}
	}
`

export const FunkyText = styled(Subtext)`
	&& {
		@keyframes shine {
			to {
				background-position: 200% center;
			}
		}
		display: inline;
		font-weight: bold;
		color: ${Yellow400};
	}
`

export const HomeButton = styled(Button)`
	&& {
		margin-top: ${createSpacingUnit(4)}px;
		padding: ${createSpacingUnit(2)}px;
		border: 1px solid ${Green200};
		border-radius: 9px;
		margin-left: ${createSpacingUnit(12)}px;
		max-width: ${createSpacingUnit(30)}px;
		filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
		@media ${device.tablet} {
			justify-content: center;
			align-items: center;
			margin-left: 0;
		}
	}
`

export const HomeButtonText = styled(Typography)`
	&& {
		font-size: 15px;
		color: ${White};
		font-weight: bold;
		font-family: Carmen Sans Bold;
	}
`

export const Blob = styled.img`
	&& {
		position: absolute;
		width: ${createSpacingUnit(20)}px;
		height: ${createSpacingUnit(20)}px;
		border-radius: ${createSpacingUnit(10)}px;

		@media ${device.tablet} {
			width: ${createSpacingUnit(16)}px;
			height: ${createSpacingUnit(16)}px;
			border-radius: ${createSpacingUnit(8)}px;
		}
		@media ${device.mobileS} {
			width: ${createSpacingUnit(12)}px;
			height: ${createSpacingUnit(12)}px;
			border-radius: ${createSpacingUnit(6)}px;
		}
	}
`
export const Blob1 = styled(Blob)`
	&& {
		left: ${createSpacingUnit(8)}px;
		top: ${createSpacingUnit(8)}px;

		@media ${device.mobileL} {
			left: ${createSpacingUnit(3)}px;
		}

		@media ${device.mobileM} {
			top: ${createSpacingUnit(6)}px;
		}

		@media ${device.mobileS} {
			top: ${createSpacingUnit(4)}px;
		}
	}
`

export const Blob2 = styled(Blob)`
	&& {
		top: ${createSpacingUnit(4)}px;
		right: ${createSpacingUnit(8)}px;

		@media ${device.mobileL} {
			right: ${createSpacingUnit(3)}px;
		}
		@media ${device.mobileM} {
			top: ${createSpacingUnit(3)}px;
		}

		@media ${device.mobileS} {
			top: ${createSpacingUnit(2)}px;
		}
	}
`

export const Block2Container = styled.div`
	background: ${Purple};
	padding: ${createSpacingUnit(2)}px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: ${createSpacingUnit(10)}px;
	@media ${device.laptop} {
		padding-bottom: ${createSpacingUnit(30)}px;
	}
`

export const FeatureDiv = styled(Grid)`
	&& {
		margin-top: -${createSpacingUnit(20)}px;
		@media ${device.laptop} {
			margin-top: -${createSpacingUnit(30)}px;
		}
		@media ${device.mobileL} {
			margin-top: -${createSpacingUnit(20)}px;
		}
	}
`

export const FeatureBlock = styled(Grid)`
	display: flex;
	justify-content: center;
`

export const FeatureBlockInner = styled.div`
	&& {
		padding: ${createSpacingUnit(2)}px ${createSpacingUnit(3)}px;
		border: 2px solid black;
		text-align: center;
		max-width: ${createSpacingUnit(36)}px;
		border-image-slice: 1;
		border-image-source: linear-gradient(
			179.47deg,
			#4f8bff 0.46%,
			#7000ff 295.96%
		);
		position: relative;
		z-index: 100;
		background: linear-gradient(
			0deg,
			rgba(2, 2, 16, 0.45),
			rgba(2, 2, 16, 0.45)
		);
		background-blend-mode: overlay, normal;
		box-shadow: 0px 14px 44px rgba(0, 0, 0, 0.35);
		backdrop-filter: blur(30px);
		min-height: ${createSpacingUnit(33)}px;
		@media (max-width: 1280px) {
			max-width: none;
		}
	}
`
export const FeatureImg = styled.img`
	&& {
		margin-bottom: ${createSpacingUnit(1.5)}px;
		width: ${createSpacingUnit(7.25)}px;
	}
`

export const FeatureHeader = styled(Typography)`
	&& {
		font-family: Carmen Sans Bold;
		size: 18px;
		line-height: 26px;
		text-align: center;
		color: ${White};
		margin-bottom: ${createSpacingUnit(2)}px;
	}
`

export const FeatureText = styled(Typography)`
	&& {
		font-family: Carmen Sans;
		font-size: 16px;
		line-height: 24px;
		text-align: center;
		color: ${White};
	}
`

export const Block2Header = styled(Title)`
	&& {
		font-size: 32px;
		line-height: 40px;
		margin-top: ${createSpacingUnit(8)}px;
		margin-bottom: ${createSpacingUnit(2.5)}px;
		padding-left: 0;
		text-align: center;
		@media ${device.laptop} {
			font-size: 28px;
			line-height: 35px;
		}
	}
`

export const Block2TextDiv = styled.div`
	&& {
		max-width: ${createSpacingUnit(80)}px;
	}
`

export const CollaborativeImg = styled.img`
	width: ${createSpacingUnit(100)}px;
	margin-top: ${createSpacingUnit(4)}px;
`

export const Block3LeftSideGraphic = styled.img`
	position: absolute;
	top: -${createSpacingUnit(30)}px;
	left: -${createSpacingUnit(50)}px;
	width: ${createSpacingUnit(100)}px;
	@media ${device.mobileL} {
		width: ${createSpacingUnit(85)}px;
	}

	@media ${device.mobileM} {
		width: ${createSpacingUnit(70)}px;
	}
`

export const Block3Container = styled(Block2Container)`
	&& {
		background-color: ${Purple};
		background-image: url('/images/homepage/impact-background.png');
		background-repeat: no-repeat;
		background-position: 50 0 center; /* Center the image */
		background-size: cover; /* Resize the background image to cover the entire container */
		height: 100vh;
		justify-content: center;
		position: relative;
		@media ${device.laptop} {
			height: 125vh;
			background-position: center;
		}
	}
`

export const Block3Header = styled(Block2Header)`
	&& {
		max-width: ${createSpacingUnit(56)}px;
		margin-top: ${createSpacingUnit(8)}px;
		margin-bottom: ${createSpacingUnit(2.5)}px;
		padding-left: 0;
		text-align: center;
		@media ${device.laptop} {
			margin-bottom: ${createSpacingUnit(4)}px;
		}
	}
`

export const Block4Container = styled(Block2Container)`
	background-color: ${Purple100};
	background-image: url('/images/homepage/discordbackground-nosonicwave.jpg');
	background-repeat: no-repeat;
	background-position: center; /* Center the image */
	background-size: cover; /* Resize the background image to cover the entire container */
	position: relative;
	height: auto;
`

export const BlurredDiv = styled.div`
	border: 2px solid black;
	text-align: center;
	border-image-slice: 1;
	border-image-source: linear-gradient(
		179.47deg,
		#4f8bff 0.46%,
		#7000ff 295.96%
	);
	position: relative;
	z-index: 100;
	background: linear-gradient(0deg, rgba(2, 2, 16, 0.45), rgba(2, 2, 16, 0.45));
	background-blend-mode: overlay, normal;
	box-shadow: 0px 14px 44px rgba(0, 0, 0, 0.35);
	backdrop-filter: blur(30px);
`

export const GetFreeTokensDiv = styled(BlurredDiv)`
	&& {
		padding: ${createSpacingUnit(9)}px;
		max-width: ${createSpacingUnit(110.5)}px;
		width: 100%;
		margin-top: -${createSpacingUnit(10)}px;
	}
`

export const GetFreeTokensHeader = styled(Typography)`
	&& {
		font-size: 24px;
		line-height: 34px;
		font-family: Carmen Sans SemiBold;
		color: ${White};
		margin-bottom: ${createSpacingUnit(4)}px;
	}
`

export const TokenText = styled.span`
	&& {
		color: ${Green200};
		font-family: Carmen Sans SemiBold;
	}
`

export const WonderToken = styled.img`
	width: ${createSpacingUnit(10.25)}px;
	margin-bottom: ${createSpacingUnit(3)}px;
`

export const FreeTokenButton = styled(Button)`
	&& {
		margin-top: ${createSpacingUnit(4)}px;
		padding: ${createSpacingUnit(2)}px;
		border: 1px solid ${Green200};
		border-radius: 9px;
		max-width: ${createSpacingUnit(30)}px;
	}
`

export const JoinDiscordBox = styled(GetFreeTokensDiv)`
	&& {
		max-width: ${createSpacingUnit(75.5)}px;
		margin-top: ${createSpacingUnit(10)}px;
		height: auto;
	}
`

export const DiscordLogo = styled.img`
	&& {
		width: ${createSpacingUnit(16)}px;
	}
`

export const JoinDiscordText = styled(Typography)`
	&& {
		font-size: 22px;
		line-height: 27.5px;
		color: ${White};
		margin-top: ${createSpacingUnit(3)}px;
		margin-bottom: ${createSpacingUnit(2)}px;
		font-family: Carmen Sans Bold;
	}
`
export const JoinDiscordButton = styled(FreeTokenButton)`
	max-width: none;
`
