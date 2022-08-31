import { ButtonBase } from '@mui/material';
import styled, { css } from 'styled-components';

const ButtonIconBefore = css`
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    height: 40px;
    width: 40px;
    background: #232323;
    outline: 2px solid #7427ff;
    border-radius: 50%;
    z-index: -1;
  }
`;

export const ButtonIcon = styled(ButtonBase)`
  && {
    align-items: center;
    background-color: #313131;
    border-radius: 50%;
    display: flex;
    height: 36px;
    justify-content: center;
    position: relative;
    width: 36px;
    z-index: 2;
    :hover {
      ${ButtonIconBefore}
    }
    ${({ isActive }) => isActive && ButtonIconBefore}
  }
`;

const AddIconActive = css`
  background: #4f00de;
  svg {
    defs {
      linearGradient {
        stop {
          stop-color: #ffffff;
        }
      }
    }
  }
`;

export const AddIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #313131;
  border-radius: 50%;
  ${ButtonIcon}:hover & {
    ${AddIconActive}
  }
  ${({ isActive }) => isActive && AddIconActive}
`;
