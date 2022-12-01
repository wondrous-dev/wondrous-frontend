import { CheckedBoxIcon } from 'components/Icons/checkedBox';
import styled from 'styled-components';
import palette from 'theme/palette';

export const Wrapper = styled.div`
  background: transparent;
  width: fit-content;
  min-width: 100%;
  border-radius: 6px;
  padding: 8px;
  color: ${palette.grey250};
  font-weight: 500;

  display: ${({ show }) => (show ? 'block' : 'none')};
`;

export const Item = styled.button`
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  background: transparent;
  width: 100%;
  font-weight: inherit;
  color: inherit;
  font-family: inherit;
  border: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  outline: none;

  ${({ isActive }) =>
    isActive &&
    `
  
  outline: none;
  background: ${palette.black92};
  color: ${palette.white};
  `}
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  border-radius: 4px;
  ${({ isActive }) => isActive && `background: ${palette.highlightPurple};`}
`;

export const CheckedBox = styled((props) => <CheckedBoxIcon {...props} stroke="white" pathFill="none" />)``;
