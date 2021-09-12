import { Typography, Button } from '@material-ui/core'
import styled from 'styled-components'
import { Orange, Red400, White } from '../../services/colors'
import { createSpacingUnit } from '../../utils'
import { device } from '../../utils/device'
import { FunkyButton } from '../Button'
import ClearIcon from '@material-ui/icons/Clear'

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
`

export const JoinWaitlistHeader = styled(Typography)`
	&& {
		color: White;
		margin-bottom: ${createSpacingUnit(2)}px;
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
