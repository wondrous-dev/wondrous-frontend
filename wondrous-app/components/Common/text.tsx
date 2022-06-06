import styled from 'styled-components';
import { White, HighlightBlue } from '../../theme/colors';

export const PaddedParagraph = styled.p`
  && {
    padding: ${(props) => props.padding || 0};
    color: ${(props) => props.color || White};
    margin: 0;
    font-family: Space Grotesk;
  }
`;

export const StyledLink = styled.a`
  && {
    color: ${HighlightBlue};
  }
`;
