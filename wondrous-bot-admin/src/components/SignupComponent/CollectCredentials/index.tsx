import { Box, ButtonBase, FormControl, Grid, Typography, useMediaQuery } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { emailSignup } from "components/Auth";
import { DiscordConnector } from "components/Connectors";
import { Connectors, ErrorTypography } from "components/Login/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DISCORD_CONNECT_TYPES, GRAPHQL_ERRORS } from "utils/constants";
import { SUPPORTED_CHAINS } from "utils/web3Constants";
import WalletConnect from "components/Icons/Login/walletconnect.svg";
import { Divider, StyledLink } from "./styles";
import { validate } from "./validator";
import useWeb3Auth from "services/web3/useWeb3Auth";
import GoogleOAuthButton from "components/OAuth/GoogleOAuth";

const CollectCredentials = ({ moveForward }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { email, password, confirmPassword } = credentials;
  const [errorMessage, setErrorMessage] = useState("");
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const [notSupportedChain, setNotSupportedChain] = useState(false);

  const { signupWithWallet, address, isConnected, chainId, open, isActivating } = useWeb3Auth({ setErrorMessage });

  const discordConnectError = searchParams.get("discordConnectError");
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const state = JSON.stringify({
    callbackType: DISCORD_CONNECT_TYPES.signup,
    ...(token ? { token } : {}),
    ...(type ? { type } : {}),
  });

  useEffect(() => {
    if (discordConnectError) {
      setErrorMessage("Error connecting your Discord. Please try again or connect with Metamask instead.");
    }
  }, [discordConnectError]);
  useEffect(() => {
    if (address && isConnected && isActivating) {
      signupWithWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isConnected, isActivating]);

  useEffect(() => {
    if (chainId) {
      setNotSupportedChain(!SUPPORTED_CHAINS[chainId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

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
      <Grid
        container
        direction="column"
        gap="28px"
        padding={{
          xs: "42px 24px",
          md: "42px",
        }}
        justifyContent="center"
        alignItems="center"
      >
        <Typography fontFamily="Poppins" fontSize="24px" fontWeight="700" lineHeight="24px" color="#2A8D5C">
          Sign up to Wonderverse
        </Typography>
        <Box sx={{ width: "80%" }}>
          <GoogleOAuthButton
            params={{
              token,
              type,
            }}
          />
        </Box>
        {!notSupportedChain && errorMessage ? <ErrorTypography>{errorMessage}</ErrorTypography> : ""}
        {notSupportedChain && (
          <ErrorTypography>Unsupported network, change to mainnet or a supported network</ErrorTypography>
        )}
        {/* <Connectors bgcolor="transparent">
          <ButtonBase onClick={open}>
            <img src={WalletConnect} />
          </ButtonBase>

          <DiscordConnector state={state} />
        </Connectors> */}
        <Box display="flex" alignItems="center" width="100%" gap="7px">
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
            Sign up with Email
          </SharedSecondaryButton>
          <Divider />
          <Box width="100%" display="flex" justifyContent="center" alignItems="center">
            <Box display="flex" flexDirection="column" gap="28px" width="90%">
              <Typography color="#808080" fontFamily="Poppins" fontSize="14px" fontWeight="500" textAlign="center">
                By continuing, you acknowledge that you have read and understood, and agree to Wonderverse’s <br />{" "}
                <StyledLink href="https://wonderverse.com/terms-of-service" target="_blank">
                  Terms & Conditions
                </StyledLink>{" "}
                and{" "}
                <StyledLink href="https://wonderverse.com/privacy-policy" target="_blank">
                  Privacy Policy
                </StyledLink>
                .
              </Typography>
              <Typography color="#808080" fontFamily="Poppins" fontSize="14px" fontWeight="500" textAlign="center">
                Already signed up?{" "}
                <Link to="/login">
                  <StyledLink>Go to login</StyledLink>
                </Link>
              </Typography>
            </Box>
          </Box>
        </FormControl>
      </Grid>
    </>
  );
};

export default CollectCredentials;
