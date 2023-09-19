import { useMutation } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { CONNECT_DISCORD_TO_CMTY_ORG } from "graphql/mutations";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams?.get("code");
  const orgId = searchParams?.get("state");
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
      if (err?.graphQLErrors && err?.graphQLErrors[0]?.extensions.message === "guild_already_exist") {
        setErrorText(
          "This discord server is already connected to another account! Please disconnect it from that account first."
        );
      } else {
        setErrorText("Error connecting discord - please try again");
      }
    },
  });
  useEffect(() => {
    if (code && guildId && orgId) {
      connectDiscordToCmtyOrg({
        variables: {
          code,
          guildId,
          orgId,
        },
      });
    }
  }, [code, guildId, orgId]);

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
