import { useMutation } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { CONNECT_COMMUNITY_USER_GOOGLE } from "graphql/mutations";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getBaseUrl } from "utils/common";

function getGoogleOauthUrl(discordId) {
  const GOOGLE_CLIENT_ID = "276263235787-efsi17itjf4d230126shg69h6r6qagf7.apps.googleusercontent.com";
  const baseUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=code`;
  const redirectUrl = encodeURIComponent(`${getBaseUrl()}/oauth/google/callback`);
  const state = encodeURIComponent(
    JSON.stringify({
      discordId,
    })
  );
  const accessType = "offline";
  const scope = encodeURIComponent(["email", "profile", "https://www.googleapis.com/auth/youtube"].join(" "));
  console.log(scope);
  //'email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl'
  const oauthUrl = `${baseUrl}&redirect_uri=${redirectUrl}&state=${state}&scope=${scope}&access_type=${accessType}`;
  console.log(oauthUrl);
  return oauthUrl;
}

const GoogleOauthCallbackPage = () => {
  // getGoogleOauthUrl("542545105903419404");
  const [searchParams] = useSearchParams();
  const code = searchParams?.get("code");
  const state = searchParams?.get("state");
  const { discordId } = JSON.parse(state || "{}");


  const [finishedVerification, setFinishedVerification] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [connectCommunityUserGoogle] = useMutation(CONNECT_COMMUNITY_USER_GOOGLE, {
    onCompleted: (data) => {
      if (data?.connectCommunityUserGoogle?.success) {
        setFinishedVerification(true);
      }
    },
    onError: (e) => {
      console.error("error connecting google", e);
      setErrorText("Error connecting google - please try again");
    },
  });

  useEffect(() => {
    if (code && discordId && !finishedVerification) {
      setFinishedVerification(true);
        connectCommunityUserGoogle({
        variables: {
          code,
          discordId,
        },
      });
    }
  }, [discordId, code]);
  console.log(code)

  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid flex="2" display="flex" justifyContent="center" alignItems="center" gap="8px" flexDirection="column">
        {finishedVerification && (
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
            Finished connecting your Google account! You can close this window now and return to Discord.
          </Typography>
        )}
        {!finishedVerification && (
          <>
            <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
              Connecting your Google account. If this is taking too long please try again!
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

export default GoogleOauthCallbackPage;
