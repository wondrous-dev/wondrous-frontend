import { useMutation } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { CONNECT_DISCORD_TO_CMTY_ORG } from "graphql/mutations";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getBaseUrl } from "utils/common";

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams?.get("code");
  const state = searchParams?.get("state");
  const { isCreateOrg, orgId } = useMemo(() => {
    if (!state) return { isCreateOrg: null, orgId: null };
    try {
      let isCreateOrg = JSON.parse(state)?.create_org;
      return isCreateOrg ? { isCreateOrg, orgId: null } : { isCreateOrg: null, orgId: state };
    } catch (error) {
      return { isCreateOrg: null, orgId: state };
    }
  }, [state]);

  const errorToText = (errorMessage) => {
    switch (errorMessage) {
      case "guild_already_exist":
        return "This discord server is already connected to another account!";
      case "guild_not_found":
        return "This discord server was not found - please try again";
      default:
        return "Error connecting discord - please try again";
    }
  };
  const guildId = searchParams?.get("guild_id");
  const navigate = useNavigate();
  const [finishedVerification, setFinishedVerification] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [connectDiscordToCmtyOrg] = useMutation(CONNECT_DISCORD_TO_CMTY_ORG, {
    onCompleted: (data) => {
      if (data?.connectDiscordToCmtyOrg?.success) {
        setFinishedVerification(true);
      }
      navigate("/");
    },
    refetchQueries: ["getLoggedInUserFullAccessOrgs"],
    onError: (err) => {
      console.error("error connecting discord", err);
      if (err?.graphQLErrors) {
        const errorText = errorToText(err?.graphQLErrors[0]?.extensions.message);
        setErrorText(errorText);
      } else {
        setErrorText("Error connecting discord - please try again");
      }
    },
  });

  useEffect(() => {
    if (code && guildId && orgId && !isCreateOrg) {
      connectDiscordToCmtyOrg({
        variables: {
          code,
          guildId,
          orgId,
        },
      });
    }
  }, [code, guildId, orgId, !isCreateOrg]);

  useEffect(() => {
    if (isCreateOrg && guildId) {
      window.opener.postMessage(JSON.stringify({ type: "discordCallback", code: code, guildId }), getBaseUrl());
    }
  }, []);

  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid flex="2" display="flex" justifyContent="center" alignItems="center" gap="8px" flexDirection="column">
        {finishedVerification && !errorText && (
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
            Finished connecting your Discord! You can close this window now and return to Discord.
          </Typography>
        )}
        {!finishedVerification && !errorText && (
          <>
            <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
              Connecting your Discord server. If this is taking too long please try again!
            </Typography>
            <CircularProgress />
          </>
        )}
        {errorText && (
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
            {errorText}
          </Typography>
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

export default CallbackPage;
