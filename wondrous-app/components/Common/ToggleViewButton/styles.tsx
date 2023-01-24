import styled from 'styled-components';
import palette from 'theme/palette';

export const ToggleViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  padding: 4px 5px;
  background: #1b1b1b;
  height: 40px;
  width: fit-content;
  gap: 3px;
`;

export const ToggleViewOption = styled.div`
  height: 100%;
  display: flex;
  color: ${palette.white};
  justify-content: center;
  align-items: center;
  &.active {
    background: #0f0f0f;
    opacity: 1;
    &:hover {
      background: #0f0f0f;
    }
  }
  &.disabled {
    pointer-events: none;
    opacity: 0.4;
  }
  padding: 8.5px;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.4;
  &:hover {
    background: #232323;
  }
`;

export const ButtonArrow = styled.div`
  svg {
    transform: ${({ isOpen }) => (isOpen ? 'rotate(-180deg)' : 'rotate(0deg)')};
    margin: 0 4px 0 7px;
  }
`;

export const DropdownWrapper = styled.div`
  position: relative;
`;

export const DropdownHeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 57px;
  height: 40px;
  cursor: pointer;
  background-color: ${palette.black101};
  border-radius: 6px;
  padding: 5px;
`;

export const DropdownHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: ${palette.background.default};
`;

export const DropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 45px;
  z-index: 100;
  background-color: ${palette.black101};
  border-radius: 6px;
  width: 57px;
  padding: 5px 5px;
`;
