import React, { useState, useEffect } from 'react';
import {
  InviteWelcomeBoxParagraph,
  InviteWelcomeBoxTitle,
  InviteWelcomeBoxWrapper,
  LogoDiv,
  LogoImg,
  LogoText,
  MetamaskButton,
  OrgProfilePicture,
} from './styles';
import WonderLogo from '../../public/images/onboarding/wonder-logo.svg';
import { useWonderWeb3 } from 'services/web3';
import { getUserSigningMessage, walletSignup, walletSignin } from '../Auth/withAuth';
import { useRouter } from 'next/router';
import { GRAPHQL_ERRORS, SUPPORTED_CHAINS } from 'utils/constants';
import { Button } from '../Common/button';
import { PaddedParagraph } from '../Common/text';
import { Metamask } from '../Icons/metamask';
import { SafeImage } from '../Common/Image';
import { ErrorText } from '../Common';
import { SupportedChainType } from 'utils/web3Constants';
import signedMessageIsString from 'services/web3/utils/signedMessageIsString';
import MetaMaskConnector from 'components/WalletConnectors/MetaMask';
import WalletConnectConnector from 'components/WalletConnectors/WalletConnect';
import CoinbaseConnector from 'components/WalletConnectors/Coinbase';
import { getDiscordUrl } from 'utils';
import { DiscordIcon } from 'components/Icons/discord';

export const Logo = () => {
  return (
    <LogoDiv>
      <WonderLogo />
      <LogoText>Wonder</LogoText>
    </LogoDiv>
  );
};

export const InviteWelcomeBox = ({ orgInfo, redeemOrgInviteLink, podInfo, redeemPodInviteLink }) => {
  const wonderWeb3 = useWonderWeb3();
  const [errorMessage, setErrorMessage] = useState('');
  const [noChainError, setNoChainError] = useState('');

  const [unsuportedChain, setUnsuportedChain] = useState(false);
  const router = useRouter();
  const { token, type, discordConnectError } = router.query;
  // Two stage process as wallet connection takes
  // time.
  const connectWallet = async (event) => {
    // Connect Wallet first
    setErrorMessage('');
    await wonderWeb3.onConnect();
    if (!wonderWeb3.chain) {
      setNoChainError('No chain detected - please connect to wallet');
    }
    if (unsuportedChain) {
      setErrorMessage('Unsupported chain - please use Eth mainnet');
    }
  };

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
              setErrorMessage('Account already exists');
            } else {
              setErrorMessage('Unable to join org - please contact support in discord.');
            }
          }
          if (user) {
            //

            if (orgInfo) {
              redeemOrgInviteLink({
                variables: {
                  token,
                },
                onCompleted: (data) => {
                  if (data?.redeemOrgInviteLink?.success) {
                    if (user?.username) {
                      router.push('/dashboard', undefined, {
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
                      router.push('/dashboard', undefined, {
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
            } else if (podInfo) {
              redeemPodInviteLink({
                variables: {
                  token,
                },
                onCompleted: (data) => {
                  if (data?.redeemPodInviteLink?.success) {
                    if (user?.username) {
                      router.push('/dashboard', undefined, {
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
                      router.push('/dashboard', undefined, {
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
  const buttonStyle = {
    background: 'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
  };

  const titleSentence = podInfo
    ? `The ${podInfo?.name} pod from ${podInfo?.org?.name} is requesting your help`
    : `${orgInfo?.name} is requesting your help.`;
  const contributingSentence = podInfo
    ? `${podInfo?.contributorCount} ${podInfo?.contributorCount === 1 ? 'is' : 'are'} already contributing to the ${
        podInfo?.name
      } pod`
    : `${orgInfo?.contributorCount} members are already contributing to ${orgInfo?.name}`;
  const buttonStyles = {
    marginTop: '16px',
    width: '100%',
    maxWidth: '300px',
  };
  return (
    <InviteWelcomeBoxWrapper>
      <SafeImage
        style={{
          width: '78px',
          height: '78px',
          borderRadius: '39px',
          marginBottom: '20px',
        }}
        src={orgInfo?.profilePicture || podInfo?.org?.profilePicture}
      />
      <InviteWelcomeBoxTitle>{titleSentence}</InviteWelcomeBoxTitle>
      <InviteWelcomeBoxParagraph>Wonder is where DAOs manage world changing projects</InviteWelcomeBoxParagraph>
      <InviteWelcomeBoxParagraph
        style={{
          fontWeight: 'normal',
        }}
      >
        {contributingSentence}
      </InviteWelcomeBoxParagraph>
      <MetaMaskConnector text="Connect with MetaMask" style={buttonStyles} />
      <WalletConnectConnector text="Connect with Wallet Connect" style={buttonStyles} />
      <CoinbaseConnector text="Connect with Coinbase Wallet" style={buttonStyles} />
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
            token,
            type,
          });
          window.location.href = `${url}&state=${state}`;
        }}
      >
        <DiscordIcon />
        <span
          style={{
            marginLeft: '12px',
          }}
        >
          Connect with Discord
        </span>
      </Button>

      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      {!wonderWeb3.chain && noChainError && <ErrorText>{noChainError}</ErrorText>}
    </InviteWelcomeBoxWrapper>
  );
};
