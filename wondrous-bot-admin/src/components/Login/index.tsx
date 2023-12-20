import { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import useWonderWeb3 from "services/web3/useWonderWeb3";
import { DISCORD_CONNECT_TYPES } from "utils/constants";
import { useLocation, useNavigate } from "react-router-dom";

import { emailSignin } from "components/Auth";
import { SUPPORTED_CHAINS } from "utils/web3Constants";
import { Connectors, ErrorTypography } from "./styles";
import { ButtonBase, FormControl, Grid, Typography } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { RoundedSecondaryButton, SharedSecondaryButton } from "components/Shared/styles";
import { DiscordConnector } from "components/Connectors";
import { handleUserOnboardingRedirect } from "utils/common";
import AuthLayout from "components/Shared/AuthLayout";
import { LinkWithQuery } from "components/Shared/LinkWithQuery";
import WalletConnect from "components/Icons/Login/walletconnect.svg";
import useWeb3Auth from "services/web3/useWeb3Auth";

function Login() {
  // since we can't disconnect a user's wallet this is used in order to check if the user actually clicked the login button
  const [email, setEmail] = useState("");
  const { search } = useLocation();
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notSupportedChain, setNotSupportedChain] = useState(false);

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const searchParams = new URLSearchParams(search);

  const discordConnectError = searchParams.get("discordConnectError");
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const params = {
    discordConnectError,
    token,
    type,
  };

  const state = JSON.stringify({
    callbackType: DISCORD_CONNECT_TYPES.login,
    ...(token ? { token } : {}),
    ...(type ? { type } : {}),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const userOrErrorMessage = await emailSignin(email, password);
    handleUserOnboardingRedirect(userOrErrorMessage, navigate, params);
    if (userOrErrorMessage === "Incorrect Email and Password combination") {
      setErrorMessage("Incorrect Email and Password combination");
    }
  };

  const { loginWithWallet, address, isConnected, chainId, open, isActivating } = useWeb3Auth({ setErrorMessage });

  useEffect(() => {
    if (discordConnectError) {
      setErrorMessage("Error connecting your Discord. Please try again or connect with Metamask instead.");
    }
  }, [discordConnectError]);

  useEffect(() => {
    if (address && isConnected && isActivating) {
      // Wallet sign in
      loginWithWallet();
    } else {
      // Error Login Here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, isActivating]);

  useEffect(() => {
    if (chainId) {
      setNotSupportedChain(!SUPPORTED_CHAINS[chainId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return (
    <AuthLayout
      headerButton={() => (
        <LinkWithQuery to="/signup">
          <SharedSecondaryButton type="button">Sign Up</SharedSecondaryButton>
        </LinkWithQuery>
      )}
    >
      <Grid container direction="column" gap="24px" padding="24px" justifyContent="center" alignItems="center">
        <Typography fontFamily="Poppins" fontSize="24px" fontWeight="700" lineHeight="24px" color="#2A8D5C">
          Log in with email
        </Typography>
        {!notSupportedChain && errorMessage ? <ErrorTypography>{errorMessage}</ErrorTypography> : ""}
        {notSupportedChain && (
          <ErrorTypography>Unsupported network, change to mainnet or a supported network</ErrorTypography>
        )}
        <FormControl
          fullWidth
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <CustomTextField
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
          />
          <CustomTextField
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <RoundedSecondaryButton sx={{ marginTop: "10px" }} onClick={handleSubmit}>
            Log me in
          </RoundedSecondaryButton>
        </FormControl>
      </Grid>
      {/* FOOTER */}
      <Connectors>
        <ButtonBase onClick={open}>
          <img src={WalletConnect} />
        </ButtonBase>
        <DiscordConnector state={state} />
      </Connectors>
    </AuthLayout>
  );
}

export default Login;
