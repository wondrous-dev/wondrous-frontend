import { ButtonBase } from '@mui/material';
import styled, { css } from 'styled-components';

const MissionControlButtonBeforeHover = css`
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    height: 40px;
    width: 40px;
    outline: ${({ theme }) => `2px solid ${theme.palette.highlightPurple}`};
    border-radius: 50%;
    z-index: -1;
    background: transparent;
  }
`;

const MissionControlButtonBefore = css`
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    height: 40px;
    width: 40px;
    border-radius: 50%;
    z-index: -1;
    background: linear-gradient(180deg, #7427ff 0%, #f2c678 100%);
  }
`;

export const MissionControlIconWrapper = styled.div`
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 36px;
  justify-content: center;
  position: relative;
  width: 36px;
  z-index: 2;
  background: ${({ theme }) => theme.palette.grey87};
`;

const MissionControlIconHighlight = css`
  ${MissionControlIconWrapper} {
    background: linear-gradient(180deg, #7427ff 0%, #f2c678 100%);
    svg {
      defs {
        linearGradient {
          stop {
            stop-color: ${({ theme }) => theme.palette.white};
          }
        }
      }
    }
  }
`;

export const MissionControlButton = styled(ButtonBase)`
  && {
    align-items: center;
    border-radius: 50%;
    display: flex;
    height: 36px;
    justify-content: center;
    position: relative;
    width: 36px;
    z-index: 2;
    ${MissionControlButtonBefore}
    :hover {
      ${MissionControlButtonBeforeHover}
      ${MissionControlIconHighlight}
    }
    ${({ isActive }) => isActive && MissionControlButtonBeforeHover}
    ${({ isActive }) => isActive && MissionControlIconHighlight}
  }
`;
