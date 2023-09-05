import { Checkbox } from "@mui/material";
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
