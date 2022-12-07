import styled from 'styled-components';
import palette from 'theme/palette';
import { Button as MuiButton, Typography } from '@mui/material';
import { CreateLayoutsModal, CreateFormPreviewButton } from 'components/CreateEntity/styles';
import NotionIcon from 'components/Icons/Notion';
import CloseIcon from '@mui/icons-material/Close';
import DocumentIcon from 'components/Icons/DocumentIcon';

export const TaskImportContainer = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 765px;
  margin-left: auto;
  margin-right: auto;
`;

export const TaskImportMethodBlock = styled.div`
  padding-top: 30px;
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

// same as IntegrationsConnectButton
export const ConnectToNotionButton = styled(MuiButton)`
  && {
    white-space: nowrap;
    min-width: min-content;
    padding: 8px 16px;
    height: 40px;
    background: ${palette.background};
    border: 1px solid deepskyblue;
    margin-top: 4px;
    //text
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: ${palette.white};
    .MuiCircularProgress-root {
      margin-right: 10px;
    }
    .Mui-disabled {
      color: ${palette.white};
    }
    @media (max-width: 1096px) {
      margin-top: 10px;
      margin-left: 0;
    }
  }
`;
export const NotionActionsContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const DisconnectFromNotionButton = styled(MuiButton)`
  && {
    border: none;
    background: none;
    display: flex;
    cursor: pointer;
    align-items: center;
    margin-left: 8px;
    font-weight: 500;
    font-size: 14px;
    line-height: 150%;
    color: ${palette.white};
  }
`;

export const DisconnectFromNotionButtonIcon = styled(CloseIcon)`
  && {
    width: 18px;
    height: 18px;
  }
`;

export const GenericImportTasksButton = styled(ConnectToNotionButton)``;

export const ImportTasksIcon = styled(DocumentIcon)`
  && {
    width: 18px;
    height: 18px;
    margin-right: 10px;
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

export const ModalBody = styled(CreateLayoutsModal)`
  && {
    width: 50%;
    max-width: 600px;
  }
`;

export const NotionImportButton = styled(CreateFormPreviewButton)`
  && {
    margin-top: 24px;
  }
`;

export const NotionInButtonIcon = styled(NotionIcon)`
  && {
    margin-right: 10px;
  }
`;
