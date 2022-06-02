import styled from 'styled-components';
import { white, highlightBlue } from 'theme/colors';

export const PaddedParagraph = styled.p`
  && {
    padding: ${(props) => props.padding || 0};
    color: ${(props) => props.color || white};
    margin: 0;
  }
`;

export const StyledLink = styled.a`
  && {
    color: ${highlightBlue};
  }
`;

export const StyledNextLink = styled.span`
  cursor: pointer;
  display: block;
  text-align: center;
  font-weight: 500;
  margin-top: 18px;
  text-decoration: none;
  color: ${highlightBlue};

  &:hover {
    text-decoration: underline;
  }
`;
