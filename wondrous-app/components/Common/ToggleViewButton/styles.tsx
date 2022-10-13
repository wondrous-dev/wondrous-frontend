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
