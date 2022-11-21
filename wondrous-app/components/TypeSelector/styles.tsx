import styled from 'styled-components';
import palette from 'theme/palette';

export const Wrapper = styled.div`
  display: flex;
`;

export const StatItem = styled.span`
  min-height: 34px;
  width: fit-content;
  background: #1c1c1c;
  position: relative;
  border-radius: 180px;
  margin-right: 22px;
  font-family: var(--font-space-grotesk);
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 0.01em;
  padding: 4px 20px 4px 4px;
  border: 1px solid transparent;
  cursor: pointer;
  ${({ isActive }) =>
    isActive &&
    `
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 180px;
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
  `}
`;

export const IconWrapper = styled.div`
  border-radius: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
  margin-right: 6px;
  background: ${({ isActive }) => (isActive ? palette.highlightBlue : palette.highlightPurple)};
`;

export const StatTitle = styled.span`
  color: ${({ isActive }) => (isActive ? '#cbbbff' : '#828282')};
  margin-left: 3px;
`;

export const StatValue = styled.span`
  color: ${palette.white};
`;
