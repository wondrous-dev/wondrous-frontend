import { ButtonBase, Typography } from '@mui/material';
import { isNumber } from 'lodash';
import styled from 'styled-components';

const ItemButton = styled(ButtonBase)`
  && {
    border-radius: 3px;
    background: transparent;
    height: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 4px;
    background: ${({ isActive, theme }) => isActive && `${theme.palette.black101}`};
    justify-content: space-between;
    :hover {
      background: ${({ theme }) => theme.palette.black101};
    }
  }
`;

const ItemButtonIcon = styled.div`
  width: 22px;
  height: 22px;
  background: ${({ bgColor, theme, isActive }) =>
    bgColor || (isActive && `${theme.palette.highlightPurple}`) || `${theme.palette.grey87}`};
  border-radius: ${({ roundedBg }) => (roundedBg ? '50%' : '4px')};
  display: flex;
  align-items: center;
  justify-content: center;
  ${ItemButton}:hover & {
    background: ${({ theme }) => theme.palette.highlightPurple};
  }
  svg {
    path {
      stroke: ${({ theme }) => theme.palette.white};
    }
    rect {
      stroke: ${({ theme }) => theme.palette.white};
    }
  }
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
    color: ${({ theme }) => theme.palette.white};
  }
`;

const IconTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Count = styled.div`
  width: 22px;
  height: 22px;
  background: ${({ theme }) => theme.palette.grey87};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  > ${ItemButtonText} {
    color: ${({ theme, isActive }) => (isActive ? theme.palette.highlightBlue : theme.palette.grey250)};
    ${ItemButton}:hover & {
      color: ${({ theme }) => theme.palette.highlightBlue};
    }
  }
`;

const Item = ({ children, Icon = null, isActive = false, roundedBg = false, bgColor = '', count = null, ...props }) => (
  <ItemButton {...props} disableRipple isActive={isActive}>
    <IconTextWrapper>
      {Icon && (
        <ItemButtonIcon isActive={isActive} roundedBg={roundedBg} bgColor={bgColor}>
          <Icon />
        </ItemButtonIcon>
      )}
      <ItemButtonText>{children}</ItemButtonText>
    </IconTextWrapper>
    {isNumber(count) && (
      <Count isActive={isActive}>
        <ItemButtonText>{count}</ItemButtonText>
      </Count>
    )}
  </ItemButton>
);

export default Item;
