import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useIsMobile } from 'utils/hooks';
import MetaMaskConnector from 'components/WalletConnectors/MetaMask';
import WalletConnectConnector from 'components/WalletConnectors/WalletConnect';
import CoinbaseConnector from 'components/WalletConnectors/Coinbase';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';
import { SupportedChainType } from 'utils/web3Constants';
import signedMessageIsString from 'services/web3/utils/signedMessageIsString';
import { ErrorText } from 'components/Common';

import { LaterButton, BackButton } from 'components/Onboarding/OnboardingLayout/Footer/styles';
import { Connectors } from 'components/Onboarding/styles';
import { Wallet } from 'components/Onboarding/SetupWallet/styles';
import { useWonderWeb3 } from 'services/web3';
import { GRAPHQL_ERRORS, SUPPORTED_CHAINS } from 'utils/constants';
import LeftArrowIcon from 'components/Icons/leftArrow';
import { getUserSigningMessage, linkWallet, logout, useMe } from '../../Auth/withAuth';
import WalletIcon from '../../../public/images/onboarding/union.svg';

function SetupWallet() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { collabInvite } = router.query;
  const wonderWeb3 = useWonderWeb3();
  const [errorMessage, setErrorMessage] = useState('');

  const collabInviteQueryString = collabInvite ? `?collabInvite=${collabInvite}` : '';
  const linkUserWithWallet = useCallback(async () => {
    if (wonderWeb3.address && wonderWeb3.chain && !wonderWeb3.connecting) {
      const messageToSign = await getUserSigningMessage(wonderWeb3.address, SupportedChainType.ETH);

      if (messageToSign) {
        const signedMessage = await wonderWeb3.signMessage(messageToSign);
        if (signedMessageIsString(signedMessage)) {
          const result = await linkWallet(wonderWeb3.address, signedMessage, SupportedChainType.ETH);
          if (result === true) {
            router.push(`/onboarding/twitter${collabInviteQueryString}`, undefined, {
              shallow: true,
            });
          }
          if (result === false) {
            setErrorMessage('Error linking wallet, please contact support');
            wonderWeb3.disconnect();
          }
          if (result === GRAPHQL_ERRORS.WEB3_ADDRESS_ALREADY_EXISTS) {
            setErrorMessage('Address already taken');
            wonderWeb3.disconnect();
          }
        } else if (signedMessage === false) {
          setErrorMessage('Signature rejected. Try again.');
          wonderWeb3.disconnect();
        }
      }
    }
  }, [wonderWeb3]);

  useEffect(() => {
    if (wonderWeb3.address && wonderWeb3.active && wonderWeb3.web3Provider) {
      linkUserWithWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet, wonderWeb3.active, wonderWeb3.web3Provider]);

  const handleLaterClick = () => {
    router.push(`/onboarding/twitter${collabInviteQueryString}`, undefined, {
      shallow: true,
    });
  };

  const description = (
    <div>
      Get paid in USDC, ETH and native tokens. <br />
      Don’t have a digital wallet?{' '}
      <a href="https://metamask.io/download/" target="blank">
        <span
          style={{
            textDecoration: 'underline',
            color: '#0EA2D9',
          }}
        >
          {' '}
          Click here
        </span>{' '}
      </a>
      and we’ll help you set one up.
    </div>
  );

  const buttonStyles = {
    marginTop: '16px',
    width: '100%',
    maxWidth: '310px',
    minHeight: '40px',
    height: '40px',
    fontWeight: '500',
  };

  return (
    <OnboardingLayout
      title="Set up your wallet"
      displayFooter={false}
      description={description}
      onBackClick={() => router.back()}
      footer={() => null}
      step={4}
    >
      <Wallet>
        <WalletIcon />
      </Wallet>

      <Connectors>
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        {!isMobile && <MetaMaskConnector text="Continue with MetaMask" style={buttonStyles} />}
        <WalletConnectConnector text="Continue with Wallet Connect" style={buttonStyles} />
        <CoinbaseConnector text="Continue with Coinbase" style={buttonStyles} />
        <LaterButton
          onClick={handleLaterClick}
          style={{ ...buttonStyles, background: '#454545', marginRight: 0 }}
          data-cy="button-connect-later"
        >
          I&apos;ll connect it later
        </LaterButton>
      </Connectors>
      <div>
        <BackButton onClick={() => router.back()}>
          <LeftArrowIcon />
        </BackButton>
      </div>
    </OnboardingLayout>
  );
}

export default SetupWallet;
