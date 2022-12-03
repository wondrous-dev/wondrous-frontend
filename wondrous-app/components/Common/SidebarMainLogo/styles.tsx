import ButtonBase from '@mui/material/ButtonBase';
import { Logo } from 'components/Common/ci';
import styled from 'styled-components';

export const LogoButton = styled(ButtonBase)`
  && {
    cursor: pointer;
    position: relative;
  }
`;

export const HeaderLogoBlur = styled(Logo)`
  width: 70px;
  height: 70px;
  filter: blur(15px);
  position: absolute;
  z-index: 100;
  opacity: ${({ activated }) => (activated ? 1 : 0)};
  transition: opacity 0.1s;
  ${LogoButton}:active & {
    opacity: 1;
  }
`;

export const HeaderLogo = styled(Logo)`
  width: 41px;
  height: 31px;
  opacity: ${({ activated }) => (activated ? 1 : 0)};
  transition: opacity 0.1s;
  z-index: 200;
  ${LogoButton}:active & {
    opacity: 1;
  }
`;

export const HeaderLogoWhite = styled(Logo)`
  position: absolute;
  width: 41px;
  height: 31px;
  opacity: ${({ activated }) => (activated ? 0 : 1)};
  transition: opacity 0.1s;
  path {
    fill: white;
  }
  ${LogoButton}:active & {
    opacity: 0;
  }
`;
