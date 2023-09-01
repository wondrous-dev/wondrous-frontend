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
  const discordId = state?.split("discordId=")[1] || "";
  const telegramUserId = state?.split("telegramUserId=")[1] || "";

  const [finishedVerification, setFinishedVerification] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [verifyTwitter] = useMutation(VERIFY_COMMUNITY_USER_TWITTER, {
    onCompleted: (data) => {
      if (data?.verifyCommunityUserTwitter?.success) {
        setFinishedVerification(true);
      }
    },
    onError: (e) => {
      console.error("error verifying twitter", e);
      setErrorText("Error verifying twitter - please try again");
    },
  });
  useEffect(() => {
    if (code && !finishedVerification && (discordId || telegramUserId)) {
      verifyTwitter({
        variables: {
          code,
          discordId,
          telegramUserId: telegramUserId?.toString(),
        },
      });
    }
  }, []);

  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid flex="2" display="flex" justifyContent="center" alignItems="center" gap="8px" flexDirection="column">
        {finishedVerification && (
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
            Finished connecting your Twitter account! You can close this window now and return to Discord.
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
