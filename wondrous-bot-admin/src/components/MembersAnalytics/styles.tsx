import styled from "styled-components";
import { Label } from "components/QuestsList/styles";
import { Typography } from "@mui/material";

export const StyledUsername = styled(Label)`
  && {
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;

export const CommonTypography = styled(Typography)`
  && {
    color: ${({ color = "#000" }) => color};
    font-family: Poppins;
    font-size: ${({ fontSize = "12px" }) => fontSize};
    font-style: normal;
    font-weight: ${({ fontWeight = 500 }) => fontWeight};
    line-height: 12px; /* 100% */
    letter-spacing: 0.24px;
  }
`;

export const DataTitle = styled(Typography)`
  && {
    color: #626262;
    font-family: Poppins;
    font-size: 13px;
    font-style: normal;
    font-weight: 600;
    line-height: 15px;
    min-width: 30%;
  }
`;
