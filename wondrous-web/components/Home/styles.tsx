import { Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Orange, White } from '../../services/colors'
import { createSpacingUnit } from '../../utils'
import { device } from '../../utils/device'
import { FunkyButton } from '../Button'

export const Container = styled.div`
	&& {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		background-color: ${Orange};
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
	}
`

export const Subtext = styled(Typography)`
	&& {
		margin-top: ${createSpacingUnit(3)}px;
		color: ${White};
		font-size: 20px;
		text-align: center;
		line-height: 32px;
		position: relative;
		z-index: 10;

		@media ${device.mobileL} {
			font-size: 16px;
			line-height: 26px;
		}

		@media ${device.mobileS} {
			font-size: 14px;
			line-height: 24px;
		}
	}
`

export const ContentDiv = styled.div`
	&& {
		align-items: center;
		display: flex;
		flex-direction: column;
		padding: ${createSpacingUnit(2)}px;
		max-width: ${createSpacingUnit()};
	}
`

export const HomeSubtext = styled(Subtext)`
	&& {
		max-width: ${createSpacingUnit(88)}px;
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
		background: linear-gradient(
			to right,
			#f9d873 20%,
			#fccd3f 40%,
			#fccd3f 60%,
			#f9d873 80%
		);
		background-size: 200% auto;
		background-clip: text;
		-webkit-background-clip: text;
		-moz-background-clip: text;
		-moz-text-fill-color: transparent;
		-webkit-text-fill-color: transparent;
		-webkit-animation: shine 5s ease infinite;
		animation: shine 5s ease infinite;
	}
`

export const HomeButton = styled(FunkyButton)`
	&& {
		margin-top: ${createSpacingUnit(4)}px;
		padding: ${createSpacingUnit(1.5)}px ${createSpacingUnit(3)}px;
	}
`

export const HomeButtonText = styled(Typography)`
	&& {
		font-size: 20px;
		color: ${White};
		font-weight: bold;

		@media ${device.mobileL} {
			font-size: 16px;
		}

		@media ${device.mobileS} {
			font-size: 14px;
		}
	}
`

export const Blob = styled.img`
	&& {
		position: absolute;
		width: ${createSpacingUnit(16)}px;
		height: ${createSpacingUnit(16)}px;
		border-radius: ${createSpacingUnit(8)}px;

		@media ${device.mobileS} {
			width: ${createSpacingUnit(12)}px;
			height: ${createSpacingUnit(12)}px;
			border-radius: ${createSpacingUnit(6)}px;
		}
	}
`
export const Blob1 = styled(Blob)`
	&& {
		top: ${createSpacingUnit(8)}px;
		left: ${createSpacingUnit(3)}px;

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
		right: ${createSpacingUnit(3)}px;

		@media ${device.mobileM} {
			top: ${createSpacingUnit(3)}px;
		}

		@media ${device.mobileS} {
			top: ${createSpacingUnit(2)}px;
		}
	}
`
