import styled from 'styled-components'
import { White, HighlightBlue } from '../../theme/colors'

export const PaddedParagraph = styled.p`
	&& {
		padding: ${(props) => props.padding || 0};
		color: ${(props) => props.color || White};
		margin: 0;
	}
`

export const StyledLink = styled.a`
	&& {
		color: ${HighlightBlue};
	}
`
