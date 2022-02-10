import React, { useState } from 'react';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import { PayoutSettingsHeaderIcon } from '../../Icons/PayoutSettingsHeaderIcon';
import { GeneralSettingsContainer } from '../styles';
import {
  StyledTable,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from '../../Table/styles';

const Payouts = () => {
  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock icon={<PayoutSettingsHeaderIcon />} title="Payment Ledger" description="Manage all payouts" />
      </GeneralSettingsContainer>
      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell align="center" width="20%">
                Payment
              </StyledTableCell>
              <StyledTableCell align="center" width="20%">
                Payout
              </StyledTableCell>
              <StyledTableCell align="center" width="20%">
                Deliverable
              </StyledTableCell>
              <StyledTableCell align="center" width="20%">
                Payment Link
              </StyledTableCell>
              <StyledTableCell align="center" width="20%">
                Date
              </StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
        </StyledTable>
      </StyledTableContainer>
    </SettingsWrapper>
  );
};

export default Payouts;
