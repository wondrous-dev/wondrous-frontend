import { Typography, Button } from '@material-ui/core'
import styled from 'styled-components'
import {
	Black,
	Green200,
	Grey150,
	Grey50,
	Grey55,
	Grey700,
	Grey800,
	Orange,
	Purple,
	Purple200,
	Purple300,
	Purple400,
	Purple500,
	Red400,
	White,
	Yellow400,
} from '../../services/colors'
import { createSpacingUnit } from '../../utils'
import { device } from '../../utils/device'
import { FunkyButton } from '../Button'
import ClearIcon from '@material-ui/icons/Clear'
import { CenteredFlexRow } from '../Common'
import { BlurredDiv } from '../Home/styles'

export const ModalWrapper = styled.div`
	&& {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: url('/images/waitlist/background-desktop.png');
		background-repeat: no-repeat;
		background-position: center; /* Center the image */
		background-size: cover;
		flex-direction: column;
		padding: ${createSpacingUnit(3)}px;
		& .MuiSvgIcon-root {
			fill: ${White};
		}
	}
`

export const ProfileWrapper = styled(ModalWrapper)`
	&& {
		background-image: url('/images/waitlist/waitlist-profile-background.png');
	}
`

export const LogoNoTextImg = styled.img`
	width: ${createSpacingUnit(9.5)}px;
	margin-bottom: ${createSpacingUnit(2)}px;
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
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		padding: ${createSpacingUnit(2)}px;
		background-image: url('/images/waitlist/background-desktop.png');
		background-repeat: no-repeat;
		background-position: center; /* Center the image */
		background-size: cover;
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

export const JoinWaitListButton = styled(Button)`
	&& {
		padding: ${createSpacingUnit(2)}px;
		border: 1px solid ${Green200};
		border-radius: 9px;
		padding: ${createSpacingUnit(1.5)}px ${createSpacingUnit(3)}px;
		margin-top: ${createSpacingUnit(3)}px;
	}
`

export const ErrorDiv = styled.div`
	color: ${Red400};
	margin-top: ${createSpacingUnit()}px;
	margin-bottom: -${createSpacingUnit()}px;
`

export const JoinWaitlistHeader = styled(Typography)`
	&& {
		color: White;
		text-align: center;
		margin-bottom: ${createSpacingUnit(2)}px;
		@media ${device.mobileL} {
			font-size: 20px;
		}
		@media ${device.mobileS} {
			font-size: 16px;
		}
	}
`

export const ExplanationText = styled(Typography)`
	&& {
		color: ${White};
		margin-top: ${createSpacingUnit()}px;
		max-width: ${createSpacingUnit(80)}px;
		font-size: 18px;
		line-height: 28px;
		text-align: center;
		margin-bottom: ${createSpacingUnit(4)}px;
		@media ${device.mobileL} {
			font-size: 16px;
			line-height: 24px;
			margin-top: ${createSpacingUnit(1.5)}px;
			margin-bottom: ${createSpacingUnit(1.5)}px;
		}
	}
`

export const ProfileText = styled(Typography)`
	&& {
		font-size: 16px;
		line-height: 27.5px;
		color: ${White};
	}
`

export const TokenEarnedDiv = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${Purple200};
	border-radius: 289.08px;
	padding-left: ${createSpacingUnit(3)}px;
	padding-top: ${createSpacingUnit(0.5)}px;
	padding-bottom: ${createSpacingUnit(0.5)}px;
	margin-bottom: ${createSpacingUnit(3)}px;
`

export const TokenEarnedInnerDiv = styled(TokenEarnedDiv)`
	&& {
		background: rgb(91, 0, 255, 0.6);
		padding-left: 0;
		padding-right: ${createSpacingUnit(3)}px;
		padding-top: 4px;
		margin-bottom: 0;
	}
`

export const InviteDiv = styled.div`
	background-color: ${Purple};
	padding: ${createSpacingUnit(4)}px;
	@media ${device.tablet} {
		padding: ${createSpacingUnit()}px;
	}
	@media ${device.mobileL} {
		padding-left: 4px;
		padding-right: 4px;
	}
`

export const WonderTokenSymbol = styled.img`
	&& {
		width: ${createSpacingUnit(6)}px;
		margin-right: ${createSpacingUnit()}px;
	}
`

export const YouHaveText = styled(Typography)`
	&& {
		font-size: 23px;
		line-height: 36px;
		color: ${White};
		font-family: Carmen Sans SemiBold;
		margin-right: ${createSpacingUnit(2)}px;
		@media ${device.mobileL} {
			font-size: 16px;
			line-height: 24px;
		}
	}
`

export const TokenText = styled(YouHaveText)`
	&& {
		color: ${Green200};
		margin-right: 0;
		font-family: Carmen Sans Bold;
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
		background: ${Purple500};
		border-radius: ${createSpacingUnit()}px;
		padding: ${createSpacingUnit(2)}px;

		display: flex;
		align-items: center;
		margin-top: ${createSpacingUnit(3)}px;
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
		color: ${White};
		@media ${device.mobileL} {
			font-size: 14px;
			width: 200px;
			white-space: nowrap;
			overflow: hidden;
		}
	}
`

export const CopyText = styled(Typography)`
	&& {
		font-size: ${createSpacingUnit(2)}px;
		cursor: pointer;
		margin-left: ${createSpacingUnit(2)}px;
		color: ${Green200};
		@media ${device.mobileL} {
			font-size: 14px;
		}
	}
`

export const HomeButtonText = styled(Typography)`
	&& {
		font-size: 16px;
		color: ${White};
		font-weight: bold;
		font-family: Carmen Sans SemiBold;
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

export const CenteredDiv = styled(BlurredDiv)`
	&& {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		max-width: ${createSpacingUnit(91)}px;
		width: 100%;
		padding: ${createSpacingUnit(6)}px;
		@media ${device.mobileL} {
			margin-top: ${createSpacingUnit(3)}px;
			padding: ${createSpacingUnit(3)}px;
		}

		@media ${device.mobileS} {
			padding-left: 4px;
			padding-right: 4px;
		}
	}
`

export const ProfileCenteredDiv = styled(CenteredDiv)`
	&& {
		margin-top: 100px;
		margin-bottom: 100px;
	}
`
export const SmallerCenteredDiv = styled(CenteredDiv)`
	&& {
		padding: ${createSpacingUnit(10)}px !important;
		@media ${device.mobileL} {
			margin-top: ${createSpacingUnit(3)}px !important;
			padding: ${createSpacingUnit(3)}px !important;
		}

		@media ${device.mobileS} {
			padding-left: 4px !important;
			padding-right: 4px !important;
		}
	}
`
export const LinkRow = styled(CenteredFlexRow)`
	&& {
		display: flex;
		justify-content: center;
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
export const InviteButtonDiv = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

export const InviteButton = styled(Button)`
	&& {
		padding: ${createSpacingUnit(2)}px;
		margin-top: ${createSpacingUnit(3)}px;
		background: ${Purple400};
		border-radius: ${createSpacingUnit()}px;
		display: flex;
		align-items: center;
		&:hover {
			background: ${Purple300};
		}
		@media ${device.mobileL} {
			margin-top: ${createSpacingUnit()}px;
		}
	}
`

export const InviteButtonText = styled(Typography)`
	&& {
		color: ${Green200};
		font-weight: bolder;
		font-size: 15px;
	}
`

export const ReferredText = styled(Typography)`
	&& {
		color: ${White};
		margin-top: ${createSpacingUnit(3)}px;
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
