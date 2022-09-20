import { CircularProgress } from '@mui/material';
import AttachFile from 'components/Icons/attachFile.svg';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const Wrapper = styled.div`
  padding: 24px 0;
  ${({ isDragActive }) =>
    isDragActive &&
    `> div {
    background: ${palette.grey76};
  }`};
`;

export const DropZone = styled.div`
  display: flex;
  width: 100%;
  border: 2px dashed ${palette.grey80};
  border-radius: 4px;
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${typography.fontFamily};
  color: ${palette.grey57};
  font-weight: 500;
  padding: 24px;
`;

export const ClickToUpload = styled.span`
  && {
    color: ${palette.blue20};
    cursor: pointer;
  }
`;

export const CircularProgressWrapper = styled(CircularProgress)`
  &[style] {
    width: 16px !important;
    height: 16px !important;
  }
`;

export const Progress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const Attachment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export const AttachmentIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AttachmentIcon = styled(AttachFile)`
  && {
    width: 28px;
    height: 28px;
    path {
      stroke: ${palette.grey57};
    }
  }
`;
