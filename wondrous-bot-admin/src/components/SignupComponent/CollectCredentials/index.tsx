import { Box, FormControl, Grid, Typography, useMediaQuery } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { emailSignup, getUserSigningMessage, walletSignin, walletSignup } from "components/Auth";
import { MetaMaskConnector, DiscordConnector, CoinbaseConnector, WalletConnectConnector } from "components/Connectors";
import { Connectors, ErrorTypography } from "components/Login/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useWonderWeb3 from "services/web3/useWonderWeb3";
import { DISCORD_CONNECT_TYPES, GRAPHQL_ERRORS } from "utils/constants";
import { signedMessageIsString, SupportedChainType, SUPPORTED_CHAINS } from "utils/web3Constants";

import { Divider } from "./styles";
import { validate } from "./validator";

const CollectCredentials = ({ moveForward }) => {
  const wonderWeb3 = useWonderWeb3();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { email, password, confirmPassword } = credentials;
  const [errorMessage, setErrorMessage] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const [notSupportedChain, setNotSupportedChain] = useState(false);

  const discordConnectError = searchParams.get("discordConnectError");
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const state = JSON.stringify({
    callbackType: DISCORD_CONNECT_TYPES.signup,
    ...(token ? { token } : {}),
    ...(type ? { type } : {}),
  });

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
                setErrorMessage("Unable to log in existing user - please contact support in discord");
              }
              // setErrorMessage('Account already exists');
            } else {
              setErrorMessage("Unable to join org - please contact support in discord.");
            }
          }
          if (user) {
            //
            moveForward();
          }
        } else if (signedMessage === false) {
          setErrorMessage("Signature rejected. Try again.");
          wonderWeb3.disconnect();
        } else {
          setErrorMessage("There has been an issue, contact with support.");
        }
      } else {
        setErrorMessage("Signup failed - please contact support.");
      }
    }
  };
  useEffect(() => {
    if (discordConnectError) {
      setErrorMessage("Error connecting your Discord. Please try again or connect with Metamask instead.");
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
      setNotSupportedChain(!SUPPORTED_CHAINS[wonderWeb3.chain]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet.chain]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };
  const formConfig = [
    {
      type: "email",
      name: "email",
      value: email,
      onChange: handleChange,
      placeholder: "Enter email address",
      required: true,
      Component: CustomTextField,
    },
    {
      Component: Box,
    },
    {
      type: "password",
      name: "password",
      value: password,
      onChange: handleChange,
      placeholder: "Enter password",
      required: true,
      Component: CustomTextField,
    },
    {
      type: "password",
      name: "confirmPassword",
      required: true,
      value: confirmPassword,
      onChange: handleChange,
      placeholder: "Confirm password",
      Component: CustomTextField,
    },
  ];

  const handleSubmit = async () => {
    setErrors({});
    try {
      await validate(credentials);
      const { email, password } = credentials;
      const result = await emailSignup(email, password);
      if (result?.success) {
        moveForward();
      } else if (result === GRAPHQL_ERRORS.EMAIL_ALREADY_EXIST) {
        setErrorMessage("This email is already registered. Please log in");
      } else if (result === GRAPHQL_ERRORS.INVALID_EMAIL) {
        setErrorMessage("Please enter a valid email");
      }
    } catch (error) {
      error.inner.forEach((error) => {
        setErrors((prev) => ({ ...prev, [error.path]: error.message }));
      });
    }
  };

  return (
    <>
      <Grid container direction="column" gap="24px" padding="24px" justifyContent="center" alignItems="center">
        <Typography fontFamily="Poppins" fontSize="24px" fontWeight="700" lineHeight="24px" color="#2A8D5C">
          Sign up to Communities
        </Typography>

        {!notSupportedChain && errorMessage ? <ErrorTypography>{errorMessage}</ErrorTypography> : ""}
        {notSupportedChain && (
          <ErrorTypography>Unsupported network, change to mainnet or a supported network</ErrorTypography>
        )}
        <Connectors bgcolor="transparent">
          {/* {!isMobile && <MetaMaskConnector />} */}
          <DiscordConnector state={state} />
          {/* <CoinbaseConnector />
          <WalletConnectConnector /> */}
        </Connectors>
        <Box display="flex" alignItems="center" width="100%" gap="7px">
          <Divider />
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="15px" lineHeight="15px" color="#949494">
            Or
          </Typography>
          <Divider />
        </Box>
        <FormControl
          fullWidth
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {formConfig.map(({ Component, ...rest }, idx) => (
            <Box display="flex" gap="6px" flexDirection="column" width="100%">
              <Component {...rest} />
              {errors[rest.name] ? <ErrorTypography>{errors[rest.name]}</ErrorTypography> : null}
            </Box>
          ))}
          <SharedSecondaryButton sx={{ marginTop: "10px" }} type="button" onClick={handleSubmit}>
            Signup
          </SharedSecondaryButton>
        </FormControl>
      </Grid>
    </>
  );
};

export default CollectCredentials;
