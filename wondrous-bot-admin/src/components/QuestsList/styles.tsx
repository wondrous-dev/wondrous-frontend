import { Box, Grid, Typography } from "@mui/material";
import { BoxWrapper } from "components/QuestCardMenu/styles";
import styled from "styled-components";

export const Label = styled(Typography)`
  && {
    font-family: "Poppins";
    font-style: normal;
    font-weight: ${({ fontWeight }) => fontWeight || 600};
    font-size: ${({ fontSize }) => fontSize || "18px"};
    line-height: ${({ lineHeight }) => lineHeight || "21px"};

    color: ${({ color }) => color || "#000000"};
    display: inline-block;
  }
`;

export const CardHoverWrapper = styled(Grid)`
  && {
    background: #000212;
    touch-action: none;
    border-radius: 16px;
  }
`;

/* 
HOVER ANIMATION - for future usecases
    ${({ disableHover }) =>
    disableHover
        ? ""
        : `&:hover {
      transform: translateY(-20px);
      background: #fee2ca;
      ${BoxWrapper} {
        display: flex;
      }
    }`}

*/

export const CompletionsCountBox = styled(Box)``;

export const CardWrapper = styled(Grid)`
  && {
    background: white;
    cursor: pointer;
    border-radius: 16px;
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px;
    flex-direction: column;
    gap: 14px;
    transition: all 0.1s ease-in-out;
    border: 1px solid black;

    &:hover {
      background: #fee2ca;
      border-color: #000000;
      ${BoxWrapper} {
        display: flex;
      }
      ${CompletionsCountBox} {
        border: 1px solid transparent;
      }
    }
  }
`;

