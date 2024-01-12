import { Box, ButtonBase, Typography } from "@mui/material";
import { SharedSecondaryButton } from "components/Shared/styles";
import styled, { css } from "styled-components";

export const PanelTitle = styled(Typography)`
  && {
    color: #06040a;
    font-size: ${({ $fontSize = "18px" }) => $fontSize};
    font-style: normal;
    font-weight: ${({ $fontWeight = 500 }) => $fontWeight};
    line-height: 24px;
  }
`;

export const PanelCount = styled(Box)`
  && {
    padding: 3px 4px;
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    background: #f7f7f7;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ReversedButtonCss = css`
  background: #f7f7f7;
  color: #000;
  border: 2px solid #a7a7a7;
`;

export const StyledButton = styled(SharedSecondaryButton)`
  && {
    color: white;
    background: #000;
    transition: all 0.2s ease-in-out;
    ${({ $reverse }) => ($reverse ? ReversedButtonCss : ``)}
    &:hover {
      border: 1px solid black;
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  }
`;
