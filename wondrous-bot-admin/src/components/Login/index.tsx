import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import useWonderWeb3 from 'services/web3/useWonderWeb3';
import { DISCORD_CONNECT_TYPES, GRAPHQL_ERRORS } from 'utils/constants';
import { useNavigate, useParams } from 'react-router-dom';

import {
  emailSignin,
  getUserSigningMessage,
  walletSignin,
} from 'components/Auth';
import { signedMessageIsString, SUPPORTED_CHAINS } from 'utils/web3Constants';
import { Connectors, ErrorTypography, MainWrapper } from './styles';
import { Box, FormControl, Grid, Typography } from '@mui/material';
import { CustomTextField } from 'components/AddFormEntity/components/styles';
import { RoundedSecondaryButton } from 'components/Shared/styles';
import {
  CoinbaseConnector,
  DiscordConnector,
  MetaMaskConnector,
  WalletConnectConnector,
} from 'components/Connectors';

function Login() {
  const wonderWeb3 = useWonderWeb3();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notSupportedChain, setNotSupportedChain] = useState(false);

  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { discordConnectError, collabInvite, token, type } = useParams();

  const state = JSON.stringify({
    callbackType: DISCORD_CONNECT_TYPES.login,
    ...(collabInvite ? { collabInvite } : {}),
    ...(token ? { token } : {}),
    ...(type ? { type } : {}),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userOrErrorMessage = await emailSignin(email, password);
    // handleUserOnboardingRedirect(userOrErrorMessage, router);
    navigate('/');
    if (userOrErrorMessage === 'Incorrect Email and Password combination') {
      setErrorMessage('Incorrect Email and Password combination');
    }
  };

  // This happens async, so we bind it to the
  // state of the component.
  const loginWithWallet = async () => {
    setErrorMessage(null);
    if (wonderWeb3.address && wonderWeb3.chain && !wonderWeb3.connecting) {
      // Retrieve Signed Message
      const messageToSign = await getUserSigningMessage(
        wonderWeb3.address,
        'eth'
      );
      if (messageToSign) {
        const signedMessage = await wonderWeb3.signMessage(messageToSign);
        if (signedMessageIsString(signedMessage)) {
          // Sign with Wallet
          try {
            const user = await walletSignin(wonderWeb3.address, signedMessage);
            if (user) {
              // TODO : check after connecting API
              //   handleUserOnboardingRedirect(user, router);
              navigate('/');
            }
          } catch (err) {
            console.log('err?.graphQLErrors', err?.graphQLErrors);
            if (
              err?.graphQLErrors[0]?.extensions.errorCode ===
              GRAPHQL_ERRORS.NO_WEB3_ADDRESS_FOUND
            ) {
              setErrorMessage(
                'Address not found, check you are connected to the correct address'
              );
            } else {
              setErrorMessage(err?.message || err);
            }
          }
        } else if (signedMessage !== undefined) {
          setErrorMessage('You need to sign the message on your wallet');
        }
      } else {
        setErrorMessage('Login failed - try again.');
      }
    }
  };

  useEffect(() => {
    if (discordConnectError) {
      setErrorMessage(
        'Error connecting your Discord. Please try again or connect with Metamask instead.'
      );
    }
  }, [discordConnectError]);
  useEffect(() => {
    if (wonderWeb3.wallet.address && !wonderWeb3.isActivating) {
      // Wallet sign in
      loginWithWallet();
    } else {
      // Error Login Here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet, wonderWeb3.isActivating]);

  useEffect(() => {
    if (wonderWeb3.wallet.chain) {
      setNotSupportedChain(!SUPPORTED_CHAINS[wonderWeb3.chain]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet.chain]);

  return (
    <MainWrapper>
      <Box bgcolor='black' borderRadius='20px'
          width='500px'
      
      >
        <Grid
          bgcolor='white'
          container
          width="100%"
          sx={{
            transform: 'translateY(-20px)',
          }}
          direction='column'
          borderRadius='20px'
          border='1px solid #06040A'
          overflow='hidden'
        >
          <Grid item>
            {/* HEADER */}
            <Box padding='24px 20px' bgcolor='#F7F7F7'>
              <img src='/images/wonder-logo-2.svg' />
            </Box>
            {/* BODY */}
            <Grid
              container
              direction='column'
              gap='24px'
              padding='24px'
              justifyContent='center'
              alignItems='center'
            >
              <Typography
                fontFamily='Poppins'
                fontSize='24px'
                fontWeight='700'
                lineHeight='24px'
                color='#2A8D5C'
              >
                Log in with email
              </Typography>
              {!notSupportedChain && errorMessage ? (
                <ErrorTypography>{errorMessage}</ErrorTypography>
              ) : (
                ''
              )}
              {notSupportedChain && (
                <ErrorTypography>
                  Unsupported network, change to mainnet or a supported network
                </ErrorTypography>
              )}
              <FormControl
                onSubmit={handleSubmit}
                fullWidth
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <CustomTextField
                  type='email'
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter email address'
                  required
                />
                <CustomTextField
                  type='password'
                  name='password'
                  value={email}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter password'
                  required
                />
                <RoundedSecondaryButton sx={{ marginTop: '10px' }}>
                  Log me in
                </RoundedSecondaryButton>
              </FormControl>
            </Grid>
            {/* FOOTER */}
            <Connectors>
              {!isMobile && <MetaMaskConnector />}
              <DiscordConnector state={state} />
              <CoinbaseConnector />
              <WalletConnectConnector />
            </Connectors>
          </Grid>
        </Grid>
      </Box>
    </MainWrapper>
  );
}

export default Login;
