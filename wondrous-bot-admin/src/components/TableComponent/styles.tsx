import styled from 'styled-components';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonBase,
} from '@mui/material';

export const StyledTableHeader = styled(TableRow)`
  background-color: #2a8d5c;
  height: 48px;
`;

export const StyledTableHeaderCell = styled(TableCell)`
  font-weight: bold !important;
  color: white !important;
  font-family: 'Poppins' !important;
  font-style: normal;
  font-weight: 700 !important;
  font-size: 14px !important;
  line-height: 15px;
  /* identical to box height, or 107% */
  text-align: center;
  letter-spacing: 0.01em;
`;

export const StyledTableRow = styled(TableRow)`
  background-color: ${({ id }) => (id % 2 === 0 ? 'white' : '#f2f2f2')};
  color: black;
`;

export const PaperComponent = styled(Paper)`
  && {
    border-radius: 16px;
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
