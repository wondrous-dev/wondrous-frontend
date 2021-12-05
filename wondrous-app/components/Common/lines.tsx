import { CenteredFlexRow } from './index'
import styled from 'styled-components'

export const Line = styled.h2`
	&& {
		text-align: center;
		border-bottom: 1px solid #828282;
		line-height: 0.1rem;
		width: ${props => props.width};
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