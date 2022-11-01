import styled from 'styled-components';

export const ProgressBarWrapper = styled.div`
  width: 100%;
  z-index: 1000;
  position: fixed;
  top: 0%;
  height: 3px;
  background-color: transparent;
`;

export const ProgressBarInner = styled.div`
  height: 100%;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
  ${({ isVisible }) =>
    isVisible
      ? `@keyframes grow {
    from {
      width: 0%;
    }
    to {
      width: 100%;
    }
  }`
      : `width: 0%;`};

  animation-name: grow;
  animation-duration: 0.5s;
`;
