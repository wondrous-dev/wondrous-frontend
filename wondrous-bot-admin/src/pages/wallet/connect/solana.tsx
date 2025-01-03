import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CONNECT_SOLANA_COMMUNITY_USER_WALLET } from "graphql/mutations";
import { SupportedChainType } from "utils/web3Constants";
import apollo from "services/apollo";
import { useSearchParams } from "react-router-dom";

// You may need to import required CSS for the WalletMultiButton
// import '@solana/wallet-adapter-react-ui/styles.css';
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

const ConnectSolanaButton = ({ onConnection }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { wallet, connect, connecting, connected, publicKey, signMessage } = useWallet();

  const [searchParams] = useSearchParams();
  const discordUserId = searchParams?.get("discordUserId");
  const verificationCode = searchParams?.get("verificationCode");
  const [connectionComplete, setConnectionComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const linkUserWithSolanaWallet = async ({ discordUserId, verificationCode, onSuccess, onFail }) => {
    if (publicKey && signMessage) {
      const messageToSign = `Welcome to wonder\nDate: ${getFormattedDate()}\nTimestamp: ${Date.now().toString()}\nAddress: ${publicKey.toString()}`;
      if (messageToSign) {
        try {
          const encodedMessage = new TextEncoder().encode(messageToSign);
          const signedMessage = await signMessage(encodedMessage);

          if (signedMessage) {
            const result = await apollo.mutate({
              mutation: CONNECT_SOLANA_COMMUNITY_USER_WALLET,
              variables: {
                input: {
                  discordUserId,
                  web3Address: publicKey.toString(),
                  signedMessage: Buffer.from(signedMessage).toString("base64"),
                  blockchain: SupportedChainType.SOLANA,
                  verificationCode,
                  originalMessage: messageToSign,
                },
              },
            });

            if (result.data.connectSolanaCmtyUserWallet) {
              onSuccess();
            } else {
              onFail();
            }
          }
        } catch (error) {
          console.error("Error signing message:", error);
          onFail();
        }
      }
    } else {
      console.error("Solana wallet not connected");
      onFail();
    }
  };

  useEffect(() => {
    if (connected && publicKey && verificationCode) {
      linkUserWithSolanaWallet({
        discordUserId,
        verificationCode,
        onSuccess: () => {
          onConnection ? onConnection() : setConnectionComplete(true);
        },
        onFail: () => setErrorMessage("Error linking Solana wallet, please contact support"),
      });
    }
  }, [connected, publicKey, verificationCode, discordUserId]);

  const handleConnect = async () => {
    if (!wallet) return;
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <WalletMultiButton onClick={handleConnect}>
      {connecting || isConnecting ? "Connecting..." : connected ? "Connected" : "Connect Solana Wallet"}
    </WalletMultiButton>
  );
};

export default ConnectSolanaButton;
