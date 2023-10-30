import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const TextLabel = styled(Typography)`
  && {
    font-family: Poppins;
    font-weight: ${({ weight }) => weight || 500};
    font-size: ${({ fontSize }) => fontSize || "15px"};
    line-height: ${({ fontSize }) => fontSize || "15px"};
    color: ${({ color }) => color || "#000000"};
  }
`;

export const ImageComponent = styled.img`
  width: 100%;
  object-fit: cover;
  object-position: center;
`;

export const StyledLink = styled(Link)`
  && {
    position: fixed;
    top: 2%;
    left: 1%;
  }
`;

export const UnderlinedLink = styled.a`
  cursor: pointer;
  color: inherit;
  text-decoration: underline;
  &:hover {
    color: inherit;
    text-decoration: underline;
  }
`;