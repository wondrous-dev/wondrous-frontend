import React from 'react';

import { Container, ContinueButton, LaterButton, BackButton, RightButtons } from './styles';
import LeftArrowIcon from 'components/Icons/leftArrow';

interface Props {
  onContinueClick: () => unknown;
  onLaterClick?: () => unknown;
  onBackClick?: () => unknown;
}

const OnboardingFooter = ({ onContinueClick, onLaterClick, onBackClick }: Props) => (
  <Container>
    <div>
      {onBackClick ? (
        <BackButton onClick={onBackClick}>
          <LeftArrowIcon />
        </BackButton>
      ) : null}
    </div>
    <RightButtons>
      {onLaterClick ? <LaterButton onClick={onLaterClick}>Later</LaterButton> : null}
      <ContinueButton onClick={onContinueClick}>Continue</ContinueButton>
    </RightButtons>
  </Container>
);

export default OnboardingFooter;
