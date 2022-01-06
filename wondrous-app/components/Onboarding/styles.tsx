import styled from 'styled-components'
import { Typography } from '@material-ui/core'
import Image from 'next/image'
import { White } from '../../theme/colors'
import { Button } from '../Common/button'

export const MainWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	background-image: url('/images/onboarding/background.png');
	display: flex;
	align-items: center;
	justify-content: center;
`
export const LogoDiv = styled.div`
	display: flex;
	align-items: center;
	position: absolute;
	left: 40px;
	top: 30px;
`

export const LogoImg = styled(Image)`
	width: 40px;
	height: 30px;
`

export const LogoText = styled(Typography)`
	&& {
		font-weight: 500;
		font-size: 24px;
		color: ${White};
		margin-left: 12px;
	}
`

export const InviteWelcomeBoxWrapper = styled.div`
	background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
	border-radius: 6px;
	padding: 30px 45px;
	display: flex;
	flex-direction: column;
	align-items: center;
`

export const OrgProfilePicture = styled.img`
	&& {
		margin-bottom: 20px;
		width: 77px;
		height: 77px;
	}
`

export const InviteWelcomeBoxTitle = styled(Typography)`
	&& {
		font-size: 24px;
		font-weight: bold;
		color: ${White};
		margin-bottom: 20px;
	}
`

export const InviteWelcomeBoxParagraph = styled(Typography)`
	&& {
		color: ${White};
		font-size: 16px;
		font-weight: 400;
	}
`

export const MetamaskButton = styled(Button)`
	&& {
		margin-top: 32px;
	}
`
