import { Typography } from '@material-ui/core'
import Link from 'next/link'
import styled from 'styled-components'
import { Orange, Orange100, White, Yellow400 } from '../../services/colors'
import { createSpacingUnit } from '../../utils'
import { device } from '../../utils/device'
import SmartLink from '../SmartLink'

export const NavContainer = styled.div`
	&& {
		z-index: 50;
		margin-top: ${createSpacingUnit(2.5)}px;
	}
`
export const LinkContainer = styled.div`
	flex-direction: row;
	display: flex;
	align-items: center;
	justify-content: center;
`

export const HomeNavLink = styled.a`
	&& {
		color: ${White};
	}
`

export const HomeNavLinkTypography = styled(Typography)`
	&& {
		display: inline;
		font-weight: bolder;
		@media ${device.mobileL} {
			font-size: 14px;
			line-height: 22px;
		}
	}
`

export const ManifestoLink = styled(HomeNavLinkTypography)`
	&& {
		margin-right: ${createSpacingUnit(2)}px;
	}
`
