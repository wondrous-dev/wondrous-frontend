import React from 'react';

import { Container, ContinueButton, BackButton, RightButtons, Later } from './styles';
import LeftArrowIcon from 'components/Icons/leftArrow';
import DiscordSmallLogo from '../../../../public/images/onboarding/discord-small.svg';
import { CircularProgress } from '@material-ui/core';

interface Props {
  onConnectDiscordClick?: () => unknown;
  onContinueClick?: () => unknown;
  onLaterClick?: () => unknown;
  onBackClick?: () => unknown;
  loading?: unknown;
}

const OnboardingFooter = ({ onConnectDiscordClick, onContinueClick, onLaterClick, onBackClick, loading }: Props) => (
  <Container>
    <div>
      {onBackClick ? (
        <BackButton onClick={onBackClick}>
          <LeftArrowIcon />
        </BackButton>
      ) : null}
    </div>
    <RightButtons>
      {onLaterClick ? <Later onClick={onLaterClick}>Later</Later> : null}
      {onContinueClick ? <ContinueButton onClick={onContinueClick}>Continue</ContinueButton> : null}
      {onConnectDiscordClick ? (
        <ContinueButton onClick={onConnectDiscordClick}>
          <DiscordSmallLogo
            style={{
              marginRight: '12px',
            }}
          />
          Connect Discord
        </ContinueButton>
      ) : null}
      {loading ? <CircularProgress /> : null}
    </RightButtons>
  </Container>
);

export default OnboardingFooter;
