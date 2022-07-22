import CSVIcon from 'components/Icons/csv.svg';
import ButtonCSVTemplate from 'components/OnboardingDao/ButtonCSVTemplate';
import ButtonImport from 'components/OnboardingDao/ButtonImport';
import { ButtonsWrapper, ImportButtonWrapper } from 'components/OnboardingDao/styles';
import styled from 'styled-components';

const ImportCsvButton = styled(ButtonImport)`
  background: linear-gradient(270deg, #7427ff -5.62%, #06ffa5 103.12%);
`;

const InviteCommunity = () => {
  return (
    <ButtonsWrapper>
      <ImportButtonWrapper>
        <ImportCsvButton Icon={CSVIcon}>Import from CSV</ImportCsvButton>
      </ImportButtonWrapper>
      <ButtonCSVTemplate />
    </ButtonsWrapper>
  );
};

export default InviteCommunity;
