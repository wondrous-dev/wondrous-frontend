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
  flex-direction: column;
  gap: 14px;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 28px 0;
  }
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
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
    font-size: 14px;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  border-radius: 4px;
  ${({ isActive }) => isActive && `background: ${palette.highlightPurple};`};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 36px;
    width: 36px;
    svg {
      width: 36px;
      height: 36px;
    }
  }
`;

export const CheckedBox = styled((props) => <CheckedBoxIcon {...props} stroke="white" pathFill="none" />)``;
