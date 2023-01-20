import { Typography, Table, TableContainer, TableCell, TableBody, TableRow, TableHead } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

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

export const RewardChainHalfBox = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px 6px 10px;
  background: ${(props) =>
    props.hasNoReward ? palette.background.default : props.isRewardBox ? palette.grey85 : palette.grey900};
  border: 1px solid ${palette.grey79};
  border-right-width: ${(props) => (props.isRewardBox ? '0px' : '2px')};
  border-left-width: ${(props) => (props.isRewardBox ? '2px' : '0px')};
  border-top-left-radius: ${(props) => (props.isRewardBox ? '1000px' : '0px')};
  border-bottom-left-radius: ${(props) => (props.isRewardBox ? '1000px' : '0px')};
  border-top-right-radius: ${(props) => (props.isRewardBox ? '0px' : '1000px')};
  border-bottom-right-radius: ${(props) => (props.isRewardBox ? '0px' : '1000px')};
  margin-right: ${(props) => (props.isRewardBox && props.hasNoReward ? '-28px' : props.isRewardBox ? '-14px' : '0px')};
  margin-left: ${(props) => (props.isRewardBox ? 'auto' : '-14px')};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const RewardChainHalfBoxText = styled(Typography)`
  && {
    color: ${(props) => (props.hasNoReward ? palette.grey57 : palette.white)};
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 500;
    width: max-content;
  }
`;

export const TableCellText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 14px;
    text-align: center;
  }
`;
