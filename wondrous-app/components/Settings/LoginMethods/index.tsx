import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWonderWeb3 } from 'services/web3';
import SettingsWrapper from 'components/Common/SidebarSettings';
import {
  ButtonContainer,
  CancelSpan,
  ChangePasswordButton,
  ConnectToDiscordButton,
  ConnectToWalletButton,
  ContentContainer,
  ErrorContainer,
  HeadingDescription,
  HeadingText,
  IndicatorContainer,
  InputFlexSection,
  InputSection,
  LogInMethodContainer,
  LogInMethodForm,
  LoginTitleContainer,
  ReplaceWalletButton,
  ResetButton,
  SaveChangesButton,
  SectionContainer,
  StatusContainer,
} from './styles';
import { HeaderBlock } from '../headerBlock';
import { DiscordIcon } from 'components/Icons/discord';
import LoadIcon from 'components/Icons/LoadIcon';
import IndicateIcon from 'components/Icons/IndicateIcon';
import { USER_DISCORD_DISCONNECT, USER_WALLET_DISCONNECT } from 'graphql/mutations';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import { useMutation } from '@apollo/client';
import { DISCORD_CONNECT_TYPES } from 'utils/constants';
import { getDiscordUrl } from 'utils/index';
import ErrorDisplay from './ErrorDisplay';
import { ErrorText } from '../../Common';
import WalletModal from 'components/Common/Wallet/WalletModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';

const discordUrl = getDiscordUrl();

function LogInMethods(props) {
  const router = useRouter();
  const { discordUserExists, discordError } = router.query;
  const wonderWeb3 = useWonderWeb3();
  const [methodCheck, setMethodCheck] = useState<string>('');
  const { loggedInUser } = props;
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [firstConnect, setFirstConnect] = useState(true);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);
  const [disconnectWallet] = useMutation(USER_WALLET_DISCONNECT, {
    onCompleted: () => {
      setSnackbarAlertMessage('Success!  wallet disconnected');
      setSnackbarAlertOpen(true);
    },
    onError: (e) => {
      console.error(e);
      setSnackbarAlertMessage('Opps! Something went wrong');
      setSnackbarAlertOpen(true);
    },
    refetchQueries: [GET_LOGGED_IN_USER],
  });

  console.log(loggedInUser, 'loggedinuser');

  const [disconnectDiscord] = useMutation(USER_DISCORD_DISCONNECT, {
    refetchQueries: [GET_LOGGED_IN_USER],
  });

  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(() => {
    if (wonderWeb3?.onConnect) {
      wonderWeb3.onConnect();
    }
  }, []);

  const disconnectWalletFunction = () => {
    disconnectWallet();
  };
  useEffect(() => {
    if (loggedInUser && loggedInUser.userInfo.email) {
      setFormData({
        ...formData,
        email: loggedInUser.userInfo.email,
      });
    }
  }, [loggedInUser]);
  return (
    <SettingsWrapper>
      <LogInMethodContainer>
        <div>
          <HeadingText>Log in methods</HeadingText>
          <HeadingDescription>Add/edit your log in methods. You can choose as many you require.</HeadingDescription>
        </div>
        {methodCheck && (
          <SectionContainer>
            <IndicatorContainer>
              <IndicateIcon />
              <p>You currently have only one active log in method. Please add one alternative before removing.</p>
            </IndicatorContainer>
          </SectionContainer>
        )}
        <ContentContainer>
          <SectionContainer>
            <LoginTitleContainer>
              <p>Log in through password and email</p>
              <StatusContainer status={loggedInUser?.userInfo?.email ? 'active' : 'inactive'}>
                {loggedInUser?.userInfo?.email ? 'Active' : 'Inactive'}
              </StatusContainer>
            </LoginTitleContainer>
            <LogInMethodForm
              onSubmit={(e) => {
                onSubmit(e);
              }}
            >
              <InputSection>
                <label htmlFor="email">Email</label>
                <input
                  onChange={(e) => handleInputs(e)}
                  type="email"
                  name="email"
                  placeholder="eth.reverise@gmail.com"
                />
              </InputSection>
              <InputFlexSection>
                <InputSection>
                  <label htmlFor="password">Password</label>
                  <input onChange={(e) => handleInputs(e)} name="password" type="password" />
                </InputSection>
                <ChangePasswordButton highlighted={true}>Change Password</ChangePasswordButton>
              </InputFlexSection>
            </LogInMethodForm>
          </SectionContainer>
          <SectionContainer>
            <LoginTitleContainer>
              <p>Log in through Discord</p>
            </LoginTitleContainer>
            <ButtonContainer>
              <ConnectToDiscordButton
                onClick={() => {
                  if (!loggedInUser?.userInfo?.discordUsername) {
                    const state = JSON.stringify({
                      callbackType: DISCORD_CONNECT_TYPES.connectSettings,
                    });
                    window.location.href = `${discordUrl}&state=${state}`;
                  }
                  if (loggedInUser?.activeEthAddress || loggedInUser?.userInfo?.email) {
                    disconnectDiscord();
                  } else {
                    setMethodCheck('discord');
                  }
                }}
              >
                <DiscordIcon />
                {loggedInUser?.userInfo?.discordUsername ? (
                  <>
                    Connected to ${loggedInUser?.userInfo?.discordUsername} <CancelSpan>x</CancelSpan>{' '}
                  </>
                ) : (
                  'Connect to discord'
                )}
              </ConnectToDiscordButton>
              <StatusContainer status={loggedInUser?.userInfo?.discordUsername ? 'active' : 'inactive'}>
                {loggedInUser?.userInfo?.discordUsername ? 'active' : 'Inactive'}
              </StatusContainer>
            </ButtonContainer>
            {methodCheck === 'discord' && <ErrorDisplay method={'Discord'} />}
            {discordUserExists && <ErrorText>Discord user already connected to another account</ErrorText>}
            {discordError && <ErrorText>Error connecting to Discord. Please try again or contact support.</ErrorText>}
          </SectionContainer>
          <SectionContainer>
            <LoginTitleContainer>
              <p>Log in through your wallet</p>
            </LoginTitleContainer>
            <ButtonContainer>
              <ConnectToWalletButton
                onClick={() => {
                  if (!loggedInUser?.activeEthAddress) {
                    setWalletModalOpen(true);
                  }
                  if (loggedInUser?.userInfo?.discordUsername || loggedInUser?.userInfo?.email) {
                    disconnectWalletFunction();
                  } else {
                    setMethodCheck('wallet');
                  }
                }}
                highlighted={true}
              >
                {!loggedInUser?.activeEthAddress ? (
                  'Link Wallet to Account'
                ) : (
                  <>
                    Disconnect Wallet <CancelSpan>x</CancelSpan>
                  </>
                )}
              </ConnectToWalletButton>
              <ReplaceWalletButton>
                <LoadIcon /> Replace wallet address
              </ReplaceWalletButton>
              <StatusContainer status={loggedInUser?.activeEthAddress ? 'active' : 'inactive'}>
                {loggedInUser?.activeEthAddress ? 'Active' : 'Inactive'}
              </StatusContainer>
            </ButtonContainer>
            {methodCheck === 'wallet' && <ErrorDisplay method={'Wallet'} />}
            <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
          </SectionContainer>

          <ButtonContainer>
            <ResetButton>Reset changes</ResetButton>
            <SaveChangesButton highlighted>Save changes </SaveChangesButton>
          </ButtonContainer>
        </ContentContainer>
      </LogInMethodContainer>
    </SettingsWrapper>
  );
}

export default LogInMethods;
