import { useLazyQuery, useMutation } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { CONNECT_DISCORD_TO_CMTY_ORG, CREATE_CMTY_USER_FROM_REFERRAL } from "graphql/mutations";
import { GET_ORG_DISCORD_INVITE_LINK } from "graphql/queries";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DiscordCallbackReferralUserConnect = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams?.get("code");
  const state = searchParams?.get("state");
  const { referralCode } = JSON.parse(state || "{}");
  const navigate = useNavigate();

  const [finishedVerification, setFinishedVerification] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [createCmtyUserFromReferral, { data: orgCmtyUserData }] = useMutation(CREATE_CMTY_USER_FROM_REFERRAL, {
    onCompleted: (data) => {
      if (data?.createCmtyUserFromReferral?.success) {
        setFinishedVerification(true);
      }
    },
    onError: (e) => {
      console.error("error connecting discord", e);
      setErrorText("Error connecting discord - please try again");
    },
  });
  const [getOrgDiscordInviteLink, { data: orgDiscordInviteLinkData }] = useLazyQuery(GET_ORG_DISCORD_INVITE_LINK);
  useEffect(() => {
    if (code && referralCode) {
      createCmtyUserFromReferral({
        variables: {
          code,
          referralCode,
        },
      });
    }
  }, [code, code, referralCode]);

  const orgId = orgCmtyUserData?.createCmtyUserFromReferral?.orgId;
  useEffect(() => {
    if (orgId) {
      getOrgDiscordInviteLink({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId]);
  const link = orgDiscordInviteLinkData?.getOrgDiscordInviteLink?.link;
  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid flex="2" display="flex" justifyContent="center" alignItems="center" gap="8px" flexDirection="column">
        {finishedVerification && (
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
            Thanks for connecting your account! To redeem rewards for your and your referrer, join{" "}
            <a href={link}> Discord </a> to start taking on quests!
          </Typography>
        )}
        {!finishedVerification && (
          <>
            <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
              Connecting your Discord. If this is taking too long please try again!
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

export default DiscordCallbackReferralUserConnect;
