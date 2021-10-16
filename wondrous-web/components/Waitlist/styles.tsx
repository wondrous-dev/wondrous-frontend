import { Typography, Button } from '@material-ui/core'
import styled from 'styled-components'
import {
	Black,
	Grey150,
	Grey50,
	Grey55,
	Grey700,
	Grey800,
	Orange,
	Red400,
	White,
	Yellow400,
} from '../../services/colors'
import { createSpacingUnit } from '../../utils'
import { device } from '../../utils/device'
import { FunkyButton } from '../Button'
import ClearIcon from '@material-ui/icons/Clear'
import { CenteredFlexRow } from '../Common'

export const ModalWrapper = styled.div`
	&& {
		width: 100%;
		height: 100%;
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(270deg, #c2e9fb 0%, #a1c4fd 50.16%);
		flex-direction: column;
		padding: ${createSpacingUnit(3)}px;
		& .MuiSvgIcon-root {
			fill: ${White};
		}
	}
`

export const BodyWrapper = styled.div`
	background: ${White};
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	border-radius: ${createSpacingUnit()}px;
	padding: ${createSpacingUnit(5)}px;
	min-height: 80vh;

	@media ${device.mobileL} {
		padding: ${createSpacingUnit(2)}px ${createSpacingUnit()}px;
		padding-top: ;
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
		}

		@media ${device.mobileS} {
			font-size: 14px;
		}
	}
`

export const Container = styled.div`
	&& {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		background: linear-gradient(270deg, #c2e9fb 0%, #a1c4fd 50.16%);
	}
`

export const CloseModalButton = styled(ClearIcon)`
	cursor: pointer;
	position: absolute;
	top: 20px;
	left: 20px;
	width: 32px;
	height: 32px;
	padding: 0;
	z-index: 10;
`

export const JoinWaitListButton = styled(FunkyButton)`
	&& {
		padding: ${createSpacingUnit(1.5)}px ${createSpacingUnit(3)}px;
		margin-top: ${createSpacingUnit(4)}px;
	}
`

export const ErrorDiv = styled.div`
	color: ${Red400};
	margin-top: ${createSpacingUnit()}px;
	margin-bottom: -${createSpacingUnit(3.5)}px;
`

export const JoinWaitlistHeader = styled(Typography)`
	&& {
		color: White;
		margin-bottom: ${createSpacingUnit(2)}px;
		text-align: center;
		@media ${device.mobileL} {
			font-size: 20px;
			margin-bottom: ${createSpacingUnit()}px;
		}
	}
`

export const ExplanationText = styled(Typography)`
	&& {
		color: ${White};
		margin-top: ${createSpacingUnit(2)}px;
		max-width: ${createSpacingUnit(80)}px;
		font-size: 18px;
		line-height: 28px;
		text-align: center;
		margin-bottom: ${createSpacingUnit(2)}px;
		@media ${device.mobileL} {
			font-size: 16px;
			line-height: 24px;
			margin-top: ${createSpacingUnit()}px;
			margin-bottom: ${createSpacingUnit()}px;
		}
	}
`

export const MetaTag = styled.span`
	display: block;
	overflow: hidden;
	overflow-wrap: break-word;
	word-break: break-all;
	background: ${Grey55};
	color: ${Grey700};
	font-size: 16px;
	line-height: ${createSpacingUnit(2.5)}px;
	border-radius: ${createSpacingUnit(1)}px;
	padding: ${createSpacingUnit(4 / 3)}px ${createSpacingUnit(2)}px;
`

export const LinkBox = styled.div`
	&& {
		background: ${Grey55};
		border: 1px solid ${Grey150};
		border-radius: ${createSpacingUnit()}px;
		padding: ${createSpacingUnit(2)}px;

		display: flex;
		align-items: center;
		margin-top: ${createSpacingUnit(2)}px;
		@media ${device.mobileL} {
			font-size: 16px;
			line-height: 24px;
			margin-top: 0;
		}
	}
`

export const LinkText = styled(Typography)`
	&& {
		font-size: ${createSpacingUnit(2)}px;
		@media ${device.mobileL} {
			font-size: 14px;
		}
	}
`

export const CopyText = styled(Typography)`
	&& {
		font-size: ${createSpacingUnit(2)}px;
		cursor: pointer;
		margin-left: ${createSpacingUnit(2)}px;
		@media ${device.mobileL} {
			font-size: 14px;
		}
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

export const ResendLink = styled(Typography)`
	&& {
		color: ${White};
		font-size: 16px;
		font-weight: bold;
		text-decoration: underline;
		margin-top: ${createSpacingUnit(2)}px;
		cursor: pointer;
	}
`

export const CenteredDiv = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`

export const LinkRow = styled(CenteredFlexRow)`
	&& {
		@media ${device.mobileL} {
			padding: ${createSpacingUnit(1.5)}px;
		}
	}
`
export const FunkyText = styled(Typography)`
	&& {
		@keyframes shine {
			to {
				background-position: 200% center;
			}
		}
		display: inline;
		font-weight: bold;
		background: linear-gradient(
			-260deg,
			#37c6ce 13.71%,
			#8d6fea 50.94%,
			#f645e5 70.76%,
			#37c6ce 100%
		);
		background-size: 200% auto;
		background-clip: text;
		-webkit-background-clip: text;
		-moz-background-clip: text;
		-moz-text-fill-color: transparent;
		-webkit-text-fill-color: transparent;
		-webkit-animation: shine 8s ease infinite;
		animation: shine 8s ease infinite;
		@media ${device.mobileL} {
			font-size: 28px;
		}
	}
`

export const FunkyTextYellow = styled(Typography)`
	&& {
		@keyframes shine {
			to {
				background-position: 200% center;
			}
		}
		font-size: 18px;
		line-height: 28px;
		display: inline;
		font-weight: bolder;
		color: ${Yellow400};
		margin-top: ${createSpacingUnit(3)}px;
		@media ${device.mobileL} {
			font-size: 16px;
			line-height: 24px;
		}
	}
`

export const TweetButton = styled(Button)`
	&& {
		padding: ${createSpacingUnit(1.5)}px ${createSpacingUnit(3)}px;
		margin-top: ${createSpacingUnit(3)}px;
		background: #1da1f2;
		border-radius: ${createSpacingUnit()}px;
		&:hover {
			background: #1da1f2;
		}
		@media ${device.mobileL} {
			margin-top: ${createSpacingUnit()}px;
		}
	}
`

export const TweetButtonText = styled(Typography)`
	&& {
		color: ${White};
		font-weight: bolder;
		font-size: 18px;
	}
`

export const ReferredFunkyButton = styled(FunkyButton)`
	&& {
		cursor: pointer;
		margin-top: ${createSpacingUnit(2.5)}px;
		border-radius: ${createSpacingUnit(4)}px;
		padding-left: ${createSpacingUnit(2.5)}px;
		padding-right: ${createSpacingUnit(2.5)}px;
	}
`
export const ReferredText = styled(Typography)`
	&& {
		color: ${White};
		font-weight: bolder;
	}
`

// export const ReferredText = styled(FunkyText)`
// 	&& {
// 		color: ${Grey800};
// 		font-size: 18px;
// 		line-height: 28px;
// 		text-align: center;
// 		margin-bottom: ${createSpacingUnit(3)}px;
// 	}
// `
