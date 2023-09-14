import { useMutation } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
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

const buttonStyles = {
  marginRight: "8px",
};

function getFormattedDate() {
  var date = new Date();
  var str =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  return str;
}

const WalletConnectPage = () => {
  const [searchParams] = useSearchParams();
  const wonderWeb3 = useWonderWeb3();
  const discordUserId = searchParams?.get("discordUserId");
  const telegramUserId = searchParams?.get("telegramUserId");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectionComplete, setConnectionComplete] = useState(false);

  const linkUserWithWallet = useCallback(async () => {
    if (wonderWeb3.address && wonderWeb3.chain && !wonderWeb3.connecting) {
      // get current timestamp
      const timestamp = Date.now().toString();

      const messageToSign = `Welcome to wonder\nDate: ${getFormattedDate()}\nTimestamp: ${Date.now().toString()}`;
      if (messageToSign) {
        const signedMessage = await wonderWeb3.signMessage(messageToSign);
        if (signedMessageIsString(signedMessage)) {
          const result = await linkCmtyUserWallet(
            discordUserId,
            wonderWeb3.address,
            signedMessage,
            SupportedChainType.ETH,
            messageToSign,
            telegramUserId
          );
          if (result === true) {
            setConnectionComplete(true);
          }
          if (result === false) {
            setErrorMessage("Error linking wallet, please contact support");
            wonderWeb3.disconnect();
          }
        } else if (signedMessage === false) {
          setErrorMessage("Signature rejected. Try again.");
          wonderWeb3.disconnect();
        }
      }
    }
  }, [wonderWeb3]);

  useEffect(() => {
    if (wonderWeb3.address && wonderWeb3.active && wonderWeb3.web3Provider) {
      linkUserWithWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet, wonderWeb3.active, wonderWeb3.web3Provider]);
  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid flex="2" display="flex" justifyContent="center" alignItems="center" gap="8px" flexDirection="column">
        {!connectionComplete ? (
          <>
            <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
              Connect your wallet via the providers below
            </Typography>
            <div
              style={{
                flex: "display",
                flexDirection: "row",
              }}
            >
              <MetaMaskConnector text="Continue with MetaMask" style={buttonStyles} />
              <WalletConnectConnector text="Continue with Wallet Connect" style={buttonStyles} />
              <CoinbaseConnector text="Continue with Coinbase" style={buttonStyles} />
            </div>
            {errorMessage && (
              <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px" lineHeight="24px" color="red">
                {errorMessage}
              </Typography>
            )}
          </>
        ) : (
          <>
            <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
              You're all set! Please close the page and return to {telegramUserId ? 'Telegram' : "Discord"}
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
