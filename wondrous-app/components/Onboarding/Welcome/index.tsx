import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useWonderWeb3 } from 'services/web3';
import { USERNAME_REGEX } from 'utils/constants';
import { CompletedIcon } from 'components/Icons/statusIcons';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';

import {
  InviteWelcomeBoxParagraph,
  UsernameTitle,
  UsernameDescription,
  UsernameInput,
  ErrorText,
  Label,
  WalletConnected,
} from '../styles';

const OnboardingWelcome = ({ updateUser, user }) => {
  const wonderWeb3 = useWonderWeb3();
  const router = useRouter();
  const [username, setUsername] = useState(user?.username);
  const [error, setError] = useState('');
  useEffect(() => {
    if (user?.username) {
      setUsername(user?.username);
    }
  }, [user?.username]);

  useEffect(() => {
    if (wonderWeb3?.onConnect) {
      wonderWeb3.onConnect();
    }
    const addressTag = wonderWeb3?.wallet?.addressTag;
    if (addressTag) {
      // Check if start of address is 0x
      if (!addressTag.startsWith('0x')) {
        const splitUsernameArr = wonderWeb3?.wallet?.addressTag.split('.');
        if (splitUsernameArr && splitUsernameArr[0]) {
          debugger;
          setUsername(splitUsernameArr[0].replace(/\./g, '_'));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3?.wallet?.addressTag]);

  const handleContinueClick = () => {
    if (username && user?.username === username) {
      router.push('/onboarding/build-profile', undefined, {
        shallow: true,
      });
    } else {
      if (USERNAME_REGEX.test(username)) {
        updateUser({
          variables: {
            input: {
              username,
            },
          },
          onError: (e) => {
            setError(e.message);
          },
        });
      } else {
        setError("Please enter a valid username with 3-15 alphanumeric characters with no '.'");
      }
    }
  };

  // TODO: Check if wallet is connected
  const headerRightContent = (
    <WalletConnected>
      <CompletedIcon fill="none" stroke="none" style={{ width: '26px', height: '26px' }} />{' '}
      <Label>Success! Wallet connected.</Label>
    </WalletConnected>
  );

  return (
    <OnboardingLayout
      title="Welcome to Wonder"
      onContinueClick={handleContinueClick}
      headerRightContent={headerRightContent}
      step={1}
    >
      <InviteWelcomeBoxParagraph
        style={{
          textAlign: 'left',
          width: '100%',
        }}
      >
        Earn crypto while contributoring to web3 projects. <br /> Let’s get your membership set up, it’ll take 2
        minutes.
      </InviteWelcomeBoxParagraph>
      <UsernameTitle>Enter your username</UsernameTitle>
      <UsernameDescription>You can do your Twitter handle, Discord, or something new</UsernameDescription>
      <UsernameInput
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        required
        error={!!error}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </OnboardingLayout>
  );
};

export default OnboardingWelcome;
