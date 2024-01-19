import { useMutation } from "@apollo/client";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { SignupAuthLayout } from "components/Shared/AuthLayout";
import { SharedSecondaryButton } from "components/Shared/styles";
import { CREATE_CMTY_ORG } from "graphql/mutations";
import { useCallback, useContext, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlobalContext from "utils/context/GlobalContext";
import MetaPixel from "components/MetaPixel";
import GoogleTag from "components/GoogleTag";
import Modal from "components/Shared/Modal";
import { getBaseUrl } from "utils/common";
import useAlerts from "utils/hooks";

const DiscordClientID = import.meta.env.VITE_DISCORD_CLIENT_ID;

const OnboardingComponent = () => {
  const { setActiveOrg } = useContext(GlobalContext);

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

  const navigate = useNavigate();
  const callbackURL = () => encodeURIComponent(`${getBaseUrl()}/discord/callback/org-connect`);

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const [createGuildOrg, { loading: createOrgLoading }] = useMutation(CREATE_CMTY_ORG, {
    notifyOnNetworkStatusChange: true,
    refetchQueries: ["getLoggedInUserFullAccessOrgs"],
    onCompleted: (data) => {
      setActiveOrg(data?.createOrg);
      navigate("/onboarding/plan-select");
    },
  });

  const discordWindowRef = useRef(null);
  const isConnectingRef = useRef(false);

  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useAlerts();

  const receiveMessage = useCallback(
    (event) => {
      if (!event.data) return;
      const targetOrigin = window.location.origin;
      if (event.origin !== targetOrigin) return;
      let message = event.data;
      try {
        const data = JSON.parse(message);
        if (data.type === "discordCallback") {
          discordWindowRef.current?.close();
          discordWindowRef.current = null;
        }
        if (
          data.type !== "discordCallback" ||
          createOrgLoading ||
          isConnectingRef.current ||
          !data.code ||
          !data.guildId
        ) {
          return;
        }

        isConnectingRef.current = true;

        createGuildOrg({
          variables: {
            code: data.code,
            guildId: data.guildId,
          },
        }).catch((err) => {
          const extensionMessage = err?.graphQLErrors?.[0]?.extensions?.message;
          setSnackbarAlertMessage(errorToText(extensionMessage));
          setSnackbarAlertOpen(true);
          return;
        });
      } catch (error) {}
    },
    [createOrgLoading, createGuildOrg]
  );

  const handleDiscordConnect = () => {
    const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${DiscordClientID}&permissions=8&scope=bot&response_type=code&state=${encodeURIComponent(
      JSON.stringify({ create_org: true })
    )}&redirect_uri=${callbackURL()}`;

    const width = screen.width * 0.25;
    const height = screen.height;

    isConnectingRef.current = false;
    const left = 0;
    const top = 0;
    const features = "width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;

    const openMethod = isMobile ? "_blank" : "NewWindow";
    discordWindowRef.current = window.open(oauthUrl, openMethod, isMobile ? "" : features);

    discordWindowRef.current?.focus();

    window.addEventListener("message", receiveMessage, false);

    discordWindowRef.current.onbeforeunload = () => {
      window.removeEventListener("message", receiveMessage);
    };
  };

  return (
    <SignupAuthLayout>
      <MetaPixel />
      <GoogleTag />

      <Modal noHeader open {...(isMobile ? {} : { maxWidth: 600 })}>
        <Box display="flex" flexDirection="column" gap="42px">
          <Box display="flex" gap="18px" flexDirection="column" justifyContent="center" alignItems="center">
            <Typography fontSize="32px" color="#2A8D5C" fontWeight={600} textAlign="center">
              Connect your Community
            </Typography>
            <Typography color="#363636" textAlign="center" fontSize="15px" lineHeight="24px" fontWeight={500}>
              The party doesn't start until you add Wonderverse to your server!
              <br />
              1,000+ premium communities trust our bot to help them grow.
            </Typography>
            <img
              src="/connect-discord-bot.png"
              style={{
                height: "160px",
                width: "auto",
                objectFit: "cover",
              }}
            />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <SharedSecondaryButton onClick={handleDiscordConnect}>Add to Discord</SharedSecondaryButton>
          </Box>
        </Box>
      </Modal>
    </SignupAuthLayout>
  );
};

export default OnboardingComponent;
