import CSVIcon from 'components/Icons/csv.svg';
import ButtonImport from 'components/OnboardingDaoForm/ButtonImport';
import { ButtonCSVTemplate, ButtonsWrapper, ImportButtonWrapper } from 'components/OnboardingDaoForm/styles';

const buttons = [
  {
    text: 'Import from CSV',
    Icon: CSVIcon,
    borderColor: `linear-gradient(270deg, #7427ff -5.62%, #06ffa5 103.12%)`,
  },
];

const InviteCommunity = () => {
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

export default InviteCommunity;
