import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { Grid, Box } from "@mui/material";
import { GET_CMTY_ORG_DISCORD_CONFIG, GET_ORG_ADMINS, GET_ORG_ROLES } from "graphql/queries";
import Modal from "components/Shared/Modal";
import { UPDATE_ORG } from "graphql/mutations";
import { useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import EditSvg from "components/Icons/edit.svg";
import AddIcon from "@mui/icons-material/Add";
import {
  AddChannelText,
  ChannelContainer,
  ChannelContainerText,
  EditImg,
  ModalDescriptionText,
  ModalTitleText,
  NotificationDescription,
  NotificationHalves,
  NotificationPostingToText,
  NotificationSwitchContainer,
  NotificationSwitchInnerDiv,
  NotificationSwitchText,
  NotificationTitle,
  NotificationWrapper,
} from "./styles";
import SelectComponent from "components/Shared/Select";
import { GET_GUILD_DISCORD_CHANNELS } from "graphql/queries/discord";
import TextField from "components/Shared/TextField";
import { ButtonIconWrapper, ErrorText, SharedSecondaryButton } from "components/Shared/styles";
import { UPDATE_ORG_DISCORD_ADDITIONAL_DATA } from "graphql/mutations/discord";
import { camelToSnake, snakeToCamel } from "utils/common";

const CHANNEL_TYPE = {
  STICKY_MESSAGE: "sticky_message_channel",
  WELCOME_MESSAGE: "welcome_message_channel",
  GENERAL_NOTIFICATIONS: "general_notifications_channel",
  SUBMISSION_NOTIFICATIONS: "submission_notifications_channel",
  LEADERBOARD_NOTIFICATIONS: "leaderboard_notifications_channel",
};

const MESSAGE_TYPE = {
  WELCOME_MESSAGE: "welcome_message",
  STICKY_MESSAGE: "sticky_message",
};
const NOTIFICATIONS = [
  {
    title: "Sticky Message",
    description:
      "If a channel remains idle for 10 minutes, the sticky message will appear at the bottom of the channel.",
    channelType: CHANNEL_TYPE.STICKY_MESSAGE,
    editMessageKey: MESSAGE_TYPE.STICKY_MESSAGE,
    defaultMessage: "Earn rewards and reputation by completing quests! Type /quests in any channel to get started",
  },
  {
    title: "Welcome Message",
    description: "This message will be posted whenever a new user joins the Discord.",
    channelType: CHANNEL_TYPE.WELCOME_MESSAGE,
    editMessageKey: MESSAGE_TYPE.WELCOME_MESSAGE,
    defaultMessage: "Welcome to the community @member! Type /onboard-me in any channel to get started",
  },
  {
    title: "General Notifications",
    description: "This channel will be used to post general notifications like new quests and quest reminders",
    channelType: CHANNEL_TYPE.GENERAL_NOTIFICATIONS,
  },
  {
    title: "Submissions Notifications",
    description: "This channel will be used to post notifications when members make submissions to quests",
    channelType: CHANNEL_TYPE.SUBMISSION_NOTIFICATIONS,
  },
  {
    title: "Leaderboard Notifications",
    description: "This channel will be used to post leaderboard daily",
    channelType: CHANNEL_TYPE.LEADERBOARD_NOTIFICATIONS,
  },
];

const NotificationModal = ({
  open,
  onClose,
  editMessageKey,
  channelType,
  channels,
  discordChannel,
  setDiscordChannel,
  message,
  setMessage,
  orgDiscordAdditionalData,
  orgId,
  updateOrgDiscordAdditionalData,
  title,
}) => {
  return (
    <Modal open={open} onClose={onClose} title={`Edit ${title}`} maxWidth={640}>
      <Box marginBottom={"24px"}>
        <ModalTitleText>Channel</ModalTitleText>
        <SelectComponent
          boxStyle={{
            flex: 1,
          }}
          options={channels}
          value={discordChannel}
          onChange={(value) => setDiscordChannel(value)}
        />
      </Box>
      {message && (
        <Box marginBottom={"24px"}>
          <ModalTitleText>Text</ModalTitleText>
          {editMessageKey === MESSAGE_TYPE.WELCOME_MESSAGE && (
            <ModalDescriptionText>Type @member to add username reference</ModalDescriptionText>
          )}
          <TextField
            onChange={setMessage}
            style={{
              width: "100%",
              fontFamily: "Poppins",
            }}
            value={message}
            multiline={true}
            error={null}
          />
        </Box>
      )}
      <Box display="flex" gap="10px" alignItems="center" width="100%" marginTop="32px">
        <SharedSecondaryButton
          sx={{
            flex: 1,
          }}
          $reverse
          onClick={onClose}
        >
          Cancel
        </SharedSecondaryButton>
        <SharedSecondaryButton
          sx={{
            flex: 1,
          }}
          onClick={() => {
            updateOrgDiscordAdditionalData({
              variables: {
                orgId,
                additionalData: {
                  ...orgDiscordAdditionalData,
                  ...(editMessageKey && {
                    [editMessageKey]: message,
                  }),
                  [channelType]: discordChannel,
                },
              },
            }).then(() => {
              onClose();
            });
          }}
        >
          Update
        </SharedSecondaryButton>
      </Box>
    </Modal>
  );
};

const NotificationSetting = (props) => {
  const [errors, setErrors] = useState("");
  const [updateOrgDiscordAdditionalData] = useMutation(UPDATE_ORG_DISCORD_ADDITIONAL_DATA, {
    refetchQueries: [GET_GUILD_DISCORD_CHANNELS, GET_CMTY_ORG_DISCORD_CONFIG],
  });
  const { title, description, orgDiscordAdditionalData, channelType, editMessageKey, channels, defaultMessage, orgId } =
    props;
  const existingMessage = orgDiscordAdditionalData && orgDiscordAdditionalData[snakeToCamel(editMessageKey)];
  const existingDiscordChannel = orgDiscordAdditionalData && orgDiscordAdditionalData[snakeToCamel(channelType)];
  const existingToggleActive =
    orgDiscordAdditionalData && orgDiscordAdditionalData[`${snakeToCamel(channelType)}Active`];
  const [message, setMessage] = useState("");
  const [discordChannel, setDiscordChannel] = useState(existingDiscordChannel);
  const [active, setActive] = useState(existingToggleActive);
  const [openModal, setOpenModal] = useState(false);
  const discordChannelName = channels?.find((existingChannel) => existingChannel.value === discordChannel)?.label;
  useEffect(() => {
    if (existingToggleActive) {
      setActive(existingToggleActive);
    }
  }, [existingToggleActive]);

  useEffect(() => {
    if (existingDiscordChannel) {
      setDiscordChannel(existingDiscordChannel);
    }
  }, [existingDiscordChannel]);

  useEffect(() => {
    if (existingMessage) {
      setMessage(existingMessage);
    } else {
      setMessage(defaultMessage);
    }
  }, [existingMessage]);
  return (
    <>
      <NotificationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        channels={channels}
        discordChannel={discordChannel}
        setDiscordChannel={setDiscordChannel}
        message={message}
        setMessage={setMessage}
        orgDiscordAdditionalData={orgDiscordAdditionalData}
        orgId={orgId}
        channelType={channelType}
        editMessageKey={editMessageKey}
        updateOrgDiscordAdditionalData={updateOrgDiscordAdditionalData}
        title={title}
      />
      <NotificationWrapper>
        <NotificationHalves>
          <Box>
            <NotificationTitle>{title}</NotificationTitle>
            <NotificationDescription>{description}</NotificationDescription>
          </Box>
          <NotificationSwitchContainer>
            <NotificationSwitchInnerDiv
              active={active}
              onClick={() => {
                if (!discordChannel) {
                  setErrors("Please first select a channel");
                  return;
                }
                updateOrgDiscordAdditionalData({
                  variables: {
                    orgId,
                    additionalData: {
                      ...orgDiscordAdditionalData,
                      [`${channelType}Active`]: !active,
                    },
                  },
                });
                setActive(!active);
              }}
            >
              <NotificationSwitchText active={active}>ON</NotificationSwitchText>
            </NotificationSwitchInnerDiv>
            <NotificationSwitchInnerDiv
              active={!active}
              onClick={() => {
                if (!discordChannel) {
                  setErrors("Please first select a channel");
                  return;
                }
                updateOrgDiscordAdditionalData({
                  variables: {
                    orgId,
                    additionalData: {
                      ...orgDiscordAdditionalData,
                      [`${channelType}Active`]: !active,
                    },
                  },
                });
                setActive(!active);
              }}
            >
              <NotificationSwitchText active={!active}>OFF</NotificationSwitchText>
            </NotificationSwitchInnerDiv>
          </NotificationSwitchContainer>
        </NotificationHalves>
        {errors && (
          <Box paddingLeft="16px">
            <ErrorText>{errors}</ErrorText>
          </Box>
        )}
        <NotificationHalves>
          <Box display="flex" alignItems="center">
            <NotificationPostingToText>Posting to:</NotificationPostingToText>
            {discordChannelName ? (
              <ChannelContainer>
                <ChannelContainerText>#{discordChannelName}</ChannelContainerText>
              </ChannelContainer>
            ) : (
              <Box display="flex" alignItems={"center"} marginLeft="8px">
                <ButtonIconWrapper onClick={() => setOpenModal(true)}>
                  <AddIcon
                    sx={{
                      color: "black",
                    }}
                  />
                </ButtonIconWrapper>
                <AddChannelText>Add Channel</AddChannelText>
              </Box>
            )}
          </Box>
          <EditImg
            src={EditSvg}
            onClick={() => {
              setErrors(null);
              setOpenModal(true);
            }}
          />
        </NotificationHalves>
      </NotificationWrapper>
    </>
  );
};
const NotificationSettings = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [conditionName, setConditionName] = useState(null);

  const [hasMore, setHasMore] = useState(true);
  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
    fetchPolicy: "cache-and-network",
  });

  const [getGuildDiscordChannels, { data: guildDiscordChannelsData }] = useLazyQuery(GET_GUILD_DISCORD_CHANNELS, {
    fetchPolicy: "cache-and-network",
  });
  const guildId = orgDiscordConfig?.getCmtyOrgDiscordConfig?.guildId;
  const guildDiscordChannels = guildDiscordChannelsData?.getAvailableChannelsForDiscordGuild;
  const guildDiscordAdditionalData = orgDiscordConfig?.getCmtyOrgDiscordConfig?.additionalData;
  const channels = guildDiscordChannels?.map((channel) => ({
    label: channel.name,
    value: channel.id,
  }));
  useEffect(() => {
    if (guildId) {
      // fetch all guild channels
      getGuildDiscordChannels({
        variables: {
          guildId,
        },
      });
    }
  }, [guildId]);

  return (
    <Grid
      flex="1"
      width={{
        xs: "100%",
        sm: "70%",
      }}
    >
      <>
        {NOTIFICATIONS.map((notification) => (
          <NotificationSetting
            {...notification}
            channels={channels}
            orgDiscordAdditionalData={guildDiscordAdditionalData}
            orgId={activeOrg?.id}
          />
        ))}
      </>
    </Grid>
  );
};

export default NotificationSettings;
