import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Card, CardBody, CardFooter } from 'components/Common/auth';
import AuthLayout from 'components/Common/Layout/Auth';
import { LineWithText, Line } from 'components/Common/lines';
import { Form } from 'components/Common/form';
import { Field } from 'components/Common/field';
import { PaddedParagraph, StyledLink } from 'components/Common/text';
import { SmallLogo, LoginWrapper, TopBubble, LoginError } from 'components/Pages/login';
import { useState } from 'react';
import { Grey50, White } from '../theme/colors';
import { EmailIcon, LockIcon } from 'components/Icons/userpass';
import { DiscordIcon } from 'components/Icons/discord';
import { useWonderWeb3 } from 'services/web3';
import { emailSignin, getUserSigningMessage, walletSignin, walletSignup } from 'components/Auth/withAuth';
import MetaMaskConnector from 'components/WalletConnectors/MetaMask';
import WalletConnectConnector from 'components/WalletConnectors/WalletConnect';
import signedMessageIsString from 'services/web3/utils/signedMessageIsString';
import styled from 'styled-components';
import CoinbaseConnector from 'components/WalletConnectors/Coinbase';
import { getDiscordUrl } from 'utils';
import { DISCORD_CONNECT_TYPES, GRAPHQL_ERRORS } from 'utils/constants';
import OnboardingHeader from 'components/Onboarding/OnboardingLayout/Header';
import { Layout, OnboardingTitle } from 'components/Onboarding/OnboardingLayout/styles';
import { ContinueButton } from 'components/Onboarding/OnboardingLayout/Footer/styles';
import { Connectors, MainWrapper } from 'components/Onboarding/styles';
import { Button } from 'components/Button';
import { SupportedChainType } from 'utils/web3Constants';
import { handleUserOnboardingRedirect } from 'components/Onboarding/utils';

const prod = process.env.NEXT_PUBLIC_PRODUCTION;

const WalletLoginContainer = styled.div`
  padding: 10px 0;
`;
const discordUrlWithoutState = getDiscordUrl();
const state = JSON.stringify({
  callbackType: DISCORD_CONNECT_TYPES.login,
});
const discordUrl = `${discordUrlWithoutState}&state=${state}`;

const Login = ({ csrfToken }) => {
  const wonderWeb3 = useWonderWeb3();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notSupported, setNotSupported] = useState(false);
  const [loading, setLoading] = useState(null);
  const router = useRouter();
  const { discordConnectError } = router.query;
  const handleSubmit = async (event) => {
    event.preventDefault();

    const userOrErrorMessage = await emailSignin(email, password);
    handleUserOnboardingRedirect(userOrErrorMessage, router);
    if (userOrErrorMessage === 'Incorrect Email and Password combination') {
      setErrorMessage('Incorrect Email and Password combination');
    }
  };

  // This happens async, so we bind it to the
  // state of the component.
  const loginWithWallet = async () => {
    setErrorMessage(null);
    if (wonderWeb3.address && wonderWeb3.chain && !wonderWeb3.connecting) {
      // Retrieve Signed Message
      const messageToSign = await getUserSigningMessage(wonderWeb3.address, 'eth');

      if (messageToSign) {
        const signedMessage = await wonderWeb3.signMessage(messageToSign);

        if (signedMessageIsString(signedMessage)) {
          // Sign with Wallet
          setLoading(true);
          try {
            const user = await walletSignin(wonderWeb3.address, signedMessage);
            if (user) {
              if (user?.username) {
                router.push('/dashboard', undefined, {
                  shallow: true,
                });
              } else {
                router.push('/onboarding/welcome', undefined, {
                  shallow: true,
                });
              }
            } 
          } catch (err) {
            console.log('err?.graphQLErrors', err?.graphQLErrors)
            if (err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.NO_WEB3_ADDRESS_FOUND) {
              setErrorMessage('Address not found, check you are connected to the correct address');
            } else {
              setErrorMessage(err?.message || err);
            }
          }
          setLoading(false);
        } else {
          if (signedMessage !== undefined) {
            setErrorMessage('You need to sign the message on your wallet');
          }
        }
      } else {
        setErrorMessage('Login failed - try again.');
      }
    }
  };

  useEffect(() => {
    if (discordConnectError) {
      setErrorMessage('Error connecting your Discord. Please try again or connect with Metamask instead.');
    }
  }, [discordConnectError]);
  useEffect(() => {
    if (wonderWeb3.wallet['address'] && !wonderWeb3.isActivating) {
      // Wallet sign in
      loginWithWallet();
    } else {
      // Error Login Here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet, wonderWeb3.isActivating]);

  useEffect(() => {
    setNotSupported(wonderWeb3.notSupportedChain);
  }, [wonderWeb3.notSupportedChain]);

  const buttonStyles = {
    width: '40px',
    height: '40px',
    borderRadius: '300px',
    margin: '0 6px',
  };

  return (
    <MainWrapper>
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
          Log in with email
        </OnboardingTitle>

        <div style={{ width: '100%' }}>
          {errorMessage ? <LoginError>{errorMessage}</LoginError> : ''}
          <Form onSubmit={handleSubmit} style={{ marginBottom: '37px' }}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Field
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              icon={EmailIcon}
              required
              rightIcon
            />
            <Field
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              icon={LockIcon}
              required
              rightIcon
            />
            <Button
              type="submit"
              style={{
                marginTop: '37px',
                minHeight: '50px',
                width: '100%',
              }}
            >
              Log me in
            </Button>
          </Form>
          <LineWithText width="45%" borderBottom="1px dashed #4b4b4b">
            <PaddedParagraph padding="0 10px" color={White} style={{ fontWeight: 500 }}>
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
            <MetaMaskConnector text="" style={buttonStyles} />
            <CoinbaseConnector text="" style={buttonStyles} />
            <WalletConnectConnector text="" style={buttonStyles} />
            <Button style={buttonStyles} onClick={() => (window.location.href = discordUrl)}>
              <DiscordIcon />
            </Button>
            {/* <Button
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '300px',
                margin: '0 6px',
                background: '#474747',
              }}
              onClick={() => {
                router.push('/signup/email', undefined, {
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
            </Button> */}
          </Connectors>
        </div>
      </Layout>
    </MainWrapper>
  );
};

export default Login;
