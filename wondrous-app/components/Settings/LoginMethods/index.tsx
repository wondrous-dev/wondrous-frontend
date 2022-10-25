import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWonderWeb3 } from 'services/web3';
import apollo from 'services/apollo';

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
import { REQUEST_PASSWORD_RESET, USER_DISCORD_DISCONNECT, USER_WALLET_DISCONNECT } from 'graphql/mutations';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import { useMutation } from '@apollo/client';
import { DISCORD_CONNECT_TYPES } from 'utils/constants';
import { getDiscordUrl } from 'utils/index';
import ErrorDisplay from './ErrorDisplay';
import { ErrorText } from '../../Common';
import WalletModal from 'components/Common/Wallet/WalletModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import ConfirmModal from 'components/Common/ConfirmModal';
import { WonderWeb3Context } from 'services/web3/context/WonderWeb3Context';
import { CircularProgress } from '@mui/material';

const discordUrl = getDiscordUrl();

function LogInMethods(props) {
  const wonderWeb3 = useWonderWeb3();

  const { provider } = useContext(WonderWeb3Context);
  const router = useRouter();
  const { discordUserExists, discordError } = router.query;
  const [methodCheck, setMethodCheck] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const { loggedInUser } = props;
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [firstConnect, setFirstConnect] = useState(true);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [disconnectType, setDisconnectType] = useState('');
  const [loading, setLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [isWalletConnect, setIsWalletConnect] = useState(false);
  const [disconnectWallet] = useMutation(USER_WALLET_DISCONNECT, {
    onCompleted: () => {
      openSnackBar('Success!  wallet disconnected');
      setLoading(false);
    },
    onError: (e) => {
      console.error(e);
      openSnackBar('Opps! Something went wrong');
      setLoading(false);
    },
    refetchQueries: [GET_LOGGED_IN_USER],
  });

  console.log(loggedInUser, isWalletConnect, 'loggedinuser');

  const openSnackBar = (message: string) => {
    setSnackbarAlertMessage(message);
    setSnackbarAlertOpen(true);
  };

  const [disconnectDiscord] = useMutation(USER_DISCORD_DISCONNECT, {
    onCompleted: () => {
      openSnackBar('Success! discord disconnected');
      setLoading(false);
    },
    refetchQueries: [GET_LOGGED_IN_USER],
  });

  const [formData, setFormData] = useState<{ email: string }>({
    email: '',
  });

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    await apollo
      .mutate({
        mutation: REQUEST_PASSWORD_RESET,
        variables: {
          email: formData.email,
        },
      })
      .then(() => {
        openSnackBar('Reset password mail sent');
        setFormLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setFormLoading(false);

        openSnackBar('Error sending reset email, please try again');
      });
  };

  const replaceWallet = () => {
    setReplaceLoading(true);
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
    if (loggedInUser && loggedInUser.userInfo.email) {
      setFormData({
        ...formData,
        email: loggedInUser.userInfo.email,
      });
    }
  }, [loggedInUser]);

  useEffect(() => {
    // Don't listen to anything before the connection to the
    // wallet is done.
    if (!wonderWeb3.connecting) {
      // Enable the wallet.
      if (wonderWeb3.address) {
        // Change the UI now.
        setConnected(true);
        // Wallet disabled.
      } else if (!firstConnect) {
        setConnected(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.address, provider]);

  useEffect(() => {
    if (loggedInUser?.activeEthAddress && isWalletConnect) {
      openSnackBar('Wallet connected successfully');
      setReplaceLoading(false);
      setTimeout(() => {
        setIsWalletConnect(false);
      }, 3000);
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
              <p>Log in through email</p>
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
                  value={formData.email}
                  type="email"
                  name="email"
                  placeholder="eth.reverise@gmail.com"
                />
              </InputSection>
              <InputFlexSection>
                <ChangePasswordButton highlighted={true}>
                  {formloading && (
                    <CircularProgress
                      style={{ borderRadius: '50%', width: '20px', height: '20px', marginRight: '10px' }}
                    />
                  )}
                  Reset Password
                </ChangePasswordButton>
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
                      callbackType: DISCORD_CONNECT_TYPES.loginMethod,
                    });
                    window.location.href = `${discordUrl}&state=${state}`;
                  } else if (loggedInUser?.activeEthAddress || loggedInUser?.userInfo?.email) {
                    setDisconnectType('discord');
                    setOpenConfirmModal(true);
                  } else {
                    setMethodCheck('discord');
                  }
                }}
              >
                <DiscordIcon />
                {loggedInUser?.userInfo?.discordUsername ? (
                  <>
                    Connected to ${loggedInUser?.userInfo?.discordUsername} <CancelSpan>x</CancelSpan>
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
                    setIsWalletConnect(true);
                  } else if (loggedInUser?.userInfo?.discordUsername || loggedInUser?.userInfo?.email) {
                    setDisconnectType('wallet');
                    setOpenConfirmModal(true);
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
              {loggedInUser?.activeEthAddress && (
                <ReplaceWalletButton
                  onClick={() => {
                    replaceWallet();
                  }}
                >
                  <LoadIcon />
                  {replaceLoading ? 'Loading ...' : 'Replace wallet address'}
                </ReplaceWalletButton>
              )}
              <StatusContainer status={loggedInUser?.activeEthAddress ? 'active' : 'inactive'}>
                {loggedInUser?.activeEthAddress ? 'Active' : 'Inactive'}
              </StatusContainer>
            </ButtonContainer>
            {methodCheck === 'wallet' && <ErrorDisplay method={'Wallet'} />}
            {!connected && <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />}
          </SectionContainer>
        </ContentContainer>
      </LogInMethodContainer>
      <ConfirmModal
        open={openConfirmModal}
        onClose={() => {
          setOpenConfirmModal(false);
        }}
        onSubmit={() => {
          setLoading(true);
          if (disconnectType === 'discord') {
            disconnectDiscord();
          }
          if (disconnectType === 'wallet') {
            disconnectWallet();
          }
        }}
        title={'Are you sure'}
        submitLabel="Disconnect"
        cancelLabel="cancel"
        isLoading={loading}
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
