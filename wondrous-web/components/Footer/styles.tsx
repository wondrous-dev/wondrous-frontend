import { Typography, Button } from '@material-ui/core'
import Link from 'next/link'
import styled from 'styled-components'
import {
	palette.black100,
	palette.orange,
	palette.orange100,
	White,
	Yellow400,
} from '../../services/colors'
import { createSpacingUnit } from '../../utils'
import { device } from '../../utils/device'

export const FooterContainer = styled.div`
	&& {
		width: 100%;
		background: ${palette.black100};
		padding: ${createSpacingUnit(5)}px;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
`

export const FooterLogo = styled.img`
  width: ${createSpacingUnit(15)}px;
  margin-top
`

export const FooterLogoDiv = styled.div`
	&& {
		display: flex;
		align-items: center;
	}
`

export const TwitterLogo = styled.img`
	&& {
		width: ${createSpacingUnit(4)}px;
		margin-right: ${createSpacingUnit(5)}px;
	}
`

export const DiscordLogo = styled.img`
	&& {
		width: ${createSpacingUnit(5.5)}px;
	}
`

export const FooterEmailLink = styled.a`
	text-decoration: none;
`

export const FooterEmailText = styled(Typography)`
	&& {
		margin-top: ${createSpacingUnit(3)}px;
		margin-bottom: ${createSpacingUnit(3)}px;
		color: ${White};
	}
`
