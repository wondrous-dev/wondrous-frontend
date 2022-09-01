import AsanaIcon from 'components/Icons/asana.svg';
import CSVIcon from 'components/Icons/csv.svg';
import GithubIcon from 'components/Icons/github.svg';
import NotionIcon from 'components/Icons/notion.svg';
import ButtonCSVTemplate from 'components/OnboardingDao/ButtonCSVTemplate';
import { ButtonsWrapper, ImportButtonWrapper } from 'components/OnboardingDao/styles';
import AttachFileIcon from 'components/Icons/attachFile.svg';
import {
  ImportAsanaButton,
  ImportCsvButton,
  ImportGithubButton,
  ImportNotionButton,
  ImportFromCsvWrapper,
  CsvFile,
  CsvFileText,
  CsvFileCloseIcon,
  ImportSuccess,
  ImportSuccessText,
  ImportStatus,
} from './styles';

function ImportFromCsv() {
  return (
    <ImportFromCsvWrapper>
      <ImportCsvButton Icon={CSVIcon}>Import from CSV</ImportCsvButton>
      <ImportStatus>
        <CsvFile>
          <AttachFileIcon /> <CsvFileText>SD-tasks-2022.csv</CsvFileText> <CsvFileCloseIcon />
        </CsvFile>
        <ImportSuccess>
          <ImportSuccessText>Successfully imported</ImportSuccessText>
        </ImportSuccess>
      </ImportStatus>
    </ImportFromCsvWrapper>
  );
}

function ImportTasks() {
  return (
    <ButtonsWrapper>
      <ImportButtonWrapper>
        <ImportFromCsv />
        <ImportNotionButton Icon={NotionIcon}>Import from Notion</ImportNotionButton>
        <ImportAsanaButton Icon={AsanaIcon}>Import from Asana</ImportAsanaButton>
        <ImportGithubButton Icon={GithubIcon}>Import from Github</ImportGithubButton>
      </ImportButtonWrapper>
      <ButtonCSVTemplate />
    </ButtonsWrapper>
  );
}

export default ImportTasks;
