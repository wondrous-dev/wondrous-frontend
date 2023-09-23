import { useLazyQuery, useMutation } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  CONNECT_DISCORD_TO_CMTY_ORG,
  CREATE_CMTY_USER_FROM_REFERRAL,
  MIGRATE_ORG_CMTY_USER_TELEGRAM,
} from "graphql/mutations";
import { GET_ORG_DISCORD_INVITE_LINK } from "graphql/queries";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GRAPHQL_ERRORS } from "utils/constants";

const TelegramConnect = () => {
  const [searchParams] = useSearchParams();
  const cmtyUserId = searchParams?.get("cmtyUserId");
  const orgId = searchParams?.get("orgId");
  const navigate = useNavigate();
  const [migrateOrgCmtyUser, { data: migrateOrgCmtyUserData }] = useMutation(MIGRATE_ORG_CMTY_USER_TELEGRAM);
  const [errorText, setErrorText] = useState("");
  let tg = (window as any).Telegram.WebApp;
  useEffect(() => {
    // Define the onTelegramAuth function on the global scope
    (window as any).onTelegramAuth = (user) => {
      if (user?.id && user?.username) {
        migrateOrgCmtyUser({
          variables: {
            cmtyUserId: cmtyUserId,
            orgId: orgId,
            telegramId: user.id.toString(),
            telegramUsername: user.username,
          },
        });
      }
    };
    // Create and append the script tag
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "wonderverse_andros_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-auth-url", "https://1217-68-173-56-96.ngrok-free.app/telegram/connect");
    script.setAttribute("data-request-access", "write");
    document.body.appendChild(script);
    // Cleanup: remove script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  tg.expand();
  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid flex="2" display="flex" justifyContent="center" alignItems="center" gap="8px" flexDirection="column">
        {migrateOrgCmtyUserData?.migratOrgCmtyUserTelegram?.success && (
          <>
            <Typography
              marginTop="-10%"
              fontFamily="Poppins"
              fontWeight={600}
              fontSize="18px"
              lineHeight="24px"
              color="black"
            >
              Telegram connected! Please return to the quest channel
            </Typography>
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

export default TelegramConnect;
