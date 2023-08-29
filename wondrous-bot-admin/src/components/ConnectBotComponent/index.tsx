import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import { getDiscordBotOauthURL } from "components/ConnectDiscord/ConnectDiscordButton";
import { ConnectDiscordIcon } from "components/Icons/Discord";
import { TelegramConnectIcon } from "components/Icons/Telegram";
import { NotificationWrapper } from "components/Settings/NotificationSettings/styles";
import { ErrorText, SharedSecondaryButton } from "components/Shared/styles";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { AddBotLink, SharedLabel, StatusPill } from "./styles";
import { ExternalLinkIcon } from "components/Icons/ExternalLink";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { getTelegramBotLink } from "utils/discord";
import { useLazyQuery, useMutation } from "@apollo/client";
import * as yup from "yup";
import { CONNECT_TELEGRAM_BOT } from "graphql/mutations";
import { GET_TELEGRAM_CONFIG_FOR_ORG } from "graphql/queries/telegram";

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
    onCompleted: (data) => {
      if (data?.getTelegramConfigForOrg?.chatId) {
        setGroupId(data?.getTelegramConfigForOrg?.chatId);
      }
    },
  });

  const [connectTelegram] = useMutation(CONNECT_TELEGRAM_BOT, {
    refetchQueries: ["getTelegramConfigForOrg"],
    onCompleted: () => {
      toggleTelegramModal();
    },
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
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Box>
          <SharedSecondaryButton disabled={!groupId} onClick={handleSubmit}>
            Connect
          </SharedSecondaryButton>
        </Box>
      </Grid>
    );
  };

  const ConnectButton = () => {
    if (data?.getTelegramConfigForOrg?.chatId && !isTelegramModalOpen) {
      return <StatusPill onClick={toggleTelegramModal}>Update</StatusPill>;
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
  const { TgComponent, ConnectButton, isConnected: isTelegramConnected } = useTelegramModal();
  const handleDiscordClick = async () => {
    window.location.href = oauthUrl;
  };

  const CARDS_CONFIG = [
    {
      title: "Discord",
      icon: ConnectDiscordIcon,
      onClick: handleDiscordClick,
      isConnected: !!activeOrg?.cmtyDiscordConfig,
      iconProps: {
        fill: !!activeOrg?.cmtyDiscordConfig ? "#AF9EFF" : "#2A8D5C",
      },
    },
    {
      title: "Telegram",
      icon: TelegramConnectIcon,
      iconProps: {
        fill: isTelegramConnected ? "#AF9EFF" : "#2A8D5C",
      },
      component: TgComponent,
      customButton: ConnectButton,
    },
  ];

  return (
    <Grid display="flex" flexDirection="column" width="100%">
      {CARDS_CONFIG.map((card) => (
        <NotificationWrapper bgColor={cardBgColor}>
          <Grid padding="18px" display="flex" justifyContent="flex-start" alignItems="center" gap="14px" width="100%">
            <card.icon {...card.iconProps} />
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
  );
};

export default ConnectBotComponent;