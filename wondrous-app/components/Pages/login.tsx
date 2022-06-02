import styled from 'styled-components';
import { Logotype } from '../Common/ci';
import { redColors, white } from 'theme/colors';

export const SmallLogo = styled(Logotype)`
  && {
    max-height: 30px;
    max-width: 130px;
    margin-bottom: 30px;
  }
`;

export const LoginWrapper = styled.div`
  && {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .auth-background {
    z-index: 11;
  }
`;

export const TopBubble = styled.img`
  z-index: 14;
  position: absolute;
  left: 50vw;
  top: 0;

  @media (max-width: 745px) {
    display: none;
  }
  @media (max-height: 775px) {
    max-height: 25%;
  }
  @media (min-height: 775px) and (max-height: 965px) {
    max-height: min(275px, 30%);
  }
  @media (orientation: portrait) {
    display: none;
  }
`;

export const LoginError = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  height: 40px;
  margin: 1em 0;

  background: ${redColors.red800};
  background: linear-gradient(196.76deg, ${white} -48.71%, ${redColors.red300} 90.48%);

  border-radius: 6px;
`;
