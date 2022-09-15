import SettingsIcon from 'components/Icons/settings.svg';
import styled from 'styled-components';

export const StyledSettingsIcon = styled(SettingsIcon)`
  && {
    transform: scale(70%);
  }
`;

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;
