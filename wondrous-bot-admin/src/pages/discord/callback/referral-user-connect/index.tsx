import { useLazyQuery, useMutation } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { CONNECT_DISCORD_TO_CMTY_ORG, CREATE_CMTY_USER_FROM_REFERRAL } from "graphql/mutations";
import { GET_ORG_DISCORD_INVITE_LINK } from "graphql/queries";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GRAPHQL_ERRORS } from "utils/constants";

let createCmtyUserBool = false;
const DiscordCallbackReferralUserConnect = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams?.get("code");
  const state = searchParams?.get("state");
  const { referralCode } = JSON.parse(state || "{}");
  const navigate = useNavigate();

  const [errorText, setErrorText] = useState("");
  const [getOrgDiscordInviteLink, { data: orgDiscordInviteLinkData }] = useLazyQuery(GET_ORG_DISCORD_INVITE_LINK);
  const [createCmtyUserFromReferral, { data }] = useMutation(CREATE_CMTY_USER_FROM_REFERRAL);
  useEffect(() => {
    if (code && referralCode && !createCmtyUserBool) {
      createCmtyUserFromReferral({
        variables: {
          code,
          referralCode,
        },
      })
        .then((res) => {
          if (res?.data?.createCmtyUserFromReferral) {
            const orgId = res?.data?.createCmtyUserFromReferral?.orgId;
            if (orgId) {
              getOrgDiscordInviteLink({
                variables: {
                  orgId,
                },
              });
            }
          }
        })
        .catch((err) => {
          if (err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.CMTY_USER_ALREADY_REFERRED) {
            setErrorText("You have already been referred!");
          }
        });
      createCmtyUserBool = true;
    }
  }, [code, referralCode, createCmtyUserBool, getOrgDiscordInviteLink]);
  const link = orgDiscordInviteLinkData?.getOrgDiscordInviteLink?.link;
  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid flex="2" display="flex" justifyContent="center" alignItems="center" gap="8px" flexDirection="column">
        {link && !errorText && (
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
            Thanks for connecting your account! To redeem rewards for your and your referrer, join the{" "}
            <a style={{ fontWeight: "bold", cursor: "pointer" }} href={link}>
              {" "}
              Discord server
            </a>
            {", "}
            then type "/quests" to start taking on quests!
          </Typography>
        )}
        {!link && !errorText && (
          <>
            <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
              Connecting your Discord. If this is taking too long please try again!
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

export default DiscordCallbackReferralUserConnect;
