import React from 'react';
import {
  StyledTable,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
  StyledTableBody,
} from './styles';

const Table = () => (
  <StyledTableContainer>
    <StyledTable>
      <StyledTableHead>
        <StyledTableRow>
          <StyledTableCell align="center" width="56px">
            DAO
          </StyledTableCell>
          <StyledTableCell align="center">Created by :</StyledTableCell>
          <StyledTableCell align="center">Status</StyledTableCell>
          <StyledTableCell align="center">Reward</StyledTableCell>
        </StyledTableRow>
      </StyledTableHead>

      <StyledTableBody>
        <StyledTableCell align="center">Wonder</StyledTableCell>
        <StyledTableCell align="center">Owner</StyledTableCell>
        <StyledTableCell align="center">Open</StyledTableCell>
        <StyledTableCell align="center">1000$</StyledTableCell>
      </StyledTableBody>

      <StyledTableBody>
        <StyledTableCell align="center">Wonder</StyledTableCell>
        <StyledTableCell align="center">Owner</StyledTableCell>
        <StyledTableCell align="center">Open</StyledTableCell>
        <StyledTableCell align="center">1000$</StyledTableCell>
      </StyledTableBody>

      <StyledTableBody>
        <StyledTableCell align="center">Wonder</StyledTableCell>
        <StyledTableCell align="center">Owner</StyledTableCell>
        <StyledTableCell align="center">Open</StyledTableCell>
        <StyledTableCell align="center">1000$</StyledTableCell>
      </StyledTableBody>
    </StyledTable>
  </StyledTableContainer>
);

export default Table;
