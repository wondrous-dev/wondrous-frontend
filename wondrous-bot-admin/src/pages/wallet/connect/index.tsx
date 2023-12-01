import { useMutation } from "@apollo/client";
import { Box, ButtonBase, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { CONNECT_COMMUNITY_USER_WALLET, VERIFY_COMMUNITY_USER_TWITTER } from "graphql/mutations";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "./styles";
import { CoinbaseConnector, MetaMaskConnector, WalletConnectConnector } from "components/Connectors";
import useWonderWeb3 from "services/web3/useWonderWeb3";
import { SupportedChainType, signedMessageIsString } from "utils/web3Constants";
import apollo from "services/apollo";
import { linkCmtyUserWallet } from "components/Auth";
import { GRAPHQL_ERRORS } from "utils/constants";
import useWeb3Auth from "services/web3/useWeb3Auth";
import WalletConnect from "components/Icons/Login/walletconnect.svg";
import { SharedSecondaryButton } from "components/Shared/styles";
import Spinner from "components/Shared/Spinner";

const buttonStyles = {
  marginRight: "8px",
};

const WalletConnectPage = () => {
  const [searchParams] = useSearchParams();
  const discordUserId = searchParams?.get("discordUserId");
  const verificationCode = searchParams?.get("verificationCode");
  const telegramUserId = searchParams?.get("telegramUserId");
  const migrateOrgId = searchParams?.get("migrateOrgId");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectionComplete, setConnectionComplete] = useState(false);

  const { linkUserWithWallet, address, closeWeb3Modal, isActivating, isConnected, open } = useWeb3Auth({
    setErrorMessage,
  });

  const connectCmtyUserWallet = () =>
    linkUserWithWallet({
      discordUserId,
      telegramUserId,
      migrateOrgId,
      verificationCode,
      onSuccess: () => {
        setConnectionComplete(true);
      },
      onFail: () => setErrorMessage("Error linking wallet, please contact support"),
    });

  useEffect(() => {
    if (address && isConnected && isActivating && verificationCode) {
      connectCmtyUserWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isConnected, isActivating, verificationCode]);

  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid flex="2" display="flex" justifyContent="center" alignItems="center" gap="8px" flexDirection="column">
        {!connectionComplete ? (
          <Box display="flex" gap="24px" flexDirection="column">
            <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
              Connect your wallet
            </Typography>
            <SharedSecondaryButton onClick={open}>{isActivating ? <Spinner /> : "Connect"}</SharedSecondaryButton>
            {errorMessage && (
              <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px" lineHeight="24px" color="red">
                {errorMessage}
              </Typography>
            )}
          </Box>
        ) : (
          <>
            <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
              You're all set! Please close the page and return to {telegramUserId ? "Telegram" : "Discord"}
            </Typography>
          </>
        )}
      </Grid>
      <Grid
        flex="1"
        sx={{
          backgroundImage: "url(/images/home-bg.png)",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        position="relative"
      ></Grid>
    </Grid>
  );
};

export default WalletConnectPage;
