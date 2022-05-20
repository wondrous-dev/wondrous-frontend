import styled from 'styled-components';
import { White } from '../../../theme/colors';
import { Button as MuiButton, InputBase, ListItemIcon, Typography } from '@material-ui/core';

export const WalletsContainer = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 765px;
`;

export const TableValueText = styled(Typography)`
  && {
    color: ${White};
    font-size: 14px;
    font-height: 22px;
  }
`;

export const WalletAddressInput = styled(InputBase)`
  && {
    width: 100%;
    height: 40px;
    border: 1px solid #4b4b4b;
    border-radius: 6px;
    margin-right: 16px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: ${White};
    padding: 10px 15px;
  }
`;
