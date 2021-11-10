import { Button, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Orange, Orange100, White, Yellow400 } from '../../services/colors'
import { createSpacingUnit } from '../../utils'
import { device } from '../../utils/device'
import { FunkyButton } from '../Button'

export const HeaderContainer = styled.div`
	&& {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		display: flex;
		align-items: center;
		position: fixed;
		background-image: url('/images/homepage/homepage-header-graphic.png');
		background-position: 0 0 center; /* Center the image */
		background-repeat: no-repeat; /* Do not repeat the image */
		background-size: cover; /* Resize the background image to cover the entire container */
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
		background: linear-gradient(
			267.61deg,
			#ccbbff 12.13%,
			#7427ff 91.76%,
			#00baff 180.15%
		);
		padding-left: ${createSpacingUnit(8)}px;
		background-size: 200% auto;
		background-clip: text;
		-webkit-background-clip: text;
		-moz-background-clip: text;
		-moz-text-fill-color: transparent;
		-webkit-text-fill-color: transparent;
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
		padding-left: ${createSpacingUnit(8)}px;
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
		max-width: ${createSpacingUnit()};
	}
`

export const HomeSubtext = styled(Subtext)`
	&& {
		max-width: 441px;
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
		border: 1px solid #7fff31;
		border-radius: 9px;
		margin-left: ${createSpacingUnit(8)}px;
		max-width: ${createSpacingUnit(30)}px;
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
