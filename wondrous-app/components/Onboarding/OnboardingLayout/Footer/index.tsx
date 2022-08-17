import React from 'react';

import LeftArrowIcon from 'components/Icons/leftArrow';
import { CircularProgress } from '@mui/material';
import { Container, ContinueButton, BackButton, RightButtons, Later } from './styles';
import DiscordSmallLogo from '../../../../public/images/onboarding/discord-small.svg';

interface Props {
  onConnectDiscordClick?: () => unknown;
  onContinueClick?: () => unknown;
  onLaterClick?: () => unknown;
  onBackClick?: () => unknown;
  loading?: unknown;
}

function OnboardingFooter({ onConnectDiscordClick, onContinueClick, onLaterClick, onBackClick, loading }: Props) {
  return (
    <Container>
      <div>
        {onBackClick ? (
          <BackButton onClick={onBackClick}>
            <LeftArrowIcon />
          </BackButton>
        ) : null}
      </div>
      <RightButtons>
        {onLaterClick ? (
          <Later onClick={onLaterClick} data-cy="button-later">
            Later
          </Later>
        ) : null}
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
}

export default OnboardingFooter;
