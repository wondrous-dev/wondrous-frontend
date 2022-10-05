import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { PaddedParagraph, StyledNextLink } from 'components/Common/text';
import OnboardingHeader from 'components/Onboarding/OnboardingLayout/Header';
import { Layout, OnboardingTitle } from 'components/Onboarding/OnboardingLayout/styles';
import { Form } from 'components/Common/form';
import { LoginError } from 'components/Pages/login';
import { Field } from 'components/Common/field';
import { EmailIcon, LockIcon } from 'components/Icons/userpass';
import { LineWithText } from 'components/Common/lines';
import palette from 'theme/palette';
import { ContinueButton } from 'components/Onboarding/OnboardingLayout/Footer/styles';
import { emailSignup } from 'components/Auth/withAuth';
import MetaMaskConnector from 'components/WalletConnectors/MetaMask';
import CoinbaseConnector from 'components/WalletConnectors/Coinbase';
import WalletConnectConnector from 'components/WalletConnectors/WalletConnect';
import { Button } from 'components/Common/button';
import { getDiscordUrl } from 'utils/index';
import { DISCORD_CONNECT_TYPES, GRAPHQL_ERRORS } from 'utils/constants';
import { DiscordIcon } from 'components/Icons/discord';
import { Connectors } from 'components/Onboarding/styles';
import { useMutation } from '@apollo/client';
import { REDEEM_ORG_INVITE_LINK, REDEEM_POD_INVITE_LINK } from 'graphql/mutations';

const discordUrlWithoutState = getDiscordUrl();
const state = JSON.stringify({
  callbackType: DISCORD_CONNECT_TYPES.login,
});
const discordUrl = `${discordUrlWithoutState}&state=${state}`;

export const checkPasswordStrength = (password) => {
  if (!password) {
    return false;
  }
  if (password.length < 8) {
    return false;
  }
  return true;
};

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redeemOrgInviteLink] = useMutation(REDEEM_ORG_INVITE_LINK);
  const [redeemPodInviteLink] = useMutation(REDEEM_POD_INVITE_LINK);
  const router = useRouter();
  const { type, inviteToken, collabInvite } = router?.query;

  const collabInviteQueryString = collabInvite ? `?collabInvite=${collabInvite}` : '';
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!checkPasswordStrength(password)) {
      setErrorMessage('Password is too weak! Please enter more than 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Confirmation password does not match!');
      return;
    }
    const result = await emailSignup(email, password);
    if (result?.success === true) {
      const user = result?.user;
      if (inviteToken) {
        if (type === 'pod') {
          redeemPodInviteLink({
            variables: {
              token: inviteToken,
            },
            onCompleted: (data) => {
              if (data?.redeemPodInviteLink?.success) {
                if (user?.username) {
                  router.push('/mission-control', undefined, {
                    shallow: true,
                  });
                } else {
                  router.push(`/onboarding/welcome${collabInviteQueryString}`, undefined, {
                    shallow: true,
                  });
                }
              }
            },
            onError: (err) => {
              if (
                err?.graphQLErrors &&
                (err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.ORG_INVITE_ALREADY_EXISTS ||
                  err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.POD_INVITE_ALREADY_EXISTS)
              ) {
                if (user?.username) {
                  router.push('/mission-control', undefined, {
                    shallow: true,
                  });
                } else {
                  router.push(`/onboarding/welcome${collabInviteQueryString}`, undefined, {
                    shallow: true,
                  });
                }
              }
              setErrorMessage('Invite already redeemed');
            },
          });
        } else {
          redeemOrgInviteLink({
            variables: {
              token: inviteToken,
            },
            onCompleted: (data) => {
              if (data?.redeemOrgInviteLink?.success) {
                if (user?.username) {
                  router.push('/mission-control', undefined, {
                    shallow: true,
                  });
                } else {
                  router.push(`/onboarding/welcome`, undefined, {
                    shallow: true,
                  });
                }
              }
            },
            onError: (err) => {
              if (
                err?.graphQLErrors &&
                (err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.ORG_INVITE_ALREADY_EXISTS ||
                  err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.POD_INVITE_ALREADY_EXISTS)
              ) {
                if (user?.username) {
                  router.push('/mission-control', undefined, {
                    shallow: true,
                  });
                } else {
                  router.push(`/onboarding/welcome`, undefined, {
                    shallow: true,
                  });
                }
              }
              setErrorMessage('Invite already redeemed');
            },
          });
        }
      } else {
        router.push(`/onboarding/welcome${collabInviteQueryString}`, undefined, {
          shallow: true,
        });
      }
    } else if (result === GRAPHQL_ERRORS.EMAIL_ALREADY_EXIST) {
      setErrorMessage('This email is already registered. Please log in');
    } else if (result === GRAPHQL_ERRORS.INVALID_EMAIL) {
      setErrorMessage('Please enter a valid email');
    }
  };

  useEffect(() => {
    setErrorMessage(null);
  }, [password, confirmPassword, email]);

  const buttonStyles = {
    width: '40px',
    height: '40px',
    borderRadius: '300px',
    margin: '0 6px',
  };

  return (
    <Layout
      style={{
        minHeight: 'unset',
      }}
    >
      <OnboardingHeader secondVersionLogo />
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
          <Field
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
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
          <PaddedParagraph padding="0 10px" color={palette.white} style={{ fontWeight: 500 }}>
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
          <WalletConnectConnector text="" style={buttonStyles} />
          <CoinbaseConnector text="" style={buttonStyles} />
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
          </Button> */}
        </Connectors>
        <Link href="/signup" passHref>
          <StyledNextLink> Back to options</StyledNextLink>
        </Link>
      </div>
    </Layout>
  );
}

export default Signup;
