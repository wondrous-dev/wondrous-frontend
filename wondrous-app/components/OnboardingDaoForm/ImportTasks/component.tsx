import AsanaIcon from 'components/Icons/asana.svg';
import CSVIcon from 'components/Icons/csv.svg';
import GithubIcon from 'components/Icons/github.svg';
import NotionIcon from 'components/Icons/notion.svg';
import {
  Button,
  ButtonCSVTemplate,
  ButtonIconTextWrapper,
  ButtonText,
  ButtonWrapper,
  RightArrow,
  Wrapper,
} from './styles';

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
    <Wrapper>
      <ButtonWrapper>
        {buttons.map(({ text, Icon, borderColor }) => (
          <>
            <Button borderColor={borderColor}>
              <ButtonIconTextWrapper>
                <Icon />
                <ButtonText>{text}</ButtonText>
              </ButtonIconTextWrapper>
              <RightArrow />
            </Button>
          </>
        ))}
      </ButtonWrapper>
      <ButtonCSVTemplate>CSV Template</ButtonCSVTemplate>
    </Wrapper>
  );
};

export default ImportTasks;
