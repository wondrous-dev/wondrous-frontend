import { useQuery } from "@apollo/client";
import { Box, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import ConnectDiscordButton from "components/ConnectDiscord/ConnectDiscordButton";
import { GET_CMTY_ORG_DISCORD_CONFIG, GET_ORG_QUEST_STATS } from "graphql/queries";
import { useContext, useEffect, useMemo, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SharedSecondaryButton } from "components/Shared/styles";
import StarIcon from "components/Icons/StarIcon";
import { AddBotModal } from "pages/onboarding/discord/addBotModal";
import { ConfigureNotificationsOnboardingModal } from "./onboarding/discord/configureNotificationsModal";
import { useSubscription, useSubscriptionPaywall } from "utils/hooks";
import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";
import { GET_TELEGRAM_CONFIG_FOR_ORG } from "graphql/queries/telegram";
import { getPlan } from "utils/common";
import GoogleTag from "components/GoogleTag";
import HomeTutorial from "components/TutorialComponent/Tutorials/HomeTutorial";
import { TourDataContext } from "utils/context";
import PostHeaderGoogleTag from "components/GoogleTag/PostHeaderGoogleTag";
import PostBodyGoogleTag from "components/GoogleTag/PostBodyGoogleTag";

const typographyStyles = {
  fontFamily: "Poppins",
  fontWeight: 700,
  fontSize: "62px",
  color: "black",
};

export const HomeCardWrapper = styled(Grid)`
  && {
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    overflow: hidden;
    &:hover {
      img {
        transition: all 0.2s ease-in-out;
        transform: scale(1.1);
      }
    }
  }
`;
const CardsComponent = ({ cards }) => {
  const navigate = useNavigate();

  return (
    <Grid
      container
      gap="24px"
      justifyContent="center"
      alignItems="center"
      padding={{
        xs: "14px",
        md: "42px 84px",
        lg: "42px",
      }}
      direction={{
        xs: "column",
        lg: "row",
      }}
    >
      {cards.map((card, idx) => (
        <HomeCardWrapper
          bgcolor={card.bgColor}
          display="flex"
          key={`card-${idx}`}
          border="2px solid #000212"
          borderRadius="16px"
          flexDirection="column"
          justifyContent="center"
          flex="1"
          width="100%"
          paddingBottom="24px"
          alignItems="center"
          onClick={() => navigate(card.path)}
        >
          <Box overflow="hidden" maxHeight="126px" maxWidth="auto">
            <img
              style={{
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                marginTop: "-1px",
                width: "100%",
                maxHeight: "100%",
                overflow: "hidden",
              }}
              src={card.Icon}
            />
          </Box>
          <Box
            display="flex"
            gap="14px"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            paddingTop="24px"
          >
            <Typography {...typographyStyles} lineHeight="62px">
              {card.count}
            </Typography>
            <Typography {...typographyStyles} letterSpacing="0.08em" fontSize="20px" fontWeight={600}>
              {card.title}
            </Typography>
          </Box>
        </HomeCardWrapper>
      ))}
    </Grid>
  );
};

const HomePage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const subscription = useSubscription();
  const { setPaywall, setPaywallMessage, setCanBeClosed, setOnCancel } = useSubscriptionPaywall();
  const plan = getPlan(subscription?.tier);
  const navigate = useNavigate();
  const [openAddBotModal, setOpenAddBotModal] = useState(false);
  const [openDiscordNotificationModal, setOpenDiscordNotificationModal] = useState(false);
  const { data: telegramConfigData, loading: isTelegramConfigLoading } = useQuery(GET_TELEGRAM_CONFIG_FOR_ORG, {
    variables: {
      orgId: activeOrg?.id,
    },
    notifyOnNetworkStatusChange: true,
    skip: !activeOrg?.id,
  });
  const {
    data: orgDiscordConfig,
    error: getDiscordConfigError,
    loading: isDiscordConfigLoading,
  } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  const additionalData = orgDiscordConfig?.getCmtyOrgDiscordConfig?.additionalData;
  const { data, loading } = useQuery(GET_ORG_QUEST_STATS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  const { totalMembers, totalQuests, totalSubmissions } = data?.getOrgQuestStats || {};

  const CARDS_CONFIG = [
    {
      title: "Members Onboarded",
      count: totalMembers,
      Icon: "/images/home-images/members.png",
      bgColor: "#F8642D",
      path: "/members",
    },
    {
      title: "Quests",
      count: totalQuests,
      Icon: "/images/home-images/quests.png",
      bgColor: "#F8AFDB",
      path: "/quests",
    },
    {
      title: "Levels",
      count: 10,
      Icon: "/images/home-images/levels.png",
      bgColor: "#84BCFF",
      path: "/levels",
    },
  ];

  const handleNavigationToNewQuest = () => {
    if (plan === PricingOptionsTitle.Basic && totalQuests >= 100) {
      setPaywall(true);
      return setPaywallMessage("You have reached the limit of quests for your current plan.");
    } else {
      navigate("/quests/create");
    }
  };

  useEffect(() => {
    if (!loading && orgDiscordConfig?.getCmtyOrgDiscordConfig && !additionalData) {
      setOpenDiscordNotificationModal(true);
    }
    if (
      (getDiscordConfigError?.graphQLErrors[0]?.message && !loading) ||
      !telegramConfigData?.getTelegramConfigForOrg?.chatId
    ) {
      setOpenAddBotModal(true);
    }
  }, [
    additionalData,
    orgDiscordConfig?.getCmtyOrgDiscordConfig,
    loading,
    getDiscordConfigError?.graphQLErrors[0]?.message,
    telegramConfigData?.getTelegramConfigForOrg?.chatId,
  ]);


  const shouldDisplayAddModal = useMemo(() => {
    if (isTelegramConfigLoading || isDiscordConfigLoading || loading) return false;
    const discordConfigExists = orgDiscordConfig?.getCmtyOrgDiscordConfig?.id;
    const telegramConfigExists = telegramConfigData?.getTelegramConfigForOrg?.chatId;
    if (!discordConfigExists && !telegramConfigExists && openAddBotModal) {
      return true;
    }
    return false;
  }, [
    orgDiscordConfig,
    telegramConfigData,
    openAddBotModal,
    isDiscordConfigLoading,
    isTelegramConfigLoading,
    loading,
  ]);

  const handleOnBotModalClose = () => {
    const hasDiscordConnected = !!orgDiscordConfig?.getCmtyOrgDiscordConfig?.id;
    const hasTelegramConnected = !!telegramConfigData?.getTelegramConfigForOrg?.chatId;
    if (hasDiscordConnected || hasTelegramConnected) {
      localStorage.setItem("wndr-show-connectingModal", "true");
    }
    setOpenAddBotModal(false);
  };

  const isTelegramOrDiscordConnected =
    !!orgDiscordConfig?.getCmtyOrgDiscordConfig?.id || !!telegramConfigData?.getTelegramConfigForOrg?.chatId;

  return (
    <>
      {isTelegramOrDiscordConnected ? <HomeTutorial /> : null}
      <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh" gap="24px">
        <GoogleTag />
        <PostHeaderGoogleTag />
        <PostBodyGoogleTag />
        <AddBotModal open={shouldDisplayAddModal} onClose={handleOnBotModalClose} />
        <ConfigureNotificationsOnboardingModal
          open={openDiscordNotificationModal}
          onClose={() => setOpenDiscordNotificationModal(false)}
          orgId={activeOrg?.id}
        />
        <Grid flex="1" display="flex" justifyContent="center" alignItems="center" gap="14px" flexDirection="column">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            border="2px solid #000000"
            borderRadius="100%"
            padding="20px"
            position="relative"
          >
            <Box position="absolute" left="-30%" top="70%">
              <StarIcon />
            </Box>
            <Box position="absolute" right="-30%" top="10%">
              <StarIcon />
            </Box>
            <OrgProfilePicture
              profilePicture={activeOrg?.profilePicture}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "100%",
              }}
            />
          </Box>

          <Typography fontFamily="Poppins" fontWeight={600} fontSize="28px" color="#06040A">
            {activeOrg?.name}
          </Typography>
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px" lineHeight="14px" color="black">
            {loading ? null : `${totalSubmissions} Submissions Received`}
          </Typography>
          <SharedSecondaryButton onClick={handleNavigationToNewQuest}>New Quest</SharedSecondaryButton>
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
        >
          {!isTelegramOrDiscordConnected && !loading && (
            <Grid container justifyContent="center" alignItems="center" marginTop="40px">
              <ConnectDiscordButton orgId={activeOrg?.id} />
            </Grid>
          )}
          {loading && (
            <Grid container justifyContent="center" alignItems="center" position="absolute">
              <CircularProgress
                size={60}
                thickness={5}
                sx={{
                  color: "#2A8D5C",
                  animationDuration: "10000ms",
                }}
              />
            </Grid>
          )}
          {!loading && isTelegramOrDiscordConnected && <CardsComponent cards={CARDS_CONFIG} />}
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;
