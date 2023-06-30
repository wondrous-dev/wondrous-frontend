import { useMutation, useLazyQuery } from "@apollo/client";
import { makeUniqueId } from "@apollo/client/utilities";
import { Typography, Grid, Box } from "@mui/material";
import { CREATE_ORG_INVITE_LINK, KICK_ORG_USER } from "graphql/mutations";
import { GET_ORG_ADMINS, GET_ORG_ROLES } from "graphql/queries";
import Modal from "components/Shared/Modal";
import { UPDATE_ORG } from "graphql/mutations";
import { useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import EditSvg from "components/Icons/edit.svg";
import { getBaseUrl } from "utils/common";
import {
  ChannelContainer,
  ChannelContainerText,
  EditImg,
  NotificationDescription,
  NotificationHalves,
  NotificationPostingToText,
  NotificationSwitchContainer,
  NotificationSwitchInnerDiv,
  NotificationSwitchText,
  NotificationTitle,
  NotificationWrapper,
} from "./styles";

const CHANNEL_TYPE = {
  STICKY_MESSAGE: "sticky_message_channel",
  WELCOME_MESSAGE: "welcome_message_channel",
  GENERAL_NOTIFICATIONS: "general_notifications_channel",
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
    editMEssageKey: MESSAGE_TYPE.STICKY_MESSAGE,
  },
  {
    title: "Welcome Message",
    description: "This message will be posted whenever a new user joins the Discord.",
    channelType: CHANNEL_TYPE.WELCOME_MESSAGE,
    editMessageKey: MESSAGE_TYPE.WELCOME_MESSAGE,
  },
  {
    title: "General Notifications",
    description: "This channel will be used to post general notifications like new quests and quest reminders",
    channelType: CHANNEL_TYPE.GENERAL_NOTIFICATIONS,
  },
];

const NotificationSetting = (props) => {
  const {
    title,
    description,
    existingMessage,
    editMessageKey,
    existingDiscordChannel,
    channelType,
    existingToggleActive,
  } = props;
  const [editMessage, setEditMessage] = useState(existingMessage);
  const [updateOrg] = useMutation(UPDATE_ORG);
  const [discordChannel, setDiscordChannel] = useState(existingDiscordChannel);
  const [active, setActive] = useState(existingToggleActive);

  return (
    <NotificationWrapper>
      <NotificationHalves>
        <Box>
          <NotificationTitle>{title}</NotificationTitle>
          <NotificationDescription>{description}</NotificationDescription>
        </Box>
        <NotificationSwitchContainer>
          <NotificationSwitchInnerDiv active={active} onClick={() => setActive(!active)}>
            <NotificationSwitchText active={active}>ON</NotificationSwitchText>
          </NotificationSwitchInnerDiv>
          <NotificationSwitchInnerDiv active={!active} onClick={() => setActive(!active)}>
            <NotificationSwitchText active={!active}>OFF</NotificationSwitchText>
          </NotificationSwitchInnerDiv>
        </NotificationSwitchContainer>
      </NotificationHalves>
      <NotificationHalves>
        <Box display="flex" alignItems="center">
          <NotificationPostingToText>Posting to</NotificationPostingToText>
          <ChannelContainer>
            <ChannelContainerText>#anything</ChannelContainerText>
          </ChannelContainer>
        </Box>
        <EditImg src={EditSvg} />
      </NotificationHalves>
    </NotificationWrapper>
  );
};
const NotificationSettings = () => {
  const [getOrgAdmins, { data: orgAdminData }] = useLazyQuery(GET_ORG_ADMINS);
  const { activeOrg } = useContext(GlobalContext);
  useEffect(() => {
    if (activeOrg?.id) {
      getOrgAdmins({
        variables: {
          orgId: activeOrg?.id,
        },
      });
    }
  }, [activeOrg?.id]);
  const orgAdmins = orgAdminData?.getOrgAdmins || [];
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
          <NotificationSetting {...notification} />
        ))}
      </>
    </Grid>
  );
};

export default NotificationSettings;
