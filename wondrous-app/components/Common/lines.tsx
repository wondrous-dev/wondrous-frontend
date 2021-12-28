import { CenteredFlexRow } from './index'
import styled from 'styled-components'
import { Grey85 } from '../../theme/colors'

export const Line = styled.h2`
	&& {
		text-align: center;
		border-bottom: 1px solid ${Grey85};
		line-height: 0.1rem;
		width: ${(props) => props.width || '100%'};
	}
`

export const LineWithText = ({ children }) => {
	return (
		<CenteredFlexRow>
			<Line width="25%" />
			{children}
			<Line width="25%" />
		</CenteredFlexRow>
	)
}
