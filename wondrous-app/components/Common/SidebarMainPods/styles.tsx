import { ButtonBase, Typography } from '@mui/material';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';

const PodsButtonBeforeHover = css`
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    height: 40px;
    width: 40px;
    outline: 2px solid #7427ff;
    border-radius: 50%;
    z-index: -1;
    background: transparent;
  }
`;

const PodsButtonBefore = css`
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
    background: linear-gradient(180deg, #00baff 0%, #f2c678 100%);
  }
`;

export const PodsIconWrapper = styled.div`
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 36px;
  justify-content: center;
  position: relative;
  width: 36px;
  z-index: 2;
  background: #313131;
`;

const PodIconHighlight = css`
  ${PodsIconWrapper} {
    background: linear-gradient(180deg, #00baff 0%, #f2c678 100%);
    svg {
      defs {
        linearGradient {
          stop {
            stop-color: #ffffff;
          }
        }
      }
    }
  }
`;

export const PodsButton = styled(ButtonBase)`
  && {
    align-items: center;
    border-radius: 50%;
    display: flex;
    height: 36px;
    justify-content: center;
    position: relative;
    width: 36px;
    z-index: 2;
    ${PodsButtonBefore}
    :hover {
      ${PodsButtonBeforeHover}
      ${PodIconHighlight}
    }
    ${({ isActive }) => isActive && PodsButtonBeforeHover}
    ${({ isActive }) => isActive && PodIconHighlight}
  }
`;

export const PodModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const PodModalFooterInfoWrapper = styled.div`
  background: ${({ theme }) =>
    `linear-gradient(0deg, ${theme.palette.black101}, ${theme.palette.black101}), ${theme.palette.background.default}`};
  border-radius: 4px;
  padding: 4px 8px;
  margin-right: 8px;
`;

export const PodModalFooterInfoWrapperText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 13px;
  }
`;
