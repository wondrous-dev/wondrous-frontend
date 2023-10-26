import styled from "styled-components";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, ButtonBase } from "@mui/material";
import { Box } from "@mui/system";
import { ScrollBarStylesHorizontal } from "components/Shared/ScrollBarStyles";

export const StyledTableHeaderCell = styled(TableCell)`
  && {
    font-weight: bold !important;
    color: black !important;
    border-bottom: 1px solid black;
    font-family: "Poppins" !important;
    font-style: normal;
    font-weight: 700 !important;
    font-size: 14px !important;
    line-height: 15px;
    letter-spacing: 0.01em;
    text-align: center;
    border-right: 1px solid #949494;
    &:first-child {
      text-align: left;
    }
  }
`;

export const StyledTableHeader = styled(TableRow)`
  && {
    background: #dbdbdb;
    height: 48px;
    border: 1px solid black;
    border-left: none;
    border-right: none;
  }
`;

export const StyledTableRow = styled(TableRow)`
  && {
    background-color: ${({ id }) => (id % 2 === 0 ? "white" : "#F7F7F7")};
    color: black;
    td {
      &:first-child {
        > * {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
      }
    }
  }
`;

export const PaperComponent = styled(Paper)`
  && {
    border-radius: 16px;
    border: 2px solid black;
    overflow: hidden;
  }
`;

export const NoBorderElement = styled(Paper)`
  && {
    border-radius: 16px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: none;
    overflow-y: scroll;
    height: 80vh;
  }
`;

export const IconWrapper = styled(ButtonBase)`
  && {
    background: #84bcff;
    border-radius: 6px;

    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const TableBodyWrapper = styled(Box)`
  && {
    overflow: auto;
    ${ScrollBarStylesHorizontal};
  }
`;
