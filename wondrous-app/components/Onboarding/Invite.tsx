import React, { useState, useEffect } from 'react';
import { useWonderWeb3 } from 'services/web3';
import { useIsMobile } from 'utils/hooks';
import { useRouter } from 'next/router';
import { DISCORD_CONNECT_TYPES, GRAPHQL_ERRORS, SUPPORTED_CHAINS } from 'utils/constants';
import { SupportedChainType } from 'utils/web3Constants';
import signedMessageIsString from 'services/web3/utils/signedMessageIsString';
import MetaMaskConnector from 'components/WalletConnectors/MetaMask';
import WalletConnectConnector from 'components/WalletConnectors/WalletConnect';
import CoinbaseConnector from 'components/WalletConnectors/Coinbase';
import { getDiscordUrl } from 'utils';
import { DiscordIcon } from 'components/Icons/discord';
import { EmailIcon } from 'components/Icons/email';
import NoLogo from 'components/Icons/noLogo';
import OnboardingHeader from 'components/Onboarding/OnboardingLayout/Header';
import { handleUserOnboardingRedirect } from 'components/Onboarding/utils';
import { ErrorText } from '../Common';
import { SafeImage } from '../Common/Image';
import { Button } from '../Common/button';
import { getUserSigningMessage, walletSignup, walletSignin } from '../Auth/withAuth';
import {
  InviteWelcomeBoxParagraph,
  InviteWelcomeBoxTitle,
  InviteWelcomeBoxWrapper,
  Connectors,
  Logo,
  DataProtectBoxParagraph,
  DataLink,
} from './styles';

export function Invite({
  orgInfo = null,
  redeemOrgInviteLink = (data: any) => null,
  podInfo = null,
  redeemPodInviteLink = (data: any) => null,
  children = null,
  title = null,
  onAuthenticated = (user) => null,
}) {
  const wonderWeb3 = useWonderWeb3();
  const [errorMessage, setErrorMessage] = useState('');
  const [noChainError, setNoChainError] = useState('');
  const isMobile = useIsMobile();

  const [unsuportedChain, setUnsuportedChain] = useState(false);
  const router = useRouter();
  const { token, type, discordConnectError, collabInvite } = router.query;
  // Two stage process as wallet connection takes
  // time.
  // const connectWallet = async (event) => {
  //   // Connect Wallet first
  //   setErrorMessage('');
  //   await wonderWeb3.onConnect();
  //   if (!wonderWeb3.chain) {
  //     setNoChainError('No chain detected - please connect to wallet');
  //   }
  //   if (unsuportedChain) {
  //     setErrorMessage('Unsupported chain - please use Eth mainnet');
  //   }
  // };
  //
  const signupWithWallet = async () => {
    if (wonderWeb3.address && wonderWeb3.chain && !wonderWeb3.connecting) {
      // Retrieve Signed Message
      const messageToSignObject = await getUserSigningMessage(wonderWeb3.address, SupportedChainType.ETH, true);
      if (messageToSignObject?.userExists) {
        // TODO: log user into their dashboard
      }
      const messageToSign = messageToSignObject?.signingMessage;
      if (messageToSign) {
        const signedMessage = await wonderWeb3.signMessage(messageToSign);
        if (signedMessageIsString(signedMessage)) {
          // Sign with Wallet
          let user;
          try {
            user = await walletSignup(wonderWeb3.address, signedMessage, SupportedChainType.ETH);
          } catch (err) {
            if (
              err?.graphQLErrors &&
              err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.WEB3_ADDRESS_ALREADY_EXISTS
            ) {
              try {
                user = await walletSignin(wonderWeb3.address, signedMessage);
              } catch (err) {
                setErrorMessage('Unable to log in existing user - please contact support in discord');
              }
              // setErrorMessage('Account already exists');
            } else {
              setErrorMessage('Unable to join org - please contact support in discord.');
            }
          }
          if (user) {
            if (orgInfo) {
              redeemOrgInviteLink({
                variables: {
                  token,
                },
                onCompleted: (data) => {
                  handleUserOnboardingRedirect(user, router);
                },
                onError: (err) => {
                  if (
                    err?.graphQLErrors &&
                    (err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.ORG_INVITE_ALREADY_EXISTS ||
                      err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.POD_INVITE_ALREADY_EXISTS)
                  ) {
                    handleUserOnboardingRedirect(user, router);
                  }
                  setErrorMessage('Invite already redeemed');
                },
              });
            } else if (podInfo) {
              redeemPodInviteLink({
                variables: {
                  token,
                },
                onCompleted: (data) => {
                  handleUserOnboardingRedirect(user, router);
                },
                onError: (err) => {
                  if (
                    err?.graphQLErrors &&
                    (err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.ORG_INVITE_ALREADY_EXISTS ||
                      err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.POD_INVITE_ALREADY_EXISTS)
                  ) {
                    handleUserOnboardingRedirect(user, router);
                  }
                  setErrorMessage('Invite already redeemed');
                },
              });
            } else {
              handleUserOnboardingRedirect(user, router);
            }
          }
        } else if (signedMessage === false) {
          setErrorMessage('Signature rejected. Try again.');
          wonderWeb3.disconnect();
        } else {
          setErrorMessage('There has been an issue, contact with support.');
        }
      } else {
        setErrorMessage('Signup failed - please contact support.');
      }
    }
  };
  useEffect(() => {
    if (discordConnectError) {
      setErrorMessage('Error connecting your Discord. Please try again or connect with Metamask instead.');
    }
  }, [discordConnectError]);
  useEffect(() => {
    if (wonderWeb3.address && wonderWeb3.active && wonderWeb3.web3Provider) {
      signupWithWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet, wonderWeb3.active, wonderWeb3.web3Provider]);

  useEffect(() => {
    if (wonderWeb3.wallet.chain) {
      setUnsuportedChain(!SUPPORTED_CHAINS[wonderWeb3.chain]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet.chain]);

  let titleSentence = podInfo
    ? `The ${podInfo?.name} pod from ${podInfo?.org?.name} is requesting your help`
    : `${orgInfo?.name} is requesting your help.`;

  if (title) {
    titleSentence = title;
  }

  const buttonStyles = {
    marginTop: '16px',
    width: '100%',
    maxWidth: '278px',
    minHeight: '40px',
    height: '40px',
    fontWeight: '500',
  };

  return (
    <InviteWelcomeBoxWrapper>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <OnboardingHeader withLoginButton />

        {orgInfo || podInfo ? (
          <Logo>
            {orgInfo?.profilePicture || podInfo?.org?.profilePicture ? (
              <SafeImage
                useNextImage={false}
                style={{
                  width: '78px',
                  height: '78px',
                  borderRadius: '39px',
                  marginBottom: '20px',
                }}
                src={orgInfo?.profilePicture || podInfo?.org?.profilePicture}
              />
            ) : (
              <NoLogo />
            )}
          </Logo>
        ) : null}

        <InviteWelcomeBoxTitle>{titleSentence}</InviteWelcomeBoxTitle>
        <InviteWelcomeBoxParagraph>Wonder is where DAOs manage world changing projects</InviteWelcomeBoxParagraph>

        {children}

        <Connectors>
          {!isMobile && <MetaMaskConnector text="Continue with MetaMask" style={buttonStyles} />}
          <CoinbaseConnector text="Continue with Coinbase" style={buttonStyles} />
          <WalletConnectConnector text="Continue with Wallet Connect" style={buttonStyles} />
          <Button
            style={buttonStyles}
            onClick={() => {
              const url = getDiscordUrl();
              let type = null;
              if (orgInfo) {
                type = 'org';
              } else if (podInfo) {
                type = 'pod';
              }
              const state = JSON.stringify({
                callbackType: DISCORD_CONNECT_TYPES.signup,
                token,
                type,
                ...(collabInvite ? { collabInvite } : {}),
              });
              window.location.href = `${url}&state=${state}`;
            }}
          >
            <DiscordIcon />
            <span
              style={{
                fontFamily: 'Space Grotesk',
                fontWeight: '500',
              }}
            >
              Continue with Discord
            </span>
          </Button>
          <Button
            style={buttonStyles}
            onClick={() => {
              if (token) {
                if (orgInfo) {
                  router.push(`/signup/email?inviteToken=${token}`, undefined, {
                    shallow: true,
                  });
                } else if (podInfo) {
                  router.push(`/signup/email?inviteToken=${token}&type=pod`, undefined, {
                    shallow: true,
                  });
                }
              } else {
                router.push(`/signup/email${collabInvite ? `?collabInvite=${collabInvite}` : ''}`, undefined, {
                  shallow: true,
                });
              }
            }}
          >
            <EmailIcon />
            <span
              style={{
                fontFamily: 'Space Grotesk',
                fontWeight: '500',
              }}
            >
              Continue with Email
            </span>
          </Button>
        </Connectors>

        <DataProtectBoxParagraph>
          Your account and{' '}
          <DataLink href="https://www.wonderverse.xyz/privacy-policy" target="_blank">
            data
          </DataLink>{' '}
          is protected.
        </DataProtectBoxParagraph>
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        {!wonderWeb3.chain && noChainError && <ErrorText>{noChainError}</ErrorText>}
      </div>
    </InviteWelcomeBoxWrapper>
  );
}
