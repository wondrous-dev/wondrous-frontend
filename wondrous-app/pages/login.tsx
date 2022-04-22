import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardFooter } from 'components/Common/auth';
import { Button } from 'components/Common/button';
import AuthLayout from 'components/Common/Layout/Auth';
import { LineWithText, Line } from 'components/Common/lines';
import { Form } from 'components/Common/form';
import { Field } from 'components/Common/field';
import { PaddedParagraph, StyledLink } from 'components/Common/text';
import { SmallLogo, LoginWrapper, TopBubble, LoginError } from 'components/Pages/login';
import { useState } from 'react';
import { Grey50 } from '../theme/colors';
import { EmailIcon, LockIcon } from 'components/Icons/userpass';
import { DiscordIcon } from 'components/Icons/discord';
import { useWonderWeb3 } from 'services/web3';
import { emailSignin, getUserSigningMessage, walletSignin } from 'components/Auth/withAuth';
import MetaMaskConnector from 'components/WalletConnectors/MetaMask';
import signedMessageIsString from 'services/web3/utils/signedMessageIsString';
import styled from 'styled-components';
import CoinbaseConnector from 'components/WalletConnectors/Coinbase';
import { getDiscordUrl } from 'utils';

const prod = process.env.NEXT_PUBLIC_PRODUCTION;

const WalletLoginContainer = styled.div`
  padding: 10px 0;
`;
const DISCORD_OAUTH_URL = getDiscordUrl();

const Login = ({ csrfToken }) => {
  const wonderWeb3 = useWonderWeb3();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notSupported, setNotSupported] = useState(false);
  const [loading, setLoading] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await emailSignin(email, password);
    if (result === true) {
      router.push('/dashboard', undefined, {
        shallow: true,
      });
    } else {
      setErrorMessage(result);
    }
  };

  // This happens async, so we bind it to the
  // state of the component.
  const loginWithWallet = async () => {
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
            } else {
              setErrorMessage(user);
            }
          } catch (err) {
            setErrorMessage(err?.message || err);
          }
          setLoading(false);
        } else {
          setErrorMessage('You need to sign the message on your wallet');
        }
      } else {
        setErrorMessage('Login failed - try again.');
      }
    }
  };

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

  return (
    <AuthLayout>
      <LoginWrapper>
        <TopBubble src="/images/login/top-floater-bubble.png" alt="" />
        <Card>
          <CardBody>
            <SmallLogo />
            {!prod && (
              <>
                <h1>Login</h1>
                <Form onSubmit={handleSubmit}>
                  <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                  {errorMessage ? <LoginError>{errorMessage}</LoginError> : ''}
                  <Field
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    icon={EmailIcon}
                    required
                  />
                  <Field
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    icon={LockIcon}
                    required
                  />
                  <Button highlighted type="submit" marginTop="25px">
                    Log me in
                  </Button>
                </Form>
                <LineWithText>
                  <PaddedParagraph padding="0 10px" color={Grey50}>
                    or
                  </PaddedParagraph>
                </LineWithText>
              </>
            )}
            <WalletLoginContainer
              style={{
                marginTop: '24px',
              }}
            >
              <MetaMaskConnector />
            </WalletLoginContainer>
            <WalletLoginContainer>
              <CoinbaseConnector />
            </WalletLoginContainer>
            <WalletLoginContainer>
              <Button onClick={() => (window.location.href = DISCORD_OAUTH_URL)}>
                <DiscordIcon />
                <PaddedParagraph
                  style={{
                    marginLeft: '12px',
                  }}
                >
                  Log in with Discord
                </PaddedParagraph>
              </Button>
            </WalletLoginContainer>
          </CardBody>
          {/* <CardFooter>
            <Line size="80%" />
            <CenteredFlexRow marginTop="16px">
              Don&apos;t have an account yet?&nbsp;
              <StyledLink href="/signup">Sign up for the beta.</StyledLink>
            </CenteredFlexRow>
            <CenteredFlexRow>
              Forgot &nbsp;
              <StyledLink href="/forgot-password">password</StyledLink>
              &nbsp; or &nbsp;
              <StyledLink href="/forgot-email">email</StyledLink>?
            </CenteredFlexRow>
          </CardFooter> */}
        </Card>
      </LoginWrapper>
    </AuthLayout>
  );
};

export default Login;
