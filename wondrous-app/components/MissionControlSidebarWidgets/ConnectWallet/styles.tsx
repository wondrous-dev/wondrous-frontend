import styled from 'styled-components';
import typography from 'theme/typography';
import palette from 'theme/palette';
import Typography from '@mui/material/Typography';

export const ConnectWalletWidgetWrapper = styled.div`
  background: ${palette.violet950};
  padding: 14px;
  display: flex;
  gap: 14px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 6px;
  border: 1px solid ${palette.violet100};
`;

export const ConnectWalletHeader = styled.div`
  display: flex;
  gap: 12px;
`;

export const ConnectWalletHeaderLabel = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 23px;
    /* identical to box height, or 153% */

    letter-spacing: 0.0025em;

    color: ${palette.blue20};
  }
`;

export const ConnectWalletMessage = styled(Typography)`
  && {
    color: ${palette.white};
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 17px;
    letter-spacing: 0.0025em;
  }
`;
