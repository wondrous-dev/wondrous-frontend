import { ButtonUnstyled } from '@mui/base';
import styled from 'styled-components';
import palette from 'theme/palette';

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 14px;
  padding-top: 14px;
  margin: auto;
  justify-content: center;
  padding: 14px 8px 0px 8px;
  width: 100%;
`;

export const SettingsBtn = styled(ButtonUnstyled)`
  && {
    width: 100%;
    height: 28px;
    background: #4b4b4b;
    color: ${palette.white};
    border: none;
    border-radius: 50px;
    font-family: 'Space Grotesk';
    font-size: 15px;
    font-weight: 600;
    :hover {
      cursor: pointer;
      background: #454545;
    }
  }
`;
