import { Checkbox, Typography } from "@mui/material";
import styled from "styled-components";

export const StyledCheckbox = styled(Checkbox)`
  && {
    width: 18px;
    height: 18px;
    color: #707070;
    &.Mui-checked {
      color: ${({ bgcolor = "#F8642D" }) => bgcolor};
    }
    .MuiSvgIcon-root {
      width: ${({ width = "16px" }) => width};
      height: ${({ height = "16px" }) => height};
    }
  }
`;

export const StyledRewardText = styled(Typography)`
  && {
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 24px;
    color: #000000;
  }
`;

export const StyledRewardImg = styled.img`
  cursor: pointer;
  margin-right: 8px;
`;
