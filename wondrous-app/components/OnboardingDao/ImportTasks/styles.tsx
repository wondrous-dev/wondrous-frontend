import { Typography } from '@mui/material';
import ButtonImport from 'components/OnboardingDao/ButtonImport';
import styled from 'styled-components';
import CloseIcon from 'components/Icons/close.svg';

export const ImportFromCsvWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ImportCsvButton = styled(ButtonImport)`
  background: linear-gradient(270deg, #7427ff -5.62%, #06ffa5 103.12%);
`;

export const ImportStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CsvFile = styled.div`
  align-items: center;
  background: #282828;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  height: 26px;
  justify-content: center;
  padding: 6px 8px;
  width: fit-content;
`;

export const CsvFileCloseIcon = styled(CloseIcon)`
  path {
    fill: white;
  }
`;

export const CsvFileText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #ffffff;
  }
`;

export const ImportSuccess = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 6px;
  background: rgba(6, 255, 165, 0.1);
  border-radius: 4px;
  width: fit-content;
`;

export const ImportSuccessText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    background: linear-gradient(180deg, #ffffff 0%, #06ffa5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const ImportNotionButton = styled(ButtonImport)`
  background: linear-gradient(270deg, #7427ff -5.62%, #ffffff 103.12%);
`;

export const ImportAsanaButton = styled(ButtonImport)`
  background: linear-gradient(270deg, #7427ff -5.62%, #f06a6a 103.12%);
`;

export const ImportGithubButton = styled(ButtonImport)`
  background: linear-gradient(270deg, #7427ff -5.62%, #00a2ff 103.12%);
`;
