import { Checkbox } from "@mui/material";
import styled from "styled-components";

export const StyledCheckbox = styled(Checkbox)`
  && {
    width: 18px;
    height: 18px;
    color: #707070;
    &.Mui-checked {
      color: #F8642D;
    }
    .MuiSvgIcon-root {
      width: 16px;
      height: 16px;
    }
  }
`;
