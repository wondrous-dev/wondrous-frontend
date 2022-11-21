import styled from 'styled-components';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export const StyledTable = styled(Table)`
  && {
    width: 100%;
    margin: 25px 0;
    border-collapse: separate;
  }
`;

export const StyledTableCell = styled(TableCell)`
  && {
    color: white;
  }

  &.clickable {
    cursor: pointer;
  }

  svg {
    width: 28px;
    height: 28px;
  }
`;

export const StyledTableContainer = styled(TableContainer)`
  && {
    width: 100%;
    overflow-x: visible;
    background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
    border-radius: 4px;
  }
`;

export const StyledTableHead = styled(TableHead)`
  & .MuiTableCell-head {
    color: #ccbbff;
    font-family: var(--font-space-grotesk);
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0em;
    border-radius: 4px;
    border: 1px solid #363636;
  }
`;

export const StyledTableRow = styled(TableRow)`
  & .MuiTableCell-body {
    border: 1px solid #363636;
    padding: 14px;
  }
`;

export const StyledTableBody = styled(TableBody)`
  border: 1px solid #363636;
  border-radius: 3px;
`;
