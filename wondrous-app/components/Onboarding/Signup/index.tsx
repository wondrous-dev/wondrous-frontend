import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { PaddedParagraph, StyledNextLink } from "components/Common/text";
import OnboardingHeader from "components/Onboarding/OnboardingLayout/Header";
import { Layout, OnboardingTitle } from "components/Onboarding/OnboardingLayout/styles";
import { Form } from "components/Common/form";
import { LoginError } from "components/Pages/login";
import { Field } from "components/Common/field";
import { EmailIcon, LockIcon } from "components/Icons/userpass";
import { LineWithText } from "components/Common/lines";
import { White, HighlightBlue } from "../../../theme/colors";
import { ContinueButton } from "components/Onboarding/OnboardingLayout/Footer/styles";
import { emailSignup } from "components/Auth/withAuth";
import MetaMaskConnector from "components/WalletConnectors/MetaMask";
import CoinbaseConnector from "components/WalletConnectors/Coinbase";
import WalletConnectConnector from "components/WalletConnectors/WalletConnect";
import { Button } from "components/Common/button";
import { getDiscordUrl } from "utils/index";
import { DISCORD_CONNECT_TYPES } from "utils/constants";
import { DiscordIcon } from "components/Icons/discord";
import { Connectors } from "components/Onboarding/styles";

const discordUrlWithoutState = getDiscordUrl();
const state = JSON.stringify({
  callbackType: DISCORD_CONNECT_TYPES.login,
});
const discordUrl = `${discordUrlWithoutState}&state=${state}`;


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await emailSignup(email, password);
    if (result === true) {
      router.push('/dashboard', undefined, {
        shallow: true,
      });
    } else {
      setErrorMessage(result);
    }
  };

  const buttonStyles = {
    width: '40px',
    height: '40px',
    borderRadius: '300px',
    margin: '0 6px',
  }

  return (
    <Layout
      style={{
        minHeight: 'unset',
      }}
    >
      <OnboardingHeader secondVersionLogo={true} />
      <OnboardingTitle
        style={{
          textAlign: 'center',
        }}
      >
        Sign-up with email
      </OnboardingTitle>

      <div style={{ width: '100%' }}>
        {errorMessage ? <LoginError>{errorMessage}</LoginError> : ''}
        <Form onSubmit={handleSubmit} style={{ marginBottom: '37px' }}>
          <Field
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            icon={EmailIcon}
            rightIcon
            required
          />
          <Field
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            icon={LockIcon}
            rightIcon
            required
          />
          <ContinueButton
            type="submit"
            style={{
              marginTop: '37px',
              minHeight: '50px',
              width: '100%',
            }}
          >
            Sign up
          </ContinueButton>
        </Form>
        <LineWithText width="45%" borderBottom="1px dashed #4b4b4b">
          <PaddedParagraph padding="0 10px" color={White} style={{fontWeight: 500}}>
            or
          </PaddedParagraph>
        </LineWithText>
        <Connectors
          style={{
            flexDirection: 'unset',
            borderTop: 0,
            justifyContent: 'center',
          }}
        >
          <MetaMaskConnector
            text=""
            style={buttonStyles}
          />
          <CoinbaseConnector
            text=""
            style={buttonStyles}
          />
          <WalletConnectConnector
            text=""
            style={buttonStyles}
          />
          <Button
            style={buttonStyles}
            onClick={() => (window.location.href = discordUrl)}
          >
            <DiscordIcon />
          </Button>
          <Button
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '300px',
              margin: '0 6px',
              background: '#474747',
            }}
            onClick={() => {
              router.push('/signup-with-email', undefined, {
                shallow: true,
              });
            }}
          >
            <EmailIcon
              style={{
                width: '18px',
                height: '18px',
                filter: 'grayscale(1)',
              }}
            />
          </Button>
        </Connectors>
        <Link href="/signup">
          <StyledNextLink> Back to options</StyledNextLink>
        </Link>
      </div>
    </Layout>
  );
};

export default Signup;
