import styled from 'styled-components';
import typography from 'theme/typography';
import palette from 'theme/palette';
import Typography from '@mui/material/Typography';
import { Button } from 'components/Common/Wallet/styles';

export const ConnectWalletWidgetWrapper = styled.div`
  background: ${palette.violet950};
  padding: 14px;
  display: flex;
  gap: 14px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 6px;
  border: 1px solid ${palette.violet100};
  ${Button} {
    background: ${palette.background.default};
    position: relative;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        270deg,
        ${palette.blue20} -5.62%,
        ${palette.highlightPurple} 45.92%,
        ${palette.highlightBlue} 103.12%
      );
      mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
      mask-composite: xor;
      padding: 1.8px;
      border-radius: 1000px;
    }
    &:hover {
      background: linear-gradient(
        270deg,
        ${palette.blue20} -5.62%,
        ${palette.highlightPurple} 45.92%,
        ${palette.highlightBlue} 103.12%
      );
    }
  }
`;

export const ConnectWalletHeader = styled.div`
  display: flex;
  gap: 12px;
  flex-basis: 100%;
  align-items: center;
  width: 100%;
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

export const DismissButton = styled.button`
  border: 0;
  background: ${palette.violet50};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
`;

export const DismissButtonWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;
