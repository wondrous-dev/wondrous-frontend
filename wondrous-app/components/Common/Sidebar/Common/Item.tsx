import { ButtonBase, Typography } from '@mui/material';
import { isNumber } from 'lodash';
import styled, { css } from 'styled-components';

const itemButtonGradient = css`
  background: ${({ isActive, theme }) =>
    isActive &&
    `linear-gradient(90.03deg, ${theme.palette.highlightBlue} 0.03%, ${theme.palette.highlightPurple} 98.82%)`};
`;

const ItemButton = styled(ButtonBase)`
  && {
    width: 100%;
    height: 32px;
    padding: 1px;
    border-radius: 4px;
    background: transparent;
    ${itemButtonGradient};
    :hover {
      background: ${({ theme }) => theme.palette.grey87};
      ${itemButtonGradient};
    }
  }
`;

const ItemButtonInner = styled.div`
  border-radius: 3px;
  background: transparent;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px;
  padding-left: 0px;
  background: ${({ isActive, theme }) => isActive && `${theme.palette.grey87}`};
  justify-content: space-between;
  ${ItemButton}:hover & {
    background: ${({ theme }) => theme.palette.grey87};
  }
`;

const ItemButtonIcon = styled.div`
  width: 22px;
  height: 22px;
  background: ${({ bgColor, theme }) => bgColor || `${theme.palette.grey87}`};
  border-radius: ${({ roundedBg }) => (roundedBg ? '50%' : '4px')};
  display: flex;
  align-items: center;
  justify-content: center;
  ${ItemButton}:hover & {
    background: ${({ theme }) => theme.palette.grey87};
  }
  svg {
    path {
      stroke: ${({ theme }) => theme.palette.white};
      ${ItemButton}:hover & {
        stroke: ${({ isActive, theme }) => (isActive ? `${theme.palette.highlightBlue}` : `${theme.palette.blue30}`)};
      }
    }
    rect {
      stroke: ${({ theme }) => theme.palette.white};
      ${ItemButton}:hover & {
        stroke: ${({ isActive, theme }) => (isActive ? `${theme.palette.highlightBlue}` : `${theme.palette.blue30}`)};
      }
    }
  }
  ${({ isActive, theme }) =>
    isActive &&
    `
    background: ${theme.palette.grey87};
    svg {
      path {
        stroke: ${theme.palette.highlightBlue};
      }
      rect {
        stroke: ${theme.palette.highlightBlue};
      }
      
    }
  
  `}
`;

const ItemButtonText = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ isActive, theme }) => (isActive ? `${theme.palette.blue30}` : `${theme.palette.white}`)};
    ${ItemButton}:hover & {
      color: ${({ theme }) => theme.palette.blue30};
      color: ${({ isActive, theme }) => isActive && `${theme.palette.white}`};
    }
  }
`;

const ItemCountText = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.palette.white};
  }
`;

const IconTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Item = ({ children, Icon = null, isActive = false, roundedBg = false, bgColor = '', count = null, ...props }) => (
  <ItemButton {...props} disableRipple isActive={isActive}>
    <ItemButtonInner isActive={isActive}>
      <IconTextWrapper>
        {Icon && (
          <ItemButtonIcon isActive={isActive} roundedBg={roundedBg} bgColor={bgColor}>
            <Icon />
          </ItemButtonIcon>
        )}
        <ItemButtonText isActive={isActive}>{children}</ItemButtonText>
      </IconTextWrapper>
      {isNumber(count) && (
        <ItemButtonIcon isActive={isActive} roundedBg={roundedBg} bgColor={bgColor}>
          <ItemCountText>{count}</ItemCountText>
        </ItemButtonIcon>
      )}
    </ItemButtonInner>
  </ItemButton>
);

export default Item;
