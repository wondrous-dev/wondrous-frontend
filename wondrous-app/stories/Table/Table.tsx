import React from 'react';
import {
  StyledTable,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
  LoadMore,
  CreateModalOverlay,
} from './style';

export const Table = () => {
  return (
    <>
      <CreateModalOverlay aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      </CreateModalOverlay>

      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell align="center" width="56px">
                DAO
              </StyledTableCell>
              <StyledTableCell align="center" width="105px">
                Created by :
              </StyledTableCell>
              <StyledTableCell align="center" width="77px">
                Status
              </StyledTableCell>
              <StyledTableCell width="383px">Task</StyledTableCell>
              {/*<StyledTableCell width="190px">Deliverables</StyledTableCell>*/}
              <StyledTableCell align="center" width="88px">
                Reward
              </StyledTableCell>
              <StyledTableCell align="center" width="80px">
                Decision
              </StyledTableCell>
              <StyledTableCell width="54px" />
            </StyledTableRow>
          </StyledTableHead>
        </StyledTable>

        <LoadMore />
      </StyledTableContainer>
    </>
  );
};
