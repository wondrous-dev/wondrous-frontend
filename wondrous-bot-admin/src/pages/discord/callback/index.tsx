import { useMutation } from "@apollo/client";
import { Grid, Typography } from "@mui/material";
import React, { useEffect, useCallback } from "react";
import { storeAuthHeader } from "components/Auth";
import { CONNECT_USER_DISCORD, USER_DISOCRD_SIGNUP_LOGIN } from "graphql/mutations";
import { DISCORD_CONNECT_TYPES, GRAPHQL_ERRORS } from "utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import PageSpinner from "components/PageSpinner";
import { handleUserOnboardingRedirect } from "utils/common";
import PageWrapper from "components/Shared/PageWrapper";
import { BG_TYPES } from "utils/constants";

function DiscordCallback() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const navigate = useNavigate();
  const [connectUserDiscord] = useMutation(CONNECT_USER_DISCORD);
  const [discordSignupLogin, { data, loading }] = useMutation(USER_DISOCRD_SIGNUP_LOGIN);

  const parsedState = state ? JSON.parse(state) : {};
  const returnToPage = useCallback(() => {
    navigate(`/login?discordConnectError=true&${new URLSearchParams(parsedState)?.toString()}`);
  }, [state, navigate]);

  useEffect(() => {
    if (code && state && !data?.discordSignupLogin && !loading) {
      const parsedState = JSON.parse(state);
      if (parsedState.callbackType === DISCORD_CONNECT_TYPES.questPreview) {
        connectUserDiscord({
          variables: {
            discordAuthCode: code,
            communities: true,
          },
        })
          .then((result) => {
            if (parsedState.callbackType === DISCORD_CONNECT_TYPES.questPreview) {
              // Only place to change this is in settings
              window.location.href = `/quests/${parsedState?.questId}`;
            }
          })
          .catch((err) => {
            console.log("Error updating discord", err?.graphQLErrors[0]?.extensions.errorCode);
            const alreadyExists =
              err?.graphQLErrors &&
              err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.DISCORD_USER_ALREADY_EXISTS;

            if (parsedState.callbackType === DISCORD_CONNECT_TYPES.questPreview) {
              // Only place to change this is in settings
              if (alreadyExists) {
                window.location.href = `/quests/${parsedState?.questId}?discordUserExists=true`;
              } else {
                window.location.href = `/quests/${parsedState?.questId}?discordError=true`;
              }
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
            let inviteToken = parsedState?.token;
            const discordUser = response?.user;
            await storeAuthHeader(token, discordUser);
            if (parsedState.callbackType === DISCORD_CONNECT_TYPES.login) {
              return handleUserOnboardingRedirect(
                null,
                navigate,
                {
                  token: inviteToken,
                },
                "/"
              );
            }
            if (parsedState.callbackType === DISCORD_CONNECT_TYPES.signup) {
              return handleUserOnboardingRedirect(
                null,
                navigate,
                {
                  token: inviteToken,
                },
                "/onboarding/welcome"
              );
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
    <PageWrapper
      bgType={BG_TYPES.DEFAULT}
      containerProps={{
        minHeight: "100vh",
        flexDirection: "column",
        gap: "42px",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px",
        },
      }}
    >
      <Grid
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Typography fontFamily="Poppins" fontWeight="600" fontSize="50px" color="white">
          Connecting Discord
        </Typography>
        <PageSpinner />
      </Grid>
    </PageWrapper>
  );
}

export default DiscordCallback;
