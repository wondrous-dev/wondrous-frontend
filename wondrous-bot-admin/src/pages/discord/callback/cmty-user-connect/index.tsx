import { useMutation, useQuery } from "@apollo/client";
import { Grid, Typography } from "@mui/material";
import PageSpinner from "components/PageSpinner";
import PageWrapper from "components/Shared/PageWrapper";
import Spinner from "components/Shared/Spinner";
import { GraphQLErrorExtensions } from "graphql";
import { CONNECT_CMTY_USER } from "graphql/mutations";
import { GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL } from "graphql/queries";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BG_TYPES, ERRORS_LABELS } from "utils/constants";
import useAlerts from "utils/hooks";

const DiscordCallbackCmtyUserConnect = () => {
  const [searchParams] = useSearchParams();
  const [finishedVerification, setFinishedVerification] = useState(false);
  const code = searchParams?.get("code");
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const state = searchParams?.get("state");
  const { questId, orgId, referralCode, referralCampaignExternalId } = JSON.parse(state || "{}");
  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL, {
    variables: {
      orgId,
    },
    skip: !orgId,
  });

  const handleError = (message) => {
    let guildInfo = orgDiscordConfig?.getCmtyOrgDiscordConfig?.guildInfo;

    let label = typeof message === "string" ? ERRORS_LABELS[message] : null;

    if (message === "discord_user_not_in_guild") {
      if (referralCode && referralCampaignExternalId) {
        setSnackbarAlertMessage(
          "You must join the discord server first. Return to the referral page and proceed to join the discord server."
        );
        return setSnackbarAlertOpen(true);
      }
      let guildName = guildInfo?.guildName || "the guild";
      label = label.replace("{guildName}", guildName);
    }
    setSnackbarAlertMessage(label || "Something went wrong, please try again later");
    setSnackbarAlertOpen(true);
    if (questId) {
      setSnackbarAlertMessage(
        "You must join the discord server first. Return to the quest page and proceed to join the discord server."
      );
      return setSnackbarAlertOpen(true);
    }
  };

  const navigate = useNavigate();
  const [connectCmtyUser, { loading }] = useMutation(CONNECT_CMTY_USER, {
    onCompleted: ({ connectCmtyUser }) => {
      setFinishedVerification(true);
      if (connectCmtyUser?.token) {
        localStorage.setItem("cmtyUserToken", connectCmtyUser?.token);
        if (referralCode && referralCampaignExternalId) {
          setSnackbarAlertMessage("You can now close this window and return to the referral page.");
          return setSnackbarAlertOpen(true);
        }
        setSnackbarAlertMessage("You can now close this window and return to the quest page.");
        return setSnackbarAlertOpen(true);
      }
    },
    onError: (err) => {
      setFinishedVerification(true);
      // const message = err?.graphQLErrors[0]?.extensions?.message;
      // return handleError(message);
    },
  });

  useEffect(() => {
    if (code && !loading && (questId || referralCode)) {
      connectCmtyUser({
        variables: {
          code,
          questId,
          referralCampaignExternalId,
        },
      });
    }
  }, [code, loading, questId, referralCampaignExternalId]);
  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
    <Grid flex="2" display="flex" justifyContent="center" alignItems="center" gap="8px" flexDirection="column">
      {finishedVerification && (
        <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
          Finished connecting your Discord! You can close this window now and return to previous tab.
        </Typography>
      )}
      {!finishedVerification && <Spinner />}
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

export default DiscordCallbackCmtyUserConnect;
