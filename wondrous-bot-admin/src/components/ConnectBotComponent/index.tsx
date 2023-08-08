import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import { getDiscordBotOauthURL } from "components/ConnectDiscord/ConnectDiscordButton";
import { GreenBgDiscord } from "components/Icons/Discord";
import { TelegramGreenBg } from "components/Icons/Telegram";
import { NotificationWrapper } from "components/Settings/NotificationSettings/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useContext, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { AddBotLink, SharedLabel, StatusPill } from "./styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ExternalLinkIcon } from "components/Icons/ExternalLink";
import { CustomTextField } from "components/AddFormEntity/components/styles";

const useTelegramModal = () => {
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const toggleTelegramModal = () => setIsTelegramModalOpen((prev) => !prev);
  const [groupId, setGroupId] = useState("");
  const [error, setError] = useState('');

  const handleSubmit = () => {
    console.log('SUBMIT')
  };

  const TgComponent = () => {
    const handleChange = (e) => setGroupId(e.target.value);

    const config = [
      {
        label: "Link WonderBot",
        component: () => (
          <AddBotLink>
            Add Bot
            <ExternalLinkIcon />
          </AddBotLink>
        ),
      },
      {
        label: "Group ID",
        component: () => <CustomTextField onChange={handleChange} />,
      },
    ];
    if (!isTelegramModalOpen) return null;
    return (
      <Grid display="flex" flexDirection="column" gap="24px" padding="18px" borderTop="1px solid #B0BEC5" width="100%">
        <Grid display="flex" alignItems="center" gap="24px">
          {config.map((item, idx) => {
            return (
              <Box display="flex" flexDirection="column" gap="14px" width="100%">
                <Typography
                  color={"#4D4D4D"}
                  fontFamily={"Poppins"}
                  fontSize={"13px"}
                  fontStyle={"normal"}
                  fontWeight={"600"}
                  lineHeight={"15px"}
                  letterSpacing={"0.13px"}
                >
                  {`${idx + 1}. ${item.label}`}
                </Typography>
                {item.component()}
              </Box>
            );
          })}
        </Grid>
        <Box>
        <SharedSecondaryButton disabled={!groupId} onClick={handleSubmit}>Connect</SharedSecondaryButton>
        </Box>
      </Grid>
    );
  };

  const ConnectButton = () => {
    if (isTelegramModalOpen) {
      return (
        <ButtonBase onClick={toggleTelegramModal}>
          <Typography fontSize="15px" fontWeight="700" lineHeight="18px" fontFamily="Poppins" color="#6D6D6D">
            Cancel
          </Typography>
        </ButtonBase>
      );
    }
    return <SharedSecondaryButton onClick={toggleTelegramModal}>Connect</SharedSecondaryButton>;
  };
  return {
    TgComponent,
    ConnectButton,
  };
};

const ConnectBotComponent = () => {
  const { activeOrg } = useContext(GlobalContext);
  const oauthUrl = getDiscordBotOauthURL({ orgId: activeOrg?.id });
  const { TgComponent, ConnectButton } = useTelegramModal();
  const handleDiscordClick = async () => {
    window.location.href = oauthUrl;
  };

  const CARDS_CONFIG = [
    {
      title: "Discord",
      icon: GreenBgDiscord,
      onClick: handleDiscordClick,
      isConnected: !!activeOrg?.cmtyDiscordConfig,
    },
    {
      title: "Telegram",
      icon: TelegramGreenBg,
      component: TgComponent,
      customButton: ConnectButton,
    },
  ];

  return (
    <Grid
      flex="1"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      gap="32px"
      width={{
        xs: "100%",
        sm: "70%",
      }}
    >
      <SharedLabel>You can connect your bot to either or both platforms below.</SharedLabel>
      <Grid gap="14px" display="flex" flexDirection="column" width="100%">
        {CARDS_CONFIG.map((card) => (
          <NotificationWrapper>
            <Grid padding="18px" display="flex" justifyContent="flex-start" alignItems="center" gap="14px" width="100%">
              <card.icon />
              <SharedLabel>{card.title}</SharedLabel>
              <Box flex="1" display="flex" justifyContent="flex-end">
                {card.customButton ? (
                  card.customButton()
                ) : (
                  <>
                    {card.isConnected ? (
                      <StatusPill disabled>Connected</StatusPill>
                    ) : (
                      <SharedSecondaryButton onClick={card.onClick}>Connect</SharedSecondaryButton>
                    )}
                  </>
                )}
              </Box>
            </Grid>
            {card.component && <>{card.component()}</>}
          </NotificationWrapper>
        ))}
      </Grid>
    </Grid>
  );
};

export default ConnectBotComponent;
