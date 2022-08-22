import { ButtonBase, Typography } from '@mui/material';
import styled from 'styled-components';

const ItemButton = styled(ButtonBase)`
  && {
    width: 100%;
    height: 32px;
    padding: 1px;
    border-radius: 4px;
    background: transparent;
    background: ${({ isActive }) => isActive && 'linear-gradient(90.03deg, #00baff 0.03%, #7427ff 98.82%)'};
    :hover {
      background: #313131;
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
  background: ${({ isActive }) => isActive && '#313131'};
  ${ItemButton}:hover & {
    background: #313131;
  }
`;

const ItemButtonIcon = styled.div`
  width: 22px;
  height: 22px;
  background: ${({ bgColor }) => bgColor || `#313131`};
  border-radius: ${({ roundedBg }) => (roundedBg ? '50%' : '4px')};
  display: flex;
  align-items: center;
  justify-content: center;
  ${ItemButton}:hover & {
    background: #313131;
  }
  svg {
    path {
      stroke: #ffffff;
    }
    rect {
      stroke: #ffffff;
    }
    ${ItemButton}:hover & 
    path {
      stroke: #8fe1ff;
    }
    ${ItemButton}:hover & 
    rect {
      stroke: #8fe1ff;
    }
  }
  ${({ isActive }) =>
    isActive &&
    `
    background: #313131;
    svg {
      path {
        stroke: #00baff;
      }
      rect {
        stroke: #00baff;
      }
  }
  `}
`;

const ItemButtonText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ isActive }) => (isActive ? '#00baff' : '#fff')};
    ${ItemButton}:hover & {
      color: #8fe1ff;
    }
  }
`;

const Item = ({ children, Icon = null, isActive = false, roundedBg = false, bgColor = '', ...props }) => (
  <ItemButton {...props} disableRipple isActive={isActive}>
    <ItemButtonInner isActive={isActive}>
      {Icon && (
        <ItemButtonIcon isActive={isActive} roundedBg={roundedBg} bgColor={bgColor}>
          <Icon />
        </ItemButtonIcon>
      )}
      <ItemButtonText isActive={isActive}>{children}</ItemButtonText>
    </ItemButtonInner>
  </ItemButton>
);

export default Item;
