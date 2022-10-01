import { Typography } from '@mui/material';
import styled from 'styled-components';
import DocumentIcon from 'components/Icons/DocumentIcon';
import typography from 'theme/typography';
import palette from 'theme/palette';

export const DropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  border: 2px dashed ${palette.grey78};
  border-radius: 6px;
  cursor: pointer;
  color: ${palette.grey78};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease-out;

  :hover {
    border: 2px dashed ${palette.grey850};
    color: ${palette.grey850};
  }
`;

export const DropZoneFileContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const DropZoneIcon = styled(DocumentIcon)`
  && {
    width: 36px;
    height: 36px;
  }
`;

export const DropZoneFileName = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 500;
    font-size: 12px;
    color: ${palette.white};
    background: ${palette.grey850};
    padding: 2px 8px;
    border-radius: 60px;
  }
`;

export const DropZoneFileRemoveButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
`;
