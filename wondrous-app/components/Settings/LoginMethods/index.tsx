import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWonderWeb3 } from 'services/web3';
import apollo from 'services/apollo';

import SettingsWrapper from 'components/Common/SidebarSettings';
import { DiscordIcon } from 'components/Icons/discord';
import LoadIcon from 'components/Icons/LoadIcon';
import {
  REQUEST_PASSWORD_RESET,
  UPDATE_USER,
  USER_DISCORD_DISCONNECT,
  USER_WALLET_DISCONNECT,
} from 'graphql/mutations';
import HeaderBlock from 'components/Settings/headerBlock';

import { useMe } from 'components/Auth/withAuth';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import { useMutation } from '@apollo/client';
import { DISCORD_CONNECT_TYPES, validateEmail } from 'utils/constants';
import { getDiscordUrl } from 'utils/index';
import WalletModal from 'components/Common/Wallet/WalletModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import ConfirmModal from 'components/Common/ConfirmModal';
import { WonderWeb3Context } from 'services/web3/context/WonderWeb3Context';
import { CircularProgress } from '@mui/material';
import { GeneralSettingsContainer } from 'components/Settings/styles';

import ErrorDisplay from './ErrorDisplay';
import { ErrorText } from '../../Common';
import {
  ButtonContainer,
  CancelSpan,
  ChangePasswordButton,
  ConnectToDiscordButton,
  ConnectToWalletButton,
  ContentContainer,
  LoginTitleContainer,
  ErrorContainer,
  IndicatorContainer,
  IndicatorText,
  InputFlexSection,
  InputSection,
  ReplaceWalletButton,
  SectionContainer,
  StatusContainer,
} from './styles';

const discordUrl = getDiscordUrl();

function LogInMethods(props) {
  const wonderWeb3 = useWonderWeb3();
  const loggedInUser = useMe();

  const router = useRouter();
  const { discordUserExists, discordError } = router.query;

  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [isWalletConnect, setIsWalletConnect] = useState(false);

  const [replaceWalletLoading, setReplaceWalletLoading] = useState(false);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [disconnectType, setDisconnectType] = useState('');
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [needMoreLoginMethod, setNeedMoreLoginMethod] = useState(null);
  const [showNeedMoreLoginError, setShowNeedMoreLoginError] = useState(null);
  const hasEmailLogin = loggedInUser?.userInfo?.email && loggedInUser?.userInfo?.hasPassword;
  const hasDiscordLogin = !!loggedInUser?.userInfo?.discordUsername;
  const hasWalletLogin = !!loggedInUser?.activeEthAddress;
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => openSnackBar('Email Added'),
    refetchQueries: [GET_LOGGED_IN_USER],
  });

  const [disconnectWallet] = useMutation(USER_WALLET_DISCONNECT, {
    onCompleted: () => {
      openSnackBar('Success! wallet disconnected');
      setOpenConfirmModal(false);
      setDisconnectLoading(false);
    },
    onError: (e) => {
      openSnackBar('Opps! Something went wrong');
      setOpenConfirmModal(false);
      setDisconnectLoading(false);
    },
    refetchQueries: [GET_LOGGED_IN_USER],
  });

  const openSnackBar = (message: string) => {
    setSnackbarAlertMessage(message);
    setSnackbarAlertOpen(true);
  };

  useEffect(() => {
    if (loggedInUser?.userInfo?.email) {
      setEmail(loggedInUser?.userInfo?.email);
    }
  }, [loggedInUser?.userInfo?.email]);

  useEffect(() => {
    setShowNeedMoreLoginError(null);
    const loginMethodArray = [hasEmailLogin, hasDiscordLogin, hasWalletLogin];
    const loginMethodCount = loginMethodArray.filter(Boolean).length;
    if (loginMethodCount === 0) {
      setNeedMoreLoginMethod(true);
    }
    if (loginMethodCount === 1) {
      setNeedMoreLoginMethod(true);
    }
    if (loginMethodCount > 1) {
      setNeedMoreLoginMethod(false);
    }
  }, [hasEmailLogin, hasDiscordLogin, hasWalletLogin]);

  const [disconnectDiscord] = useMutation(USER_DISCORD_DISCONNECT, {
    onCompleted: () => {
      openSnackBar('Success! discord disconnected');
      setDisconnectLoading(false);
      setOpenConfirmModal(false);
    },
    refetchQueries: [GET_LOGGED_IN_USER],
  });

  const handleAddEmail = async (e) => {
    e.preventDefault();
    setEmailError(null);
    setFormLoading(true);

    if (!loggedInUser?.userInfo?.email) {
      if (validateEmail(email)) {
        updateUser({
          variables: {
            input: {
              email,
            },
          },
        }).then(() => {
          setFormLoading(false);
        });
      } else {
        setFormLoading(false);
        setEmailError('Please enter a valid email');
      }
    }
  };

  const handleResetPassword = async () => {
    setFormLoading(true);
    await apollo
      .mutate({
        mutation: REQUEST_PASSWORD_RESET,
        variables: {
          email,
        },
      })
      .then(() => {
        openSnackBar('Reset password mail sent');
        setFormLoading(false);
      })
      .catch((e) => {
        setFormLoading(false);
        openSnackBar('Error sending reset email, please try again');
      });
  };

  const replaceWallet = () => {
    setReplaceWalletLoading(true);
    disconnectWallet().then((result) => {
      setWalletModalOpen(true);
      setIsWalletConnect(true);
    });
  };

  useEffect(() => {
    if (wonderWeb3?.onConnect) {
      wonderWeb3.onConnect();
    }
  }, []);

  useEffect(() => {
    if (loggedInUser?.activeEthAddress && isWalletConnect) {
      openSnackBar('Wallet connected successfully');
      setReplaceWalletLoading(false);
      setWalletModalOpen(false);
      setIsWalletConnect(false);
    }
  }, [loggedInUser]);

  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock
          title="Log in methods"
          description="Add/edit your log in methods. You can choose as many you require."
        />
        {needMoreLoginMethod && (
          <IndicatorContainer style={{ marginTop: 10 }}>
            <IndicatorText>
              You currently have only one active log in method. Please add one alternative before removing.
            </IndicatorText>
          </IndicatorContainer>
        )}
        <ContentContainer>
          <SectionContainer>
            <LoginTitleContainer>
              <p>Log in through email</p>
              <StatusContainer status={hasEmailLogin ? 'active' : 'inactive'}>
                {hasEmailLogin ? 'Active' : 'Inactive'}
              </StatusContainer>
            </LoginTitleContainer>
            {loggedInUser?.userInfo?.email && !loggedInUser?.userInfo?.hasPassword && (
              <IndicatorContainer>
                <IndicatorText>
                  No passowrd has been setup yet. Click reset password to receive a password reset email
                </IndicatorText>
              </IndicatorContainer>
            )}

            <InputSection>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                name="email"
                disabled={!!loggedInUser?.userInfo?.email}
              />
            </InputSection>
            {emailError && <ErrorText>{emailError}</ErrorText>}
            <InputFlexSection>
              {!loggedInUser?.userInfo?.email && (
                <ChangePasswordButton highlighted onClick={handleAddEmail}>
                  {formloading && (
                    <CircularProgress
                      style={{ borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}
                    />
                  )}
                  Add Email
                </ChangePasswordButton>
              )}
              {loggedInUser?.userInfo?.email && (
                <ChangePasswordButton highlighted onClick={handleResetPassword}>
                  {formloading && (
                    <CircularProgress
                      style={{ borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}
                    />
                  )}
                  Reset Password
                </ChangePasswordButton>
              )}
            </InputFlexSection>
          </SectionContainer>
          <SectionContainer>
            <LoginTitleContainer>
              <p>Log in through Discord</p>
            </LoginTitleContainer>
            <ButtonContainer>
              {hasDiscordLogin && (
                <ConnectToDiscordButton
                  onClick={() => {
                    if (!needMoreLoginMethod) {
                      setDisconnectType('discord');
                      setOpenConfirmModal(true);
                    } else {
                      setShowNeedMoreLoginError('discord');
                    }
                  }}
                >
                  <DiscordIcon />
                  Connected to {loggedInUser?.userInfo?.discordUsername}
                  <CancelSpan>x</CancelSpan>
                </ConnectToDiscordButton>
              )}
              {!hasDiscordLogin && (
                <ConnectToDiscordButton
                  onClick={() => {
                    const state = JSON.stringify({
                      callbackType: DISCORD_CONNECT_TYPES.loginMethod,
                    });
                    window.location.href = `${discordUrl}&state=${state}`;
                  }}
                >
                  <DiscordIcon />
                  Connect to discord
                </ConnectToDiscordButton>
              )}

              <StatusContainer status={hasDiscordLogin ? 'active' : 'inactive'}>
                {hasDiscordLogin ? 'active' : 'Inactive'}
              </StatusContainer>
            </ButtonContainer>
            {discordUserExists && <ErrorText>Discord user already connected to another account</ErrorText>}
            {discordError && <ErrorText>Error connecting to Discord. Please try again or contact support.</ErrorText>}
            {showNeedMoreLoginError === 'discord' && (
              <ErrorText>Cannot disconnect, Please add another login method first</ErrorText>
            )}
          </SectionContainer>
          <SectionContainer>
            <LoginTitleContainer>
              <p>Log in through your wallet</p>
            </LoginTitleContainer>
            <ButtonContainer>
              {!loggedInUser?.activeEthAddress && (
                <ConnectToWalletButton
                  onClick={() => {
                    setWalletModalOpen(true);
                    setIsWalletConnect(true);
                  }}
                  highlighted
                >
                  Link Wallet to Account
                </ConnectToWalletButton>
              )}
              {loggedInUser?.activeEthAddress && (
                <ConnectToWalletButton
                  onClick={() => {
                    if (!needMoreLoginMethod) {
                      setDisconnectType('wallet');
                      setOpenConfirmModal(true);
                    } else {
                      setShowNeedMoreLoginError('wallet');
                    }
                  }}
                  highlighted
                >
                  Disconnect Wallet <CancelSpan>x</CancelSpan>
                </ConnectToWalletButton>
              )}
              {loggedInUser?.activeEthAddress && (
                <ReplaceWalletButton
                  onClick={() => {
                    replaceWallet();
                  }}
                >
                  <LoadIcon />
                  {replaceWalletLoading ? 'Loading ...' : 'Replace wallet address'}
                </ReplaceWalletButton>
              )}
              <StatusContainer status={loggedInUser?.activeEthAddress ? 'active' : 'inactive'}>
                {loggedInUser?.activeEthAddress ? 'Active' : 'Inactive'}
              </StatusContainer>
            </ButtonContainer>
            {showNeedMoreLoginError === 'wallet' && (
              <ErrorText>Cannot disconnect, Please add another login method first</ErrorText>
            )}
          </SectionContainer>
        </ContentContainer>
      </GeneralSettingsContainer>
      <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />

      <ConfirmModal
        open={openConfirmModal}
        onClose={() => {
          setOpenConfirmModal(false);
        }}
        onSubmit={() => {
          setDisconnectLoading(true);
          if (disconnectType === 'discord') {
            disconnectDiscord();
          }
          if (disconnectType === 'wallet') {
            disconnectWallet();
          }
        }}
        title="Are you sure"
        submitLabel="Disconnect"
        cancelLabel="cancel"
        isLoading={disconnectLoading}
        rejectAction={() => {
          setOpenConfirmModal(false);
        }}
        reverseButtons
      >
        {null}
      </ConfirmModal>
    </SettingsWrapper>
  );
}

export default LogInMethods;
