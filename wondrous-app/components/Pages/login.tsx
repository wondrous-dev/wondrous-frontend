import styled from 'styled-components'
import { Purple, White } from '../../services/colors'
import { Logotype } from '../Common/ci'

export const LoginWrapper = styled.div`
	&& {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: url('/images/login/background.png');
		background-repeat: no-repeat;
		background-position: center; /* Center the image */
		background-size: cover;
		flex-direction: column;
		background-color: ${Purple};
		& .MuiSvgIcon-root {
			fill: ${White};
		}
	}
`

export const SmallLogo = styled(Logotype)`
	&& {
		max-height: 3vh;
	}
`