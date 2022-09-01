import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const ToggleWrapper = styled.div`
  display: flex;
  padding: 6px;
  background: ${palette.black101};
  border-radius: 6px;
  height: 40px;
  gap: 16px;
`;

export const ToggleItem = styled.button`
  background: ${({ isActive, gradient = 'linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%)' }) =>
    isActive ? gradient : 'transparent'};
  border-radius: 6px;
  border: 0px;
  color: ${palette.white};
  font-family: ${typography.fontFamily};
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  line-height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: 0% 50%;
  position: relative;
  padding: 8px;
  margin-left: 6px;
  min-width: 100px;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    background: none;
    filter: blur(10px);
    border-radius: 100%;
    left: 0;
    top: 0;
  }

  &:hover {
    ${({ isActive }) => !isActive && `background: ${palette.black92};`}
  }
  ${({ isActive }) =>
    isActive &&
    `
  animation-duration: 0.5s;
  &::before {
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
  }
`}
`;
