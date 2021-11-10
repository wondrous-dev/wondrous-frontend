import { Typography, Button } from '@material-ui/core'
import Link from 'next/link'
import styled from 'styled-components'
import { Orange, Orange100, White, Yellow400 } from '../../services/colors'
import { createSpacingUnit } from '../../utils'
import { device } from '../../utils/device'
import SmartLink from '../SmartLink'

export const NavContainer = styled.div`
	&& {
		position: fixed;
		top: ${createSpacingUnit(1)}px;
		padding-top: ${createSpacingUnit(2)}px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
`
export const LinkContainer = styled.div`
	flex-direction: row;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`

export const WaitlistContainer = styled(LinkContainer)`
	margin-right: ${createSpacingUnit(4)}px;
`

export const ImgLink = styled.a`
	margin-left: ${createSpacingUnit(2)}px;
`

export const LogoImg = styled.img`
	width: ${createSpacingUnit(22.75)}px;
`

export const FlexDiv = styled.div`
	flex: 1;
`

export const HomeNavLink = styled.a`
	&& {
		color: ${White};
		text-decoration: none;
		font-family: Faktum Bold;
	}
`

export const HomeNavLinkTypography = styled(Typography)`
	&& {
		display: inline;
		font-weight: bolder;
		color: ${White};
		@media ${device.mobileL} {
			font-size: 14px;
			line-height: 22px;
		}
	}
`

export const LinkDiv = styled.div`
	&& {
		flex: 1;
		text-align: right;
		padding-right: ${createSpacingUnit(6)}px;
	}
`

export const ManifestoLink = styled(HomeNavLinkTypography)`
	&& {
		margin-right: ${createSpacingUnit(6)}px;
		margin-left: -${createSpacingUnit(5)}px;
	}
`

export const JoinDiscordButton = styled(HomeNavLink)`
	&& {
		border: 2px solid #7fff31;
		box-sizing: border-box;
		border-radius: 9px;
		padding: ${createSpacingUnit(2)}px;
	}
`
