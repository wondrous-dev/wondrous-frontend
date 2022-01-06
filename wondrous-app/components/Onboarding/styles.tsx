import styled from 'styled-components'
import { TextField, Typography } from '@material-ui/core'
import Image from 'next/image'
import { Grey250, Grey85, White } from '../../theme/colors'
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

export const LogoImg = styled.img`
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
	padding: 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	min-height: 80vh;
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
		font-weight: 450;
	}
`

export const MetamaskButton = styled(Button)`
	&& {
		margin-top: 32px;
	}
`

export const StyledHr = styled.hr`
	border: 1px solid ${Grey85};
	width: 100%;
`

export const ProgressBar = styled.img`
	&& {
		margin-top: 26px;
	}
`

export const OnboardingTitle = styled(Typography)`
	&& {
		font-size: 28px;
		color: ${White};
		margin-top: 18px;
		margin-bottom: 18px;
		font-weight: 500;
	}
`

export const ButtonDiv = styled.div`
	width: 100%;
	margin-top: ;
`

export const ContinueButton = styled(Button)`
	&& {
		position: absolute;
		bottom: 40px;
		right: 40px;
	}
`

export const ContinueText = styled(Typography)`
	&& {
	}
`

export const UsernameTitle = styled(Typography)`
	&& {
		color: #ccbbff;
		font-size: 14px;
		line-height: 18px;
		font-weight: 500;
		margin-top: 36px;
		width: 100%;
	}
`

export const UsernameDescription = styled(UsernameTitle)`
	&& {
		color: ${Grey250};
		margin-top: 8px;
		margin-bottom: 20px;
	}
`
export const UsernameInput = styled(TextField)({
	'&.MuiTextField-root': {
		width: '100%',
		maxWidth: '100%',
		height: 40,
		backgroundColor: '#0F0F0F',
		borderRadius: 6,
		padding: 10,
		display: 'flex',
		justifyContent: 'center',
		border: '1px solid #4B4B4B',
	},
	'& .MuiInputBase-input': {
		fontSize: 14,
		lineHeight: 19,
		letterSpacing: '0.01em',
		color: '#C4C4C4',
	},
	'& .MuiInput-underline:after': {
		borderBottom: '2px solid violet',
	},
})
