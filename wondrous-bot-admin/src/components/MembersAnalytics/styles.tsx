import styled from "styled-components";
import { Label } from "components/QuestsList/styles";
import { Box, Typography } from "@mui/material";
import ScrollBarStyles from "components/Shared/ScrollBarStyles";

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

export const TextWrapper = styled(Box)`
  && {
    border-radius: 6px;
    background: ${({ bgcolor = "#e8e8e8" }) => bgcolor};
    display: flex;
    padding: ${({padding = "8px"}) => padding};
    justify-content: center;
    align-items: center;
  }
`;

export const CardLabel = styled(Typography)`
  && {
    color: #000212;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px; /* 100% */
    letter-spacing: 0.32px;
  }
`;

export const SubmissinsWrapper = styled(Box)`
  && {
    max-height: 400px;
    overflow: scroll;
    ${ScrollBarStyles};
  }
`;