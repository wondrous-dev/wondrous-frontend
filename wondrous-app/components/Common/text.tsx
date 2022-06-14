import styled from 'styled-components';
import { White, HighlightBlue } from '../../theme/colors';
import Link from 'next/link';

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

export const StyledNextLink = styled.span`
  cursor: pointer;
  display: block;
  text-align: center;
  font-weight: 500;
  margin-top: 18px;
  text-decoration: none;
  color: ${HighlightBlue};

  &:hover {
    text-decoration: underline;
  }
`;
