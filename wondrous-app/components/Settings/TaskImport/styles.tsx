import styled from 'styled-components';
import palette from 'theme/palette';
import { Button as MuiButton, Typography, InputBase } from '@mui/material';
import { CreateLayoutsModal } from 'components/CreateEntity/styles';

export const TaskImportContainer = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 765px;
`;

export const TaskImportMethodBlock = styled.div`
  padding: 30px 0;
  border-bottom: 1px solid #363636;
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
  justify-content: space-between;
`;

// same as IntegrationsSnapshotButton
export const ConnectToNotionButton = styled(MuiButton)`
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
    @media (max-width: 1096px) {
      margin-top: 10px;
      margin-left: 0;
    }
  }
`;

export const LabelBlock = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
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

export const ModalBody = styled(CreateLayoutsModal)`
  && {
    width: 50%;
    max-width: 600px;
  }
`;
