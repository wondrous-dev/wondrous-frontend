import React from 'react';

import { InviteWelcomeBoxParagraph, QRCodeTwitter } from '../styles';
import { Layout, OnboardingTitle } from 'components/Onboarding/OnboardingLayout/styles';
import { ConnectLater, ContinueButton, LaterButton } from 'components/Onboarding/OnboardingLayout/Footer/styles';

const OnboardingVerifyTwitter = () => {
  return (
    <Layout
      style={{
        paddingTop: '55px',
        paddingBottom: '55px',
        minHeight: 'unset',
      }}
    >
      <OnboardingTitle
        style={{
          marginTop: 0,
        }}
      >
        Get your POAP
      </OnboardingTitle>
      <InviteWelcomeBoxParagraph
        style={{
          textAlign: 'left',
          width: '100%',
          fontSize: '15px',
          fontWeight: '400',
        }}
      >
        Want to get your launch POAP? <br /> Verify your Twitter to get the password and link.
      </InviteWelcomeBoxParagraph>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <QRCodeTwitter />
        <div
          style={{
            width: '100%',
            maxWidth: '326px',
          }}
        >
          <ContinueButton
            type="submit"
            style={{
              marginTop: '29px',
              minHeight: '50px',
              width: '100%',
            }}
          >
            Confirm address
          </ContinueButton>
          <LaterButton
            style={{
              marginRight: 0,
              minHeight: '50px',
              margin: '21px 0',
            }}
          >
            Veryify
          </LaterButton>
          <ConnectLater
            style={{
              width: '100%',
              height: '50px',
            }}
          >
            I’ll get POAP later
          </ConnectLater>
        </div>
      </div>
    </Layout>
  );
};

export default OnboardingVerifyTwitter;
