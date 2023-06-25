import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Label } from "components/CreateTemplate/styles";
import SelectComponent from "components/Shared/Select";
import { StyledViewQuestResults } from "./styles";
import { ErrorText, SharedSecondaryButton } from "components/Shared/styles";
import Modal from "components/Shared/Modal";
import { PUSH_QUEST_DISCORD_NOTFICATION } from "graphql/mutations/discord";
import { useMutation } from "@apollo/client";
import useAlerts from "utils/hooks";
import Switch from "components/Shared/Switch";
import TextField from "components/Shared/TextField";

const PublishQuestModal = ({ onClose, channelName, handlePublish, message, setMessage }) => {
  return (
    <Grid display="flex" flexDirection="column" gap="10px" width="10)%">
      <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px" color="#06040A">
        Are you sure you want to publish this quest to #{channelName} in Discord?
      </Typography>
      <Box display="flex" gap="10px" alignItems="center" width="100%">
        <Label
          style={{
            marginRight: "8px",
          }}
        >
          Channel Message (please edit as you like)
        </Label>
      </Box>
      <Box width="100%" marginBottom="8px">
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
      <Box display="flex" gap="10px" alignItems="center" width="100%">
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
          onClick={handlePublish}
        >
          Publish
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};
const PublishQuestCardBody = ({ guildDiscordChannels, quest, orgId, existingNotificationChannelId }) => {
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [autoNotifications, setAutoNotifications] = useState(false);
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();
  const [errors, setErrors] = useState(null);
  const [mentionChannel, setMentionChannel] = useState(false);
  const [message, setMessage] = useState(
    `@here ${quest?.title} is now available! Check it out here and make a submission`
  );
  const [publishQuest] = useMutation(PUSH_QUEST_DISCORD_NOTFICATION, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertAnchorOrigin({
        vertical: "top",
        horizontal: "center",
      });
      setOpenPublishModal(false);
    },
  });
  const channels = guildDiscordChannels?.map((channel) => ({
    label: channel.name,
    value: channel.id,
  }));
  const [channel, setChannel] = useState(null);
  useEffect(() => {
    if (guildDiscordChannels?.length && !existingNotificationChannelId) {
      setChannel(guildDiscordChannels[0].id);
    } else if (existingNotificationChannelId) {
      setChannel(existingNotificationChannelId);
    }
  }, [guildDiscordChannels]);

  return (
    <>
      <Modal
        open={openPublishModal}
        onClose={() => setOpenPublishModal(false)}
        title="Publish quest to Discord channel"
      >
        <PublishQuestModal
          onClose={() => setOpenPublishModal(false)}
          channelName={channels?.find((c) => c.value === channel)?.label}
          setMessage={setMessage}
          message={message}
          handlePublish={() =>
            publishQuest({
              variables: {
                questId: quest.id,
                questTitle: quest.title,
                orgId,
                channelId: channel,
                mentionChannel,
                message,
              },
            })
          }
        />
      </Modal>
      <Grid display="flex" justifyContent="flex-start" alignItems="center" width="100%">
        <Label>Discord Channel</Label>
        <SelectComponent
          boxStyle={{
            flex: 1,
          }}
          options={channels}
          background="#C1B6F6"
          value={channel}
          onChange={(value) => setChannel(value)}
        />
      </Grid>
      <Grid display="flex" justifyContent="flex-start" alignItems="center" width="100%" marginTop={"8px"}>
        <Label>Auto notifications</Label>
        <Switch
          value={autoNotifications}
          onChange={() => {
            if (!autoNotifications && !channel) {
              setErrors({
                discordChannel: "Please select a channel to send auto notifications to",
              });
            } else {
              setAutoNotifications(!autoNotifications);
            }
          }}
        />
      </Grid>
      {errors?.discordChannel && (
        <ErrorText
          style={{
            marginTop: "-4px",
            fontSize: "12px",
          }}
        >
          {errors?.discordChannel}
        </ErrorText>
      )}
      <Box display="flex" width={"100%"} marginTop="8px">
        <Box flex={1} />
        <SharedSecondaryButton disabled={!channel} onClick={() => setOpenPublishModal(true)}>
          Publish
        </SharedSecondaryButton>
      </Box>
    </>
  );
};

export default PublishQuestCardBody;
