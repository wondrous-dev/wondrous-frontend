import { useMutation } from "@apollo/client";
import { Grid, Typography } from "@mui/material";
import React, { useEffect, useCallback } from "react";
import { storeAuthHeader } from "components/Auth";
import { CONNECT_USER_DISCORD, USER_DISOCRD_SIGNUP_LOGIN } from "graphql/mutations";
import { DISCORD_CONNECT_TYPES, GRAPHQL_ERRORS } from "utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import PageSpinner from "components/PageSpinner";

function DiscordCallback() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const navigate = useNavigate();
  const [connectUserDiscord] = useMutation(CONNECT_USER_DISCORD);
  const [discordSignupLogin, { data, loading }] = useMutation(USER_DISOCRD_SIGNUP_LOGIN);

  const parsedState = state ? JSON.parse(state) : null;

  const returnToPage = useCallback(() => {
    navigate(
      `/login?discordConnectError=true${parsedState?.collabInvite ? `&collabInvite=${parsedState?.collabInvite}` : ""}`
    );
  }, [state, navigate]);

  useEffect(() => {
    if (code && state && !data?.discordSignupLogin && !loading) {
      const parsedState = JSON.parse(state);
      if (
        parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboarding ||
        parsedState.callbackType === DISCORD_CONNECT_TYPES.loginMethod ||
        parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboardingDao ||
        parsedState.callbackType === DISCORD_CONNECT_TYPES.connectSettings
      ) {
        connectUserDiscord({
          variables: {
            discordAuthCode: code,
            communities: true,
          },
        })
          .then((result) => {
            if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectSettings) {
              // Only place to change this is in settings
              window.location.href = `/profile/settings`;
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.loginMethod) {
              window.location.href = `/profile/login-methods`;
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboarding) {
              navigate(
                `/onboarding/discord?success${
                  parsedState?.collabInvite ? `&collabInvite=${parsedState?.collabInvite}` : ""
                }`
              );
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboardingDao) {
              navigate("/");
            }
          })
          .catch((err) => {
            console.log("Error updating discord", err?.graphQLErrors[0]?.extensions.errorCode);
            const alreadyExists =
              err?.graphQLErrors &&
              err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.DISCORD_USER_ALREADY_EXISTS;

            if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectSettings) {
              // Only place to change this is in settings
              if (alreadyExists) {
                window.location.href = `/profile/settings?discordUserExists=true`;
              } else {
                window.location.href = `/profile/settings?discordError=true`;
              }
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.loginMethod) {
              // Only place to change this is in settings
              if (alreadyExists) {
                window.location.href = `/profile/login-methods?discordUserExists=true`;
              } else {
                window.location.href = `/profile/login-methods?discordError=true`;
              }
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboarding) {
              navigate("/");
            } else if (parsedState.callbackType === DISCORD_CONNECT_TYPES.connectOnboardingDao) {
              navigate("/");
            }
          });
      } else if (
        parsedState.callbackType === DISCORD_CONNECT_TYPES.signup ||
        parsedState.callbackType === DISCORD_CONNECT_TYPES.login
      ) {
        // Sign them up or log them in
        discordSignupLogin({
          variables: {
            discordAuthCode: code,
            communities: true,
          },
        })
          .then(async (result) => {
            const response = result?.data?.discordSignupLogin;
            const token = response?.token;
            const discordUser = response?.user;
            await storeAuthHeader(token, discordUser);
            if (parsedState.callbackType === DISCORD_CONNECT_TYPES.login) {
              return navigate("/");
            }
          })
          .catch((err) => {
            console.log("Error signing in discord user", err);
            returnToPage();
          });
      }
    }
  }, [data?.discordSignupLogin, loading]);
  return (
    <Grid
      width="100%"
      height="100%"
      minWidth="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="24px"
    >
      <Typography fontFamily="Poppins" fontWeight="700" fontSize="62px" color="black">
        Connecting Discord
      </Typography>
      <PageSpinner />
    </Grid>
  );
}

export default DiscordCallback;
