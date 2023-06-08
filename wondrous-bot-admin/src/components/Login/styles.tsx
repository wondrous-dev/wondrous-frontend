import { Grid, Typography } from "@mui/material";
import styled from "styled-components";

export const ErrorTypography = styled(Typography)`
  && {
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    color: #ff0000;
  }
`;

export const SuccessTypography = styled(ErrorTypography)`
  && {
    color: #2a8d5c;
  }
`;

export const Connectors = styled(Grid)`
  && {
    background: ${({ bgcolor = "#f7f7f7" }) => bgcolor};
    padding: 24px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }
`;
