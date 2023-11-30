import { useState } from "react";
import useWonderWeb3Modal from "./useWonderWeb3Modal";
import { getUserSigningMessage, walletSignin, walletSignup } from "components/Auth";
import { handleUserOnboardingRedirect } from "utils/common";
import { GRAPHQL_ERRORS } from "utils/constants";
import { SUPPORTED_CHAIN_IDS, SupportedChainType, signedMessageIsString } from "utils/web3Constants";
import useWonderWeb3 from "./useWonderWeb3";
import { useLocation, useNavigate } from "react-router-dom";

const useWeb3Auth = () => {
  // since we can't disconnect a user's wallet this is used in order to check if the user actually clicked the login button
  const [isActivating, setIsActivating] = useState(false);
  const { address, chainId, open, disconnect, isConnected } = useWonderWeb3Modal();
  const [errorMessage, setErrorMessage] = useState("");
  const { signMessage } = useWonderWeb3();
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
            console.log("err?.graphQLErrors", err?.graphQLErrors);
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
            handleUserOnboardingRedirect(null, navigate, params, "/onboarding/welcome");
          }
        } else if (signedMessage === false) {
          setErrorMessage("Signature rejected. Try again.");
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

  return {
    loginWithWallet,
    signupWithWallet,
    isActivating,
    errorMessage,
    open: () => {
      open();
      setIsActivating(true);
    },
    address,
    chainId,
    disconnect,
    isConnected,
  };
};

export default useWeb3Auth;
