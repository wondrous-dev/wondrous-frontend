import styled from 'styled-components';

export const StepTitle = styled.h1`
  font-family: var(--font-space-grotesk);
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
  background: ${({ gradient }) => gradient || 'white'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const StepBody = styled.span`
  font-family: var(--font-space-grotesk);
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 27px;
  color: white;
`;

export const NextButton = styled.button`
  background: #7427ff;
  border-radius: 6px;
  padding: 10px;
  text-align: center;
  border: 0;
  font-family: var(--font-space-grotesk);
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  letter-spacing: 0.01em;
  text-align: center;
  color: white;
  cursor: pointer;
`;

export const PrevButton = styled.button`
  background: #313131;
  border-radius: 6px;
  padding: 10px;
  border: 0;
  text-align: center;
  font-family: var(--font-space-grotesk);
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  letter-spacing: 0.01em;
  color: #ffffff;
  cursor: pointer;
`;

export const NavigationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 0.5px dashed #4b4b4b;
  padding-top: 18px;
  margin-top: 18px;
`;

export const EndGuideButton = styled.button`
  background: #0b0b0b;
  border-radius: 146px;
  text-align: center;
  padding: 10px;
  font-family: var(--font-space-grotesk);
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  position: relative;
  letter-spacing: 0.01em;
  color: white;
  border: 0;
  cursor: pointer;
  width: 100%;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 66px;
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
`;
