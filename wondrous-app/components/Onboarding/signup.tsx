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
import { useWonderWeb3 } from '../../services/web3';
import { getUserSigningMessage, walletSignup, walletSignin } from '../Auth/withAuth';
import { useRouter } from 'next/router';
import { GRAPHQL_ERRORS, SUPPORTED_CHAINS } from '../../utils/constants';
import { Button } from '../Common/button';
import { PaddedParagraph } from '../Common/text';
import { Metamask } from '../Icons/metamask';
import { SafeImage } from '../Common/Image';
import { ErrorText } from '../Common';
import { SupportedChainType } from '../../utils/web3Constants';

export const Logo = () => {
  return (
    <LogoDiv>
      <WonderLogo />
      <LogoText>Wonder</LogoText>
    </LogoDiv>
  );
};

export const InviteWelcomeBox = ({ orgInfo, redeemOrgInviteLink }) => {
  const wonderWeb3 = useWonderWeb3();
  const [errorMessage, setErrorMessage] = useState('');
  const [noChainError, setNoChainError] = useState('');

  const [unsuportedChain, setUnsuportedChain] = useState(false);
  const router = useRouter();
  const { token } = router.query;
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
    console.log('ping');
    if (wonderWeb3.address && wonderWeb3.chain && !wonderWeb3.connecting) {
      // Retrieve Signed Message
      const messageToSignObject = await getUserSigningMessage(wonderWeb3.address, SupportedChainType.ETH, true);
      if (messageToSignObject?.userExists) {
        // TODO: log user into their dashboard
      }
      const messageToSign = messageToSignObject?.signingMessage;
      if (messageToSign) {
        const signedMessage = await wonderWeb3.signMessage(messageToSign);
        if (signedMessage) {
          // Sign with Wallet
          let user;
          try {
            user = await walletSignup(wonderWeb3.address, signedMessage, SupportedChainType.ETH);
          } catch (err) {
            console.log('err 1', err);
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
                console.log('err 3', err, user);
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
        } else if (signedMessage === false) {
          setErrorMessage('Signature rejected. Try again.');
        } else {
          setErrorMessage('There has been an issue, contact with support.');
        }
      } else {
        setErrorMessage('Signup failed - please contact support.');
      }
    }
  };
  useEffect(() => {
    if (wonderWeb3.address) {
      signupWithWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet]);

  useEffect(() => {
    if (wonderWeb3.wallet.chain) {
      setUnsuportedChain(!SUPPORTED_CHAINS[wonderWeb3.chain]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet.chain]);
  const buttonStyle = {
    background: 'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
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
        src={orgInfo?.profilePicture}
      />
      <InviteWelcomeBoxTitle>{orgInfo?.name} is requesting your help.</InviteWelcomeBoxTitle>
      <InviteWelcomeBoxParagraph>Wonder is where DAOs manage world changing projects</InviteWelcomeBoxParagraph>
      <InviteWelcomeBoxParagraph
        style={{
          fontWeight: 'normal',
        }}
      >
        {orgInfo?.contributorCount} members are already contributing to {orgInfo?.name}
      </InviteWelcomeBoxParagraph>
      {wonderWeb3.connecting ? (
        <MetamaskButton style={buttonStyle} disabled className="disabled">
          <Metamask height="18" width="17" />
          <PaddedParagraph padding="0 10px">Connect with MetaMask</PaddedParagraph>
        </MetamaskButton>
      ) : unsuportedChain ? (
        <MetamaskButton style={buttonStyle} disabled>
          <Metamask height="18" width="17" />
          <PaddedParagraph padding="0 10px">Change the Network to Mainnet or Polygon</PaddedParagraph>
        </MetamaskButton>
      ) : (
        <MetamaskButton style={buttonStyle} onClick={connectWallet}>
          <Metamask height="18" width="17" />
          <PaddedParagraph padding="0 10px">Connect with MetaMask</PaddedParagraph>
        </MetamaskButton>
      )}
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      {!wonderWeb3.chain && noChainError && <ErrorText>{noChainError}</ErrorText>}
    </InviteWelcomeBoxWrapper>
  );
};
