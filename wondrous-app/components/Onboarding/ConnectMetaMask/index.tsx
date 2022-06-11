import React from 'react';
import { useRouter } from 'next/router';

import MetaMaskConnector from 'components/WalletConnectors/MetaMask';
import WalletConnectConnector from "components/WalletConnectors/WalletConnect";
import CoinbaseConnector from "components/WalletConnectors/Coinbase";
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';
import MetaMaskWallet from '../../../public/images/onboarding/union.svg';

import { ConnectLater } from 'components/Onboarding/OnboardingLayout/Footer/styles';

export const OnboardingWallet = ({ updateUser }) => {
  const router = useRouter();

  const handleLaterClick = () => {
      router.push('/onboarding/email-setup', undefined, {
          shallow: true,
      })
  }
    const buttonStyle = {
      marginBottom: '20px'
    };

  // TODO: need url for 'click here', color && underline - temporary variant
  const description = (
    <div>
      Get paid in USDC, Eth, $WONDER, and your DAOs native social token. <br />
      Don’t have a digital wallet? <span
      style={{
        textDecoration: 'underline',
        color: "#0EA2D9"
      }}> Click here</span> and we’ll help you set one up.
    </div>
  );

  return (
    <OnboardingLayout
      title="Set up your wallet"
      description={description}
      borderNone={0}
      step={4}
    >
      <MetaMaskWallet
        style={{
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      />
      <div
        style={{
          maxWidth: '326px',
          width: '100%',
          justifySelf: 'center',
          alignSelf: 'center',
          marginBottom: '-55px'
        }}
      >
        <MetaMaskConnector text="Continue with MetaMask" style={buttonStyle}/>
        <CoinbaseConnector text="Continue with Coinbase" style={buttonStyle}/>
        <WalletConnectConnector text="Continue with WalletConnect" style={buttonStyle}/>
        {/*Todo: fix button background color*/}
        <ConnectLater onClick={handleLaterClick} style={{width: '100%', height: '50px'}}>
          I&apos;ll connect it later
        </ConnectLater>
        {/*Todo: fix StyledHR in OnboardingFooter*/}
      </div>
    </OnboardingLayout>
  );
};
