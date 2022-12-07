import styled from 'styled-components';
import palette from 'theme/palette';
import { InputBase, Typography } from '@mui/material';

export const WalletsContainer = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 765px;
  margin-left: auto;
  margin-right: auto;
`;

export const TableValueText = styled(Typography)`
  && {
    color: ${palette.white};
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
    color: ${palette.white};
    padding: 10px 15px;
  }
`;
