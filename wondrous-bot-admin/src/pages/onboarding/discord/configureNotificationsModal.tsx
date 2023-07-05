import Modal from "components/Shared/Modal";
import AddIcon from "@mui/icons-material/Add";
import {
  ChannelContainer,
  ChannelText,
  ConnectWonderbotDescription,
  ConnectWonderbotImg,
  ConnectWonderbotText,
  HashtagContainer,
  Hashtag,
  NewChannelInput,
} from "./styles";

import { ButtonIconWrapper, ErrorText, SharedSecondaryButton } from "components/Shared/styles";
import { Box, Checkbox } from "@mui/material";
import { getDiscordBotOauthURL } from "components/ConnectDiscord/ConnectDiscordButton";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_GUILD_DISCORD_CHANNELS } from "graphql/queries/discord";
import { useEffect, useState } from "react";
import { GET_CMTY_ORG_DISCORD_CONFIG, GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL } from "graphql/queries";
import { CONFIGURE_ORG_DISCORD_NOTIFICATION } from "graphql/mutations/discord";

const CreateNewChannel = (props) => {
  const { createNewChannel, setCreateNewChannel, setNotificationChannel, setError } = props;
  const [clicked, setClicked] = useState(false);
  return (
    <ChannelContainer
      onClick={() => {
        if (!clicked) {
          setNotificationChannel(null);
          setClicked(!clicked);
        }
      }}
    >
      {clicked ? (
        <>
          <HashtagContainer>
            <Hashtag>#</Hashtag>
          </HashtagContainer>
          <NewChannelInput
            autoFocus
            style={{
              ".MuiInput-input": {
                fontWeight: "500",
              },
            }}
            value={createNewChannel}
            onChange={(e) => {
              if (!e.target.value) {
                setCreateNewChannel(e.target.value.split(" ").join("-").toLowerCase());
                setError(null);
                setClicked(false);
              }
              setCreateNewChannel(e.target.value.split(" ").join("-").toLowerCase());
            }}
          />
        </>
      ) : (
        <>
          <ButtonIconWrapper
            style={{
              marginRight: "10px",
              marginLeft: "6px",
            }}
          >
            <AddIcon
              sx={{
                color: "black",
              }}
            />
          </ButtonIconWrapper>
          <ChannelText>Create new channel</ChannelText>
        </>
      )}
    </ChannelContainer>
  );
};

const ChannelSelect = (props) => {
  const { channel, createNewChannel, setNotificationChannel, notificationChannel, setError } = props;
  return (
    <ChannelContainer
      onClick={() => {
        if (createNewChannel) {
          setError(
            'You have opted to create a new channel. Please remove the text from the "Create new channel" input field to continue.'
          );
          return;
        }
        if (channel.value === notificationChannel) {
          setNotificationChannel(null);
        } else {
          setNotificationChannel(channel.value);
        }
      }}
    >
      <Checkbox
        checked={channel.value === notificationChannel}
        sx={{
          color: "rgba(181, 181, 181, 1)",
          "&.Mui-checked": {
            color: "rgba(42, 141, 92, 1)",
          },
        }}
      />
      <ChannelText>#{channel.label}</ChannelText>
    </ChannelContainer>
  );
};
export const ConfigureNotificationsOnboardingModal = ({ open, onClose, orgId }) => {
  const [configureDiscord] = useMutation(CONFIGURE_ORG_DISCORD_NOTIFICATION, {
    refetchQueries: [GET_CMTY_ORG_DISCORD_CONFIG],
  });

  const [createNewChannel, setCreateNewChannel] = useState("");
  const [error, setError] = useState(null);
  const [notificationChannel, setNotificationChannel] = useState(null);
  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId,
    },
    skip: !orgId,
  });

  const [getGuildDiscordChannels, { data: guildDiscordChannelsData }] = useLazyQuery(GET_GUILD_DISCORD_CHANNELS);
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
    <Modal open={open} onClose={onClose} noHeader title="" maxWidth={600}>
      <Box display="flex" flexDirection={"column"} justifyContent={"center"}>
        <ConnectWonderbotText>Configure notifications channel</ConnectWonderbotText>
        <ConnectWonderbotDescription>
          Which channel will you want to send notifications to? Selecting this now won’t send any notifications until
          you’ve activated your first quests.
        </ConnectWonderbotDescription>
        {error && (
          <ErrorText
            style={{
              marginTop: "-16px",
              marginBottom: "8px",
            }}
          >
            {error}
          </ErrorText>
        )}
        <Box marginBottom={"16px"} maxHeight="60vh" overflow={"scroll"}>
          <CreateNewChannel
            createNewChannel={createNewChannel}
            setCreateNewChannel={setCreateNewChannel}
            setNotificationChannel={setNotificationChannel}
            setError={setError}
          />
          {channels?.map((channel) => (
            <ChannelSelect
              channel={channel}
              notificationChannel={notificationChannel}
              setNotificationChannel={setNotificationChannel}
              createNewChannel={createNewChannel}
              setError={setError}
            />
          ))}
        </Box>
        <SharedSecondaryButton
          onClick={() => {
            configureDiscord({
              variables: {
                orgId,
                ...(createNewChannel && {
                  newChannel: createNewChannel,
                }),
                ...(notificationChannel && {
                  channelId: notificationChannel,
                }),
              },
            });
            onClose();
          }}
        >
          Update
        </SharedSecondaryButton>
        <SharedSecondaryButton
          style={{
            border: "none",
            color: "rgba(109, 109, 109, 1)",
            outline: "0",
          }}
          $reverse
          onClick={onClose}
        >
          Skip for now
        </SharedSecondaryButton>
      </Box>
    </Modal>
  );
};
