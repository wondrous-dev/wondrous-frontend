import styled from 'styled-components';
import palette from 'theme/palette';
import { Button as MuiButton, Typography, InputBase } from '@mui/material';
import typography from 'theme/typography';

export const IntegrationsContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TableValueText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 14px;
    font-height: 22px;
  }
`;

export const IntegrationsAddressInput = styled(InputBase)`
  && {
    max-width: 100%;
    height: 40px;
    border: 1px solid #4b4b4b;
    border-radius: 6px;
    margin-right: 16px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
    padding: 10px 15px;
  }
`;

export const IntegrationsInputsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const IntegrationsSnapshotBlock = styled.div`
  width: 100%;
  height: min-content;
  display: flex;
  flex-direction: column;
`;

export const IntegrationsSnapshotSubBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-wrap: wrap;
`;

export const IntegrationsSnapshotInputSubBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const IntegrationsSnapshotENSInput = styled(InputBase)`
  && {
    height: 40px;
    border: 1px solid ${palette.highlightPurple};
    border-radius: 6px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: white;
    background: ${palette.grey940};
    padding: 10px 15px;
  }
`;

export const IntegrationsHelperText = styled(Typography)`
  && {
    font-size: 12px;
    line-height: 15px;
    color: #c4c4c4;
    margin-bottom: 6px;
  }
`;

export const IntegrationsConnectButton = styled(MuiButton)`
  && {
    white-space: nowrap;
    min-width: min-content;
    padding: 8px 16px;
    height: 40px;
    background: #0f0f0f;
    border: 1px solid deepskyblue;
    margin-left: 10px;
    //text
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ffffff;
    .MuiCircularProgress-root {
      margin-right: 10px;
    }
    .Mui-disabled {
      color: #ffffff;
    }
    @media (max-width: 683px) {
      margin-top: 10px;
      margin-left: 0;
    }
  }
`;

export const IntegrationsDisconnectButton = styled(MuiButton)`
  && {
    white-space: nowrap;
    min-width: min-content;
    padding: 8px 16px;
    height: 40px;
    background: #0f0f0f;
    border: 1px solid ${palette.red200};
    margin-left: 10px;
    //text
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ffffff;
    .MuiCircularProgress-root {
      margin-right: 10px;
    }
    .Mui-disabled {
      color: #ffffff;
    }
    @media (max-width: 683px) {
      margin-top: 10px;
      margin-left: 0;
    }
  }
`;

// same as the component in components/Settings/styles.tsx should we import?
export const LabelBlock = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: ${palette.blue20};
    margin-bottom: 10px;
  }
`;

export const LabelBlockText = styled(Typography)`
  && {
    color: ${palette.white};
    font-family: Space Grotesk;
    font-size: 14px;
    margin-bottom: 12px;
  }
`;

export const FilterItem = styled.button`
  text-align: center;
  font-family: ${typography.fontFamily};
  color: ${palette.white};
  font-size: 13px;
  line-height: 13px;
  cursor: pointer;
  font-weight: 500;
  border-radius: 6px;
  background: ${({ isActive }) =>
    isActive ? 'linear-gradient(272.64deg, #4F00DE -5.53%, #1D1D1D 144.18%)' : palette.grey900};
  border: ${({ isActive }) => `1px solid ${isActive ? palette.highlightPurple : palette.grey87}`};
  box-shadow: ${({ isActive }) => (isActive ? `0px 0px 4px ${palette.highlightPurple}` : 'none')};
  padding: 9.5px 13.5px;
  &:hover {
    background: linear-gradient(272.64deg, #4f00de -5.53%, #1d1d1d 144.18%);
    border: 1px solid ${palette.highlightPurple};
    box-shadow: 0px 0px 4px ${palette.highlightPurple};
  }
`;

export const DiscordIntegrationPanel = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px;
  border-radius: 4px;
  width: 100%;
  background: ${palette.grey900};
`;

export const Label = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-size: 13px;
    line-height: 13px;
    font-weight: 500;
    color: ${palette.blue20};
  }
`;

export const TelegramLabel = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 500;
    font-size: 13px;
    line-height: 13px;
    color: ${palette.grey250};
  }
`;

export const TelegramBotInfo = styled(Typography)`
  && {
    color: ${palette.white};
    font-family: ${typography.fontFamily};
    font-weight: 400;
    font-size: 13px;
    line-height: 17px;
  }
`;
