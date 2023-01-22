import { Table, TableContainer, TableCell, TableBody, TableRow, TableHead } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

export const imageStyle = {
  width: '32px',
  height: '32px',
  minWidth: '32px',
  minHeight: '32px',
  borderRadius: '16px',
  marginRight: '8px',
};

export const EmptyStateWrapper = styled.div`
  width: 100% !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${palette.white};
  border-radius: 6px;
  border: 1px solid ${palette.black95};
  background: transparent;
  gap: 14px;
  position: relative;
  padding: 38px;
  height: fit-content;
`;

export const StyledTableContainer = styled(TableContainer)`
  && {
    width: 100%;
    overflow-x: visible;
    min-width: 890px;
  }
`;

export const StyledTable = styled(Table)`
  && {
    width: 100%;
    margin: 14px 0;
    border-collapse: collapse;
  }
`;

export const StyledTableHead = styled(TableHead)`
  .MuiTableCell-head {
    color: ${palette.blue20};
    background: ${palette.black97};
    border: none;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0em;
    border-radius: 0px;
    padding: 10px !important;
  }

  .MuiTableCell-head:first-of-type {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  .MuiTableCell-head:last-of-type {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

export const StyledTableBody = styled(TableBody)`
  && {
    border: none;
    margin-top: 14px;
  }
`;

export const StyledTableRow = styled(TableRow)`
  & .MuiTableCell-body {
    border: none;
    border-radius: 6px;
    padding: 8px;
  }
`;

export const StyledTableCell = styled(TableCell)`
  && {
    padding: 14px;
  }

  &.clickable {
    cursor: pointer;
  }

  svg {
    width: 28px;
    height: 28px;
  }
`;
