import styled from 'styled-components'

export const PaddedParagraph = styled.p`
	&& {
		padding: ${(props) => props.padding || 0};
		color: ${(props) => props.color || "white"};
		margin: 0;
	}
`

export const StyledLink = styled.a`
	&& {
    color: #01baff;
  }
`