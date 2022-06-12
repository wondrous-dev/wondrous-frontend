import React from 'react';
import { WalletConnected, Label } from '../styles';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';
import TwitterBlue from '../../../public/images/twitterBlue.svg';
import { CompletedIcon } from 'components/Icons/statusIcons';
import { ContinueButton, LaterButton } from 'components/Onboarding/OnboardingLayout/Footer/styles';
import { AlignButtonTwitter, TwitterContent } from '../styles';

export const ConnectTwitter = () => {
  const headerRightContent = (
    <WalletConnected>
      <CompletedIcon fill="none" stroke="none" style={{ width: '26px', height: '26px' }} />{' '}
      <Label>Success! Wallet connected.</Label>
    </WalletConnected>
  );

  return (
    <OnboardingLayout
      title="Connect to Twitter"
      description="Want our launch POAP? You have to tweet here."
      headerRightContent={headerRightContent} step={5}
    >
      <TwitterContent
        style={{ alignSelf: 'center', justifySelf: 'center' }}
      >
        <ContinueButton style={{ marginBottom: '24px' }}>
          <AlignButtonTwitter>
            <TwitterBlue />
          </AlignButtonTwitter>
          <div>Continue to Twitter</div>
        </ContinueButton>
        <LaterButton
          style={{
            margin: 0,
            width: '100%'
          }}
        >
          I&apos;ll connect it later
        </LaterButton>
      </TwitterContent>
    </OnboardingLayout>
  );
};
