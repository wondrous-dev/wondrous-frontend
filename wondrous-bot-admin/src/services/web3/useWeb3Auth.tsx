import { useEffect, useState } from "react";
import useWonderWeb3Modal from "./useWonderWeb3Modal";
import { getUserSigningMessage, linkCmtyUserWallet, walletSignin, walletSignup } from "components/Auth";
import { handleUserOnboardingRedirect } from "utils/common";
import { GRAPHQL_ERRORS } from "utils/constants";
import { SUPPORTED_CHAIN_IDS, SupportedChainType, signedMessageIsString } from "utils/web3Constants";
import useWonderWeb3 from "./useWonderWeb3";
import { useLocation, useNavigate } from "react-router-dom";

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

const useWeb3Auth = ({ setErrorMessage }) => {
  // since we can't disconnect a user's wallet this is used in order to check if the user actually clicked the login button
  const [isActivating, setIsActivating] = useState(false);
  const { address, chainId, open, disconnect, isConnected, signMessage, closeWeb3Modal } = useWonderWeb3Modal();
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

  const discordConnectError = searchParams.get("discordConnectError");
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const params = {
    discordConnectError,
    token,
    type,
  };

  const navigate = useNavigate();
  const loginWithWallet = async () => {
    setErrorMessage(null);
    if (address && isConnected && !!SUPPORTED_CHAIN_IDS[chainId]) {
      // Retrieve Signed Message
      const messageToSign = await getUserSigningMessage(address, "eth");
      closeWeb3Modal();
      if (messageToSign) {
        const signedMessage = await signMessage(messageToSign);
        if (signedMessageIsString(signedMessage)) {
          // Sign with Wallet
          try {
            const user = await walletSignin(address, signedMessage);
            if (user) {
              handleUserOnboardingRedirect(null, navigate, params, "/");
            }
          } catch (err) {
            setIsActivating(false);
            disconnect();
            if (err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.NO_WEB3_ADDRESS_FOUND) {
              setErrorMessage("Address not found, check you are connected to the correct address");
            } else {
              setErrorMessage(err?.message || err);
            }
          }
        } else if (signedMessage !== undefined) {
          disconnect();
          setIsActivating(false);
          setErrorMessage("You need to sign the message on your wallet");
        }
      } else {
        disconnect();
        setIsActivating(false);
        setErrorMessage("Login failed - try again.");
      }
    }
  };

  const signupWithWallet = async () => {
    setErrorMessage(null);
    if (address && isConnected && !!SUPPORTED_CHAIN_IDS[chainId]) {
      const messageToSignObject = await getUserSigningMessage(address, SupportedChainType.ETH, true);
      const messageToSign = messageToSignObject?.signingMessage;
      const signedMessage = await signMessage(messageToSign);
      const isSignedMessageString = signedMessageIsString(signedMessage);
      if (messageToSignObject?.userExists && isSignedMessageString) {
        const user = await walletSignin(address, signedMessage);
        if (user) {
          closeWeb3Modal();
          return handleUserOnboardingRedirect(null, navigate, params, "/");
        }
      }

      if (messageToSign) {
        if (isSignedMessageString) {
          let user;
          try {
            user = await walletSignup(address, signedMessage, SupportedChainType.ETH);
          } catch (err) {
            if (
              err?.graphQLErrors &&
              err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.WEB3_ADDRESS_ALREADY_EXISTS
            ) {
              try {
                user = await walletSignin(address, signedMessage);
                closeWeb3Modal();
              } catch (err) {
                disconnect();
                setIsActivating(false);
                setErrorMessage("Unable to log in existing user - please contact support in discord");
              }
              // setErrorMessage('Account already exists');
            } else {
              disconnect();
              setIsActivating(false);
              setErrorMessage("Unable to join org - please contact support in discord.");
            }
          }
          if (user) {
            closeWeb3Modal();
            handleUserOnboardingRedirect(null, navigate, params, "/onboarding/welcome");
          }
        } else if (isSignedMessageString === false) {
          setErrorMessage("You need to sign the message on your wallet");
          disconnect();
          setIsActivating(false);
        } else {
          setErrorMessage("There has been an issue, contact with support.");
        }
      } else {
        disconnect();
        setIsActivating(false);
        setErrorMessage("Signup failed - try again.");
      }
    }
  };

  const linkUserWithWallet = async ({ discordUserId, telegramUserId, migrateOrgId, onSuccess, onFail }) => {
    if (address && chainId && isConnected) {
      const messageToSign = `Welcome to wonder\nDate: ${getFormattedDate()}\nTimestamp: ${Date.now().toString()}`;
      if (messageToSign) {
        const signedMessage = await signMessage(messageToSign);
        if (signedMessageIsString(signedMessage)) {
          const result = await linkCmtyUserWallet(
            discordUserId,
            address,
            signedMessage,
            SupportedChainType.ETH,
            messageToSign,
            telegramUserId,
            migrateOrgId
          );
          if (result === true) {
            setIsActivating(false);
            closeWeb3Modal();
            onSuccess();
          }
          if (result === false) {
            onFail();
            setIsActivating(false);
            disconnect();
          }
        } else if (!signedMessageIsString(signedMessage)) {
          setIsActivating(false);
          setErrorMessage("Signature rejected. Try again.");
          disconnect();
        }
      }
    }
  };

  return {
    loginWithWallet,
    signupWithWallet,
    isActivating,
    open: () => {
      open();
      setIsActivating(true);
    },
    address,
    chainId,
    disconnect,
    isConnected,
    linkUserWithWallet,
    closeWeb3Modal
  };
};

export default useWeb3Auth;
