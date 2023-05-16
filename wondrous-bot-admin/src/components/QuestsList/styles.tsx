import { Grid, Typography } from "@mui/material";
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
    border-radius: 16px;
  }
`;
export const CardWrapper = styled(Grid)`
  && {
    background: ${({ bgcolor }) => bgcolor || "white"};

    cursor: pointer;
    border-radius: 16px;
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${({ padding = "14px" }) => padding};
    flex-direction: column;
    gap: ${({ gap }) => gap || "14px"};
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: translateY(-20px);
      background: ${({ bgcolor }) => bgcolor || "#fee2ca"};
      ${BoxWrapper} {
        display: flex;
      }
    }
  }
`;
