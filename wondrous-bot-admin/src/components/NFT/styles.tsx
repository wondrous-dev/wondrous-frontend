import { FormControl } from "@mui/material";
import styled from "styled-components";

export const StyledFormControl = styled(FormControl)`
  && {
    display: flex;
    flex-direction: column;
    gap: ${({gap = '10px'}) => gap};
    width: 100%;
    background-color: white;
  }
`;
