import styled from 'styled-components'

export const PaddedParagraph = styled.p`
	&& {
		padding: ${props => props.padding};
		color: ${props => props.color};
		margin: 0;
	}
`

export const StyledLink = styled.a`
	&& {
    color: #01baff;
  }
`