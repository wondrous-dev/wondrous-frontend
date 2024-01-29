import { useMutation } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { VERIFY_COMMUNITY_USER_TWITTER } from "graphql/mutations";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams?.get("code");
  const state = searchParams?.get("state");
  let discordId = state?.split("discordId=")[1] || "";
  const telegramUserId = state?.split("telegramUserId=")[1] || "";
  const migrateOrgId = state?.split("migrateOrgId=")[1] || "";
  if (migrateOrgId) {
    discordId = discordId?.split(" ")[0] || "";
  }
  const [finishedVerification, setFinishedVerification] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [verifyTwitter] = useMutation(VERIFY_COMMUNITY_USER_TWITTER, {
    onCompleted: (data) => {
      if (data?.verifyCommunityUserTwitter?.success) {
        setFinishedVerification(true);
      }
    },
    onError: (e) => {
      const isAlreadyConnected = e?.graphQLErrors?.[0]?.extensions?.errorCode === "twitter_already_connected";
      if (isAlreadyConnected) {
        setErrorText("This Twitter account is already connected to another account!");
        setFinishedVerification(true);
        return;
      }
      console.error("error verifying twitter", e);
    },
  });

  useEffect(() => {
    if (code && !finishedVerification && (discordId || telegramUserId || migrateOrgId)) {
      verifyTwitter({
        variables: {
          code,
          ...(discordId && { discordId }),
          ...(telegramUserId && { telegramUserId }),
          ...(migrateOrgId && { migrateOrgId }),
        },
      });
    }
  }, []);

  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid flex="2" display="flex" justifyContent="center" alignItems="center" gap="8px" flexDirection="column">
        {finishedVerification && (
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
            {errorText ||
              "Finished connecting your Twitter account! You can close this window now and return to Discord."}
          </Typography>
        )}
        {!finishedVerification && (
          <>
            <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
              Connecting your Twitter account. If this is taking too long please try again!
            </Typography>
            <CircularProgress />
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

export default CallbackPage;
