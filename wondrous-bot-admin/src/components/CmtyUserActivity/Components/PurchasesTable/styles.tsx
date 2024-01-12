import { Grid } from "@mui/material";
import { StyledTableHeader, StyledTableHeaderCell } from "components/TableComponent/styles";
import styled from "styled-components";

export const Wrapper = styled(Grid)`
  && {
    ${StyledTableHeader} {
      background: black;
      ${StyledTableHeaderCell} {
        color: white !important;
        text-align: left;
      }
    }
  }
`;
