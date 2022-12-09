import { ButtonBase, Typography } from '@mui/material';
import { PageItemContainer } from 'components/HeaderItems/UserProfile/styles';
import { UnstyledButton } from 'components/WorkspacePicker/styles';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';

const backgroundColor = css`
  background: ${({ theme }) =>
    `linear-gradient(180deg, ${theme.palette.highlightBlue} 0%, ${theme.palette.orange90} 100%)`};
`;

const PodsButtonBeforeHover = css`
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
    ${backgroundColor};
  }
`;

export const PodsIconWrapper = styled.div`
  background: ${palette.grey87};
  border-radius: 300px;
  height: 38px;
  width: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 180px;
    background: linear-gradient(180deg, #00baff 0%, #f2c678 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
`;

const PodIconHighlight = css`
  ${PodsIconWrapper} {
    ${backgroundColor};
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

export const PodsButtonWrapper = styled(UnstyledButton)`
  && {
    .BaseBadge-root {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
  }
`;

export const PodsItem = styled(PageItemContainer)`
  && {
    &:hover {
      ${PodsIconWrapper} {
        border: 2px solid ${palette.highlightPurple};
        background: linear-gradient(180deg, #00baff 0%, #f2c678 100%) !important;
      }
    }
  }
`;
