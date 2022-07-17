import AsanaIcon from 'components/Icons/asana.svg';
import CSVIcon from 'components/Icons/csv.svg';
import GithubIcon from 'components/Icons/github.svg';
import NotionIcon from 'components/Icons/notion.svg';
import ButtonImport from 'components/OnboardingDaoForm/ButtonImport';
import { ButtonCSVTemplate, ButtonsWrapper, ImportButtonWrapper } from 'components/OnboardingDaoForm/styles';

const buttons = [
  {
    text: 'Import from CSV',
    Icon: CSVIcon,
    borderColor: `linear-gradient(270deg, #7427ff -5.62%, #06ffa5 103.12%)`,
  },
  {
    text: 'Import from Notion',
    Icon: NotionIcon,
    borderColor: `linear-gradient(270deg, #7427FF -5.62%, #FFFFFF 103.12%)`,
  },
  {
    text: 'Import from Asana',
    Icon: AsanaIcon,
    borderColor: `linear-gradient(270deg, #7427FF -5.62%, #F06A6A 103.12%)`,
  },
  {
    text: 'Import from Github',
    Icon: GithubIcon,
    borderColor: `linear-gradient(270deg, #7427FF -5.62%, #00A2FF 103.12%)`,
  },
];

const ImportTasks = () => {
  return (
    <ButtonsWrapper>
      <ImportButtonWrapper>
        {buttons.map(({ text, Icon, borderColor }) => (
          <ButtonImport key={text} borderColor={borderColor} Icon={Icon} text={text} />
        ))}
      </ImportButtonWrapper>
      <ButtonCSVTemplate>CSV Template</ButtonCSVTemplate>
    </ButtonsWrapper>
  );
};

export default ImportTasks;
