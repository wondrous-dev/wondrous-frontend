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
		max-height: 30px;
		max-width: fit-content;
	}
`
export const Form = styled.form`
 && {
	display: flex;
	flex-direction: column;
 }
`

export const Field = styled.input`
 && {
	 padding: 15px 0 15px 50px;
	 margin: 5px 0;
	 border-radius: 8px;
	 border: 0px;
	 color: #828282;
	 background: #0F0F0F url(${props => props.url}) no-repeat 10px;
	 outline: none;
 }
`