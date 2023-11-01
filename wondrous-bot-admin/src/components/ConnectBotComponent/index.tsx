import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import { getDiscordBotOauthURL } from "components/ConnectDiscord/ConnectDiscordButton";
import { TelegramConnectIcon } from "components/Icons/Telegram";
import { NotificationWrapper } from "components/Settings/NotificationSettings/styles";
import { ErrorText, SharedSecondaryButton } from "components/Shared/styles";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { AddBotLink, DisconnectButton, SharedLabel } from "./styles";
import { ExternalLinkIcon } from "components/Icons/ExternalLink";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { getTelegramBotLink } from "utils/discord";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import * as yup from "yup";
import { CONNECT_TELEGRAM_BOT, DISCONNECT_DISCORD_TO_CMTY_ORG } from "graphql/mutations";
import { GET_TELEGRAM_CONFIG_FOR_ORG } from "graphql/queries/telegram";
import { DiscordRoleIcon } from "components/Icons/Rewards";
import { GET_CMTY_ORG_DISCORD_CONFIG } from "graphql/queries";
import ErrorField from "components/Shared/ErrorField";

const telegramGroupIdSchema = yup
  .number()
  .integer("ID must be an integer.")
  .negative("ID must be negative.")
  .required("ID is required.");

const validateTelegramGroupId = async (groupId) => {
  try {
    await telegramGroupIdSchema.validate(groupId);
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

const useTelegramModal = () => {
  const { activeOrg } = useContext(GlobalContext);

  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const toggleTelegramModal = () => setIsTelegramModalOpen((prev) => !prev);
  const [groupId, setGroupId] = useState("");
  const [error, setError] = useState("");

  const [getTelegramConfigForOrg, { data }] = useLazyQuery(GET_TELEGRAM_CONFIG_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setGroupId(data?.getTelegramConfigForOrg?.chatId);
      if (data?.getTelegramConfigForOrg?.chatId) {
        setIsTelegramModalOpen(true);
      }
    },
  });

  const [connectTelegram] = useMutation(CONNECT_TELEGRAM_BOT, {
    refetchQueries: ["getTelegramConfigForOrg"],
  });

  useEffect(() => {
    if (!activeOrg?.id) return;

    getTelegramConfigForOrg({
      variables: {
        orgId: activeOrg?.id,
      },
    });
  }, [activeOrg?.id]);

  const handleSubmit = () => {
    validateTelegramGroupId(groupId).then((isValid) => {
      if (isValid) {
        connectTelegram({ variables: { chatId: `${groupId}`, orgId: activeOrg?.id } });
      } else {
        setError("Invalid Group ID");
      }
    });
  };

  const TgComponent = () => {
    const handleChange = (e) => {
      if (error) setError("");
      setGroupId(e.target.value);
    };

    const botLink = getTelegramBotLink();

    const config = [
      {
        label: "Link WonderBot",
        component: () => (
          <a href={`${botLink}`} target="__blank" rel="noreferrer">
            <AddBotLink>
              Add Bot
              <ExternalLinkIcon />
            </AddBotLink>
          </a>
        ),
      },
      {
        label: "Group ID",
        component: () => <CustomTextField onChange={handleChange} value={groupId} />,
      },
    ];

    if (!isTelegramModalOpen && !data?.getTelegramConfigForOrg?.chatId) return null;

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
        <ErrorField errorText={error}/>
        <Box>
          <SharedSecondaryButton disabled={!groupId} onClick={handleSubmit}>
            {data?.getTelegramConfigForOrg?.chatId ? "Update" : "Connect"}
          </SharedSecondaryButton>
        </Box>
      </Grid>
    );
  };

  const handleDisconnect = () => {
    connectTelegram({ variables: { chatId: null, orgId: activeOrg?.id } });
    setGroupId("");
    setIsTelegramModalOpen(false);
  };
  const ConnectButton = () => {
    if (data?.getTelegramConfigForOrg?.chatId) {
      return <DisconnectButton onClick={handleDisconnect}>Disconnect</DisconnectButton>;
    }
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
    isConnected: data?.getTelegramConfigForOrg?.chatId,
  };
};

const ConnectBotComponent = ({ cardBgColor = "white" }) => {
  const { activeOrg } = useContext(GlobalContext);
  const oauthUrl = getDiscordBotOauthURL({ orgId: activeOrg?.id });
  const { TgComponent, isConnected: isTelegramConnected, ConnectButton } = useTelegramModal();
  const handleDiscordClick = async () => {
    window.location.href = oauthUrl;
  };

  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
    fetchPolicy: "cache-and-network",
  });

  const [disconnectCmtyOrgDiscord] = useMutation(DISCONNECT_DISCORD_TO_CMTY_ORG, {
    refetchQueries: ["getCmtyOrgDiscordConfig"],
  });

  const CARDS_CONFIG = [
    {
      title: "Discord",
      icon: DiscordRoleIcon,
      onClick: handleDiscordClick,
      isConnected: !!orgDiscordConfig?.getCmtyOrgDiscordConfig?.guildId && getDiscordConfigError?.graphQLErrors[0]?.extensions?.code !== 404,
      onDisconnect: () => {
        disconnectCmtyOrgDiscord({
          variables: {
            orgId: activeOrg?.id,
          },
        });
      },
    },
    {
      title: "Telegram",
      icon: TelegramConnectIcon,
      component: TgComponent,
      customButton: ConnectButton,
      isConnected: isTelegramConnected,
    },
  ];

  return (
    <Grid display="flex" flexDirection="column" width="100%">
      {CARDS_CONFIG.map((card) => (
        <NotificationWrapper bgColor={cardBgColor}>
          <Grid padding="18px" display="flex" justifyContent="flex-start" alignItems="center" gap="14px" width="100%">
            <Box
              borderRadius="6px"
              bgcolor="#F8AFDB"
              height="42px"
              width="42px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <card.icon />
            </Box>
            <SharedLabel>{card.title}</SharedLabel>
            {card.isConnected ? <SharedLabel color="#2A8D5C">Connected</SharedLabel> : null}
            <Box flex="1" display="flex" justifyContent="flex-end">
              {card.customButton ? (
                card.customButton()
              ) : (
                <>
                  {card.isConnected ? (
                    <DisconnectButton onClick={card.onDisconnect}>Disconnect</DisconnectButton>
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
  );
};

export default ConnectBotComponent;
