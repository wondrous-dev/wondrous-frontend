import styled from 'styled-components'
import { Purple, White } from '../../services/colors'
import { Logotype } from '../Common/ci'
import { CenteredFlexRow } from '../Common/index'

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
	 font-size: 14px;
 }
`
export const Line = styled.h2`
	&& {
		text-align: center;
		border-bottom: 1px solid #828282;
		line-height: 0.1rem;
		width: ${props => props.width};
 }
`

export const PaddedParagraph = styled.p`
	&& {
		padding: ${props => props.padding};
		color: ${props => props.color};
		margin: 0;
	}
`

export const LineWithText = ({children}) => {
	return (
		<CenteredFlexRow>
			<Line width="25%"/>
			{children}
			<Line width="25%"/>
		</CenteredFlexRow>
	)	
}

export const StyledLink = styled.a`
	color: #01baff;
`