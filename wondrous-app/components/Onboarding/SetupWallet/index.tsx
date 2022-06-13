import React from 'react';
import { useRouter } from 'next/router';

import MetaMaskConnector from 'components/WalletConnectors/MetaMask';
import WalletConnectConnector from 'components/WalletConnectors/WalletConnect';
import CoinbaseConnector from 'components/WalletConnectors/Coinbase';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';
import WalletIcon from '../../../public/images/onboarding/union.svg';

import { LaterButton } from 'components/Onboarding/OnboardingLayout/Footer/styles';
import { Connectors } from 'components/Onboarding/styles';
import { Wallet } from 'components/Onboarding/SetupWallet/styles';

export const SetupWallet = ({ updateUser }) => {
  const router = useRouter();

  const handleLaterClick = () => {
    router.push('/onboarding/twitter', undefined, {
      shallow: true,
    });
  };

  const description = (
    <div>
      Get paid in USDC, Eth, $WONDER, and your DAOs native social token. <br />
      Don’t have a digital wallet?{' '}
      <span
        style={{
          textDecoration: 'underline',
          color: '#0EA2D9',
        }}
      >
        {' '}
        Click here
      </span>{' '}
      and we’ll help you set one up.
    </div>
  );

  const buttonStyles = {
    marginTop: '16px',
    width: '100%',
    maxWidth: '278px',
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
        <MetaMaskConnector text="Continue with MetaMask" style={buttonStyles} />
        <CoinbaseConnector text="Continue with Coinbase" style={buttonStyles} />
        <WalletConnectConnector text="Continue with Wallet Connect" style={buttonStyles} />
        <LaterButton onClick={handleLaterClick} style={{ width: '278px', margin: '16px auto', background: '#454545' }}>
          I&apos;ll connect it later
        </LaterButton>
      </Connectors>
    </OnboardingLayout>
  );
};
