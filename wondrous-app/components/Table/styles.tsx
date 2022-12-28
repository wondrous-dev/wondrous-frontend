import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from 'styled-components';
import { color } from 'styled-system';

export const Box = styled.div`
  ${color}
`;

export const StyledTable = styled(Table)`
  && {
    width: 100%;
    margin: 25px 0;
    border-collapse: separate;
  }
`;

export const StyledTableBody = styled(TableBody)`
  border: 1px solid #363636;
  border-radius: 3px;
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
    border: none;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0em;
    border-radius: 4px;
    border: 1px solid #363636;
  }
`;

export const StyledTableRow = styled(TableRow)`
  //cursor: pointer;

  & .MuiTableCell-body {
    border: 1px solid #363636;
    padding: 14px;
  }

  // & .MuiTableCell-root {
  // 	vertical-align: top;
  // }
`;

export const StyledTableCell = styled(TableCell)`
  &.clickable {
    cursor: pointer;
  }

  svg {
    width: 28px;
    height: 28px;
  }
`;

export const TaskTitle = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;

    a {
      color: white;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export const Initials = styled.a`
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.01em;
  text-decoration-line: underline;
  color: #00baff;
  cursor: pointer;
`;

export const RewardContainer = styled.div`
  display: flex;
  justify-content: center;

  svg {
    width: 16px;
  }
`;

export const Reward = styled.div`
  height: 28px;
  background: #1f1f1f;
  border-radius: 300px;
  display: flex;
  align-items: center;
  padding: 7px 8px;
`;

export const RewardAmount = styled(Typography)`
  && {
    color: #ffffff;
    font-weight: 600;
    font-size: 13px;
    margin-left: 8px;
    line-height: 14px;
  }
`;

export const MoreOptions = styled(Button)`
  && {
    width: 24px;
    height: 24px;
    min-width: 0;
    border-radius: 100%;
    color: #545454;
  }

  svg {
    height: 24px;
  }
`;
