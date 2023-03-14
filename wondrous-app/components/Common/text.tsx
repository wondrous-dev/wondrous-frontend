import styled from 'styled-components';
import palette from 'theme/palette';

export const PaddedParagraph = styled.p`
  && {
    padding: ${(props) => props.padding || 0};
    color: ${(props) => props.color || palette.white};
    margin: 0;
    font-family: 'Space Grotesk';
  }
`;

export const StyledLink = styled.a`
  && {
    color: ${palette.highlightBlue};
    font-weight: 500;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StyledNextLink = styled.span`
  cursor: pointer;
  display: block;
  text-align: center;
  font-weight: 500;
  margin-top: 18px;
  text-decoration: none;
  color: ${palette.highlightBlue};

  &:hover {
    text-decoration: underline;
  }
`;
