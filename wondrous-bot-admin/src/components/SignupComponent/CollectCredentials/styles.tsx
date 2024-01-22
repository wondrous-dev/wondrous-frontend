import styled from "styled-components";

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ bgColor = "#CDCDCD" }) => bgColor};
`;

export const StyledLink = styled.a`
    color: black;
    font-size: inherit;
    font-weight: inherit;
    text-decoration: underline;
    &:hover {
        opacity: 0.8;
        color: black;
    }
`;
