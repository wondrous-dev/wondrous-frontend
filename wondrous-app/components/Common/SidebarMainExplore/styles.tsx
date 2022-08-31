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

export const ExploreButton = styled(ButtonBase)`
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

const ExplorerIconActive = css`
  background: linear-gradient(206.66deg, #ccbbff -18.49%, #7427ff 109.85%, #00baff 252.3%);
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

export const ExploreIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #313131;
  border-radius: 50%;
  ${ExploreButton}:hover & {
    ${ExplorerIconActive}
  }
  ${({ isActive }) => isActive && ExplorerIconActive}
`;
