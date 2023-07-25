import { Typography } from "@mui/material";
import styled from "styled-components";

export const Title = styled(Typography)`
  && {
    font-family: Poppins;
    font-size: ${({ fontSize = "16px" }) => fontSize};
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.02em;
    text-align: left;
    color: black;
  }
`;
