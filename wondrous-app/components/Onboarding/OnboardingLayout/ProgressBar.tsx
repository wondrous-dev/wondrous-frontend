import React from 'react';
import styled from 'styled-components';

import { FirstStep, SecondStep, ThirdStep, FourthStep, FifthStep } from 'components/Common/Image/OnboardingProgressBar';

export const Container = styled.div`
  width: 100%;
  margin: 24px 0;
`;

const stepsMap = {
  1: FirstStep,
  2: SecondStep,
  3: ThirdStep,
  4: FourthStep,
  5: FifthStep,
};

type Props = {
  step: number;
};

function ProgressBar({ step }: Props) {
  const Step = stepsMap[step];

  return (
    <Container>
      <Step />
    </Container>
  );
}

export default ProgressBar;
