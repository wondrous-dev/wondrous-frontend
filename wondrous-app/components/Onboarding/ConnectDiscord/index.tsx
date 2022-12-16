import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { getDiscordUrl } from 'utils/index';
import { DISCORD_CONNECT_TYPES } from 'utils/constants';
import { ErrorText } from 'components/Common';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';
import { useIsMobile } from 'utils/hooks';
import { useMe } from '../../Auth/withAuth';
import DiscordSuccessLogo from '../../../public/images/onboarding/discord-success.svg';
import DiscordLogo from '../../../public/images/onboarding/discord.svg';

enum Text {
  TitleSuccess = 'Success!',
  TitleStandard = 'Connect to Discord',
  DescriptionSuccess = 'You have connected the Discord.',
  DescriptionStandard = 'Connect your Discord to receive work notifications, join relevant projects, and start Discord threads to discuss work. This is highly recommended.',
  UserConnected = 'Discord user already connected to another account.',
  ErrorConnecting = 'Error connecting to Discord. Please try again or contact support.',
}

const DISCORD_OAUTH_URL = getDiscordUrl();

export function ConnectDiscord({ updateUser }) {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const user = useMe();
  const { discordUserExists, discordError, success, collabInvite } = router.query;
  const isMobile = useIsMobile();
  const collabInviteQueryString = collabInvite ? `?collabInvite=${collabInvite}` : '';
  const goToNextStep = () => {
    const nextStep = user?.activeEthAddress
      ? `/onboarding/twitter${collabInviteQueryString}`
      : `/onboarding/wallet${collabInviteQueryString}`;
    router.push(nextStep, undefined, { shallow: true });
  };

  const handleConnectDiscordClick = () => {
    const state = JSON.stringify({
      callbackType: DISCORD_CONNECT_TYPES.connectOnboarding,
      ...(collabInvite ? { collabInvite } : {}),
    });
    window.location.href = `${DISCORD_OAUTH_URL}&state=${state}`;
  };

  const errorBlock = (
    <div>
      {+discordUserExists && <ErrorText>{Text.UserConnected}</ErrorText>}
      {+discordError && !+discordUserExists && <ErrorText>{Text.ErrorConnecting}</ErrorText>}
    </div>
  );

  const DiscordLogoStyle = {
    alignSelf: 'center',
    justifySelf: 'center',
  };

  useEffect(() => {
    if (isMobile) {
      goToNextStep();
    }
  }, [isMobile]);
  return (
    <>
      {success ? (
        <OnboardingLayout
          title={Text.TitleSuccess}
          description={Text.DescriptionSuccess}
          onContinueClick={goToNextStep}
          onBackClick={() => router.back()}
          step={3}
        >
          <DiscordSuccessLogo style={DiscordLogoStyle} />
          {errorBlock}
        </OnboardingLayout>
      ) : (
        <OnboardingLayout
          title={Text.TitleStandard}
          description={Text.DescriptionStandard}
          onLaterClick={goToNextStep}
          onBackClick={() => router.back()}
          onConnectDiscordClick={handleConnectDiscordClick}
          step={3}
        >
          <DiscordLogo style={DiscordLogoStyle} />
          {errorBlock}
        </OnboardingLayout>
      )}
    </>
  );
}
